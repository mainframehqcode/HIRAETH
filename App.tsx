import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  LogOut, 
  Search, 
  Trash2, 
  Mic, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Settings,
  Pencil
} from 'lucide-react';
import { PasswordGate } from './components/PasswordGate';
import { EntryComposer } from './components/EntryComposer';
import { EntryCard } from './components/EntryCard';
import { JournalEntry } from './types';
import { cn, formatDate, formatTime, getDayOfWeek, formatDateCaps } from './lib/utils';
import { getRandomQuote } from './constants';

const ACCESS_KEY = 'hiraeth'; // Simple local access key

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [accessKey, setAccessKey] = useState<string>(() => localStorage.getItem('hiraeth_key') || 'hiraeth');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [quote] = useState(getRandomQuote);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('hiraeth_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved entries');
      }
    }
    
    const savedKey = localStorage.getItem('hiraeth_key');
    if (savedKey) setAccessKey(savedKey);
  }, []);

  useEffect(() => {
    localStorage.setItem('hiraeth_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('hiraeth_key', accessKey);
  }, [accessKey]);

  const handleUnlock = (password: string) => {
    if (password.toLowerCase() === accessKey.toLowerCase()) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('INVALID ACCESS KEY');
    }
  };

  const handleSaveEntry = (entryData: Partial<JournalEntry>) => {
    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...e, ...entryData } as JournalEntry : e));
      setEditingEntry(null);
    } else {
      const newEntry: JournalEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        content: entryData.content || '',
        media: entryData.media || [],
        ...entryData
      } as JournalEntry;

      setEntries(prev => [newEntry, ...prev]);
    }
    setIsComposing(false);
  };

  const deleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Erase this memory forever?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const filteredEntries = entries.filter(e => 
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || filteredEntries[0];

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={handleUnlock} error={authError} />;
  }

  return (
    <div className="h-screen bg-brand-bg text-[#D4D4D8] font-sans flex flex-col overflow-hidden select-none">
      {/* Header Navigation */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 flex-shrink-0">
        <div className="flex items-center gap-6">
          <span className="font-display text-2xl tracking-[0.2em] text-white uppercase">HIRAETH</span>
          <span className="h-6 w-[1px] bg-white/10"></span>
          <span className="font-quote text-[10px] text-white/50 uppercase tracking-[0.3em]">{quote}</span>
        </div>
        <div className="flex items-center gap-8 text-neutral-600">
          <div className="flex items-center gap-2 opacity-60">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="QUERIES" 
              className="bg-transparent border-none outline-none text-[9px] uppercase tracking-widest w-24 placeholder:text-neutral-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-brand-accent transition-colors"
          >
            <Settings size={16} />
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="px-5 py-2 border border-white/10 hover:border-white/30 text-[9px] uppercase tracking-[0.3em] font-serif transition-all hover:bg-white/[0.02]">
            Close
          </button>
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden">
        {/* Sidebar: Chronology */}
        <aside className="w-80 border-r border-white/10 flex flex-col bg-brand-sidebar">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 italic">Chronology</span>
            <button 
              onClick={() => {
                setEditingEntry(null);
                setIsComposing(true);
              }}
              className="p-1 hover:text-brand-accent transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {filteredEntries.map((entry, idx) => (
              <div key={entry.id} className="relative group">
                <div onClick={() => setSelectedEntryId(entry.id)}>
                  <EntryCard 
                    entry={entry} 
                    onClick={() => {}} 
                  />
                  {selectedEntryId === entry.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-accent/30" />
                  )}
                </div>
                <button 
                   onClick={(e) => deleteEntry(entry.id, e)}
                   className="absolute top-6 right-4 opacity-0 group-hover:opacity-40 hover:!opacity-100 text-red-500 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content: Entry View */}
        <section className="flex-grow flex flex-col overflow-y-auto custom-scrollbar bg-brand-bg">
          {selectedEntry ? (
            <div className="max-w-4xl mx-auto w-full py-20 px-12 md:px-24">
              {/* Specialized Header from Screenshot */}
              <header className="mb-20 text-right">
                <motion.h2 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-7xl font-display italic text-white/90 leading-none mb-4"
                >
                  {getDayOfWeek(selectedEntry.timestamp)}
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  className="text-[10px] uppercase font-bold tracking-[0.6em] text-white"
                >
                  {formatDateCaps(selectedEntry.timestamp)}
                </motion.div>
              </header>

              <div className="flex flex-col lg:flex-row gap-20 items-start">
                {/* Left Column: Narrative */}
                <article className="flex-grow lg:w-1/2 space-y-12">
                  <div className="space-y-8">
                    <div className="flex justify-between items-center group">
                      <h1 className="text-4xl font-display font-medium text-white/95 leading-tight tracking-tight max-w-2xl">
                        {selectedEntry.title}
                      </h1>
                      <button 
                        onClick={() => {
                          setEditingEntry(selectedEntry);
                          setIsComposing(true);
                        }}
                        className="p-3 border border-white/5 rounded-full opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-all text-neutral-400"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                    
                    <div className="h-[1px] w-12 bg-brand-accent/20"></div>

                    <p className="text-xl leading-[1.8] text-[#A1A1AA] font-light italic whitespace-pre-wrap selection:bg-brand-accent selection:text-black">
                      {selectedEntry.content}
                    </p>
                  </div>
                </article>

                {/* Right Column: Media Fragments Grid - Styled like Screenshot */}
                <div className="lg:w-1/2 space-y-12 w-full">
                  {selectedEntry.media.filter(m => m.type === 'image').map((m, i) => (
                    <div key={i} className="relative group overflow-hidden bg-white/[0.02] w-full">
                      <img 
                        src={m.url} 
                        alt="" 
                        className="w-full aspect-[4/5] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                      />
                      <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10">
                        <span className="text-[9px] font-mono tracking-[0.2em] text-white/80 uppercase">
                          0{i+1}. {selectedEntry.title || "fragment"} / {formatTime(selectedEntry.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {selectedEntry.media.filter(m => m.type === 'audio').map((m, i) => (
                    <div key={i} className="bg-[#111111] border border-white/5 p-8 w-full">
                      <div className="flex justify-between items-start mb-10">
                        <span className="text-[10px] font-mono tracking-[0.3em] opacity-40 uppercase">Voice Note 0{i+1}</span>
                        <span className="text-[10px] font-mono tracking-[0.3em] opacity-40">{formatTime(selectedEntry.timestamp)}</span>
                      </div>
                      
                      {/* Waveform Visualizer simulation */}
                      <div className="flex items-end gap-1 h-12 mb-8">
                        {[40, 60, 30, 80, 50, 90, 40, 70, 30, 85, 45, 65, 35].map((h, idx) => (
                          <div 
                            key={idx} 
                            style={{ height: `${h}%` }} 
                            className={cn(
                              "flex-1 bg-white transition-all duration-1000",
                              idx > 6 ? "opacity-20" : "opacity-90"
                            )} 
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-6">
                        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                           <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                        <div className="flex-grow h-[1px] bg-white/10 relative">
                           <div className="absolute h-full w-1/3 bg-white/40"></div>
                        </div>
                      </div>
                      <audio src={m.url} className="hidden" />
                    </div>
                  ))}

                  {selectedEntry.media.filter(m => m.type === 'video').map((m, i) => (
                    <div key={i} className="aspect-video bg-black relative group outline outline-1 outline-white/5 w-full">
                      <video src={m.url} controls className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                    </div>
                  ))}
                  
                  {/* Attach Video Placeholder - from screenshot */}
                  <div className="border border-dashed border-white/10 aspect-[16/6] flex flex-col items-center justify-center gap-4 group hover:border-white/20 transition-all cursor-pointer w-full">
                    <Video size={24} className="opacity-10 group-hover:opacity-30 transition-opacity" />
                    <span className="text-[8px] uppercase tracking-[0.5em] opacity-20 group-hover:opacity-40">Attach Fragment</span>
                  </div>
                </div>
              </div>

              {/* Floating Action Bar re-styled */}
              <div 
                onClick={() => {
                  setEditingEntry(null);
                  setIsComposing(true);
                }}
                className="mt-32 h-16 border-t border-white/5 flex items-center justify-center gap-12 cursor-pointer group"
              >
                <div className="flex items-center gap-4 text-neutral-600 group-hover:text-white transition-all">
                  <Plus size={16} />
                  <span className="text-[10px] uppercase tracking-[0.5em] font-serif italic">New Fragment</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 mb-8 border border-white/5 rounded-full flex items-center justify-center opacity-20">
                <FileText size={32} />
              </div>
              <h2 className="text-2xl font-serif italic mb-4 opacity-50">Archive is silent</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-30 max-w-xs leading-loose">
                Your chronology awaits its first fragment. Capture a pulse of time to begin.
              </p>
              <button 
                onClick={() => {
                  setEditingEntry(null);
                  setIsComposing(true);
                }}
                className="mt-12 px-10 py-4 border border-white/5 hover:border-brand-accent/20 text-[9px] uppercase tracking-[0.5em] transition-all font-serif italic hover:bg-white/[0.01]"
              >
                Initialize Record
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer Decorations */}
      <footer className="h-12 border-t border-white/5 px-10 flex items-center justify-between text-[9px] uppercase tracking-[0.5em] opacity-20 flex-shrink-0">
        <span>STABLE CHRONOLOGICAL SYNC ACTIVE</span>
        <span>© MMXXVI HIRAETH ARCHIVE</span>
      </footer>

      {/* Modals */}
      <AnimatePresence mode="wait">
        {(isComposing || editingEntry) && (
          <EntryComposer 
            initialData={editingEntry}
            onSave={handleSaveEntry} 
            onCancel={() => {
              setIsComposing(false);
              setEditingEntry(null);
            }} 
          />
        )}
        
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="w-full max-w-sm bg-brand-paper border border-white/5 p-12 rounded-sm shadow-2xl space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-serif italic text-white">System Configuration</h2>
                <p className="text-[9px] uppercase tracking-[0.4em] opacity-40">Security Matrix Management</p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[8px] uppercase tracking-[0.6em] opacity-40 font-bold ml-4">Access Key</label>
                  <input
                    type="text"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-full py-4 px-6 text-center text-sm font-mono tracking-widest outline-none focus:border-brand-accent/30 transition-all text-brand-accent"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-4 bg-white/5 border border-white/10 hover:border-brand-accent/40 text-[9px] uppercase tracking-[0.6em] transition-all"
              >
                Apply & Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

