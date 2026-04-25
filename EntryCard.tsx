import { motion } from 'motion/react';
import { Play, Mic, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { JournalEntry } from '../types';
import { formatDate, formatTime } from '../lib/utils';

interface EntryCardProps {
  entry: JournalEntry;
  onClick: (entry: JournalEntry) => void;
}

export function EntryCard({ entry, onClick }: EntryCardProps) {
  const hasImages = entry.media.some(m => m.type === 'image');
  const hasVideo = entry.media.some(m => m.type === 'video');
  const hasAudio = entry.media.some(m => m.type === 'audio');

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="timeline-item group"
    >
      <div className="text-[9px] text-brand-muted group-hover:text-brand-accent/40 font-bold tracking-[0.3em] mb-3 uppercase transition-colors">
        {formatTime(entry.timestamp)}
      </div>
      
      <div className="flex items-start gap-4">
        <div className="flex-grow">
          <p className="text-[13px] font-serif italic text-white/50 group-hover:text-white/80 truncate leading-relaxed transition-colors">
            {entry.title || entry.content || "fragment of a memory..."}
          </p>
          <div className="mt-3 flex gap-4 opacity-10 group-hover:opacity-40 transition-opacity">
            {hasAudio && <Mic size={10} />}
            {hasVideo && <Video size={10} />}
            {hasImages && <ImageIcon size={10} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
