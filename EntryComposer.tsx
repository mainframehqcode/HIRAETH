import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Mic, 
  Video, 
  Image as ImageIcon, 
  X, 
  Send,
  Loader2,
  Square
} from 'lucide-react';
import { useAudioRecorder, useVideoRecorder } from '../hooks/useMediaRecorder';
import { useDropzone } from 'react-dropzone';
import { cn } from '../lib/utils';
import { JournalEntry } from '../types';

interface EntryComposerProps {
  onSave: (entry: Partial<JournalEntry>) => void;
  onCancel: () => void;
  initialData?: JournalEntry | null;
}

export function EntryComposer({ onSave, onCancel, initialData }: EntryComposerProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [media, setMedia] = useState<string[]>(initialData?.media?.filter(m => m.type === 'image').map(m => m.url) || []);
  
  const initialAudio = initialData?.media?.find(m => m.type === 'audio')?.url || null;
  const initialVideo = initialData?.media?.find(m => m.type === 'video')?.url || null;

  const { 
    isRecording: isAudioRecording, 
    audioUrl, 
    error: audioError,
    startRecording: startAudio, 
    stopRecording: stopAudio, 
    clearRecording: clearAudio 
  } = useAudioRecorder();
  
  const { 
    isRecording: isVideoRecording, 
    videoUrl, 
    error: videoError,
    startRecording: startVideo, 
    stopRecording: stopVideo, 
    clearRecording: clearVideo 
  } = useVideoRecorder();

  // Use initial media if no new recording
  const finalAudioUrl = audioUrl || initialAudio;
  const finalVideoUrl = videoUrl || initialVideo;

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setMedia(prev => [...prev, url]);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [], 'audio/*': [] }
  });

  const handleSave = () => {
    if (!title.trim() && !content.trim() && !media.length && !finalAudioUrl && !finalVideoUrl) return;

    const newMedia: any[] = media.map(url => ({ id: Math.random().toString(), url, type: 'image' }));
    if (finalAudioUrl) newMedia.push({ id: 'audio-rec', url: finalAudioUrl, type: 'audio' });
    if (finalVideoUrl) newMedia.push({ id: 'video-rec', url: finalVideoUrl, type: 'video' });

    onSave({
      ...initialData,
      title,
      content,
      media: newMedia,
      timestamp: initialData ? initialData.timestamp : Date.now()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-12"
    >
      <div className="w-full max-w-4xl bg-[#121212] border border-white/10 rounded-[32px] shadow-2xl flex flex-col p-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-serif text-brand-accent/70 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            Active Membrane
          </h2>
          <button onClick={onCancel} className="text-neutral-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fragment Title"
            className="w-full bg-transparent border-none outline-none text-4xl font-serif text-[#F4F4F5] italic placeholder:text-neutral-800"
            autoFocus
          />
          <div className="h-px w-24 bg-white/10" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Documenting a moment..."
            className="w-full bg-transparent border-none outline-none resize-none text-lg font-sans font-light placeholder:text-neutral-800 min-h-[160px] leading-relaxed text-[#D4D4D8]"
          />

          {/* Media Preview Grid */}
          <div className="flex flex-wrap gap-4">
            {media.map((url, i) => (
              <div key={i} className="relative w-24 aspect-square rounded-sm overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setMedia(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {finalAudioUrl && (
              <div className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-sm flex items-center gap-4">
                <Mic size={16} className="text-brand-accent/50" />
                <audio src={finalAudioUrl} controls className="flex-1 h-6 opacity-40 hover:opacity-100 transition-opacity" />
                <button 
                  onClick={() => {
                    if (audioUrl) clearAudio();
                    // if it was initial audio, we can't really "delete" it here without logic to remove from initialData
                    // but for simplicity we just remove it from preview if we added a way to clear it
                  }} 
                  className="text-neutral-600 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-6">
          {(audioError || videoError) && (
            <div className="text-[10px] text-red-500/80 uppercase tracking-widest bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-center">
              {audioError || videoError} — please ensure microphone and camera permissions are enabled.
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
            <button
              {...getRootProps()}
              className="group flex items-center gap-2 text-neutral-500 hover:text-brand-accent transition-colors"
            >
              <input {...getInputProps()} />
              <ImageIcon size={18} className="opacity-40 group-hover:opacity-100" />
              <span className="text-[9px] uppercase tracking-widest hidden sm:inline">Visual</span>
            </button>
            <button
              onClick={isAudioRecording ? stopAudio : startAudio}
              className={cn(
                "group flex items-center gap-2 transition-colors",
                isAudioRecording ? "text-red-500" : "text-neutral-500 hover:text-brand-accent"
              )}
            >
              {isAudioRecording ? <Square size={18} /> : <Mic size={18} className="opacity-40 group-hover:opacity-100" />}
              <span className="text-[9px] uppercase tracking-widest hidden sm:inline">
                {isAudioRecording ? "Recording..." : "Voice"}
              </span>
            </button>
            <button
              onClick={isVideoRecording ? stopVideo : startVideo}
              className={cn(
                "group flex items-center gap-2 transition-colors",
                isVideoRecording ? "text-red-500" : "text-neutral-500 hover:text-brand-accent"
              )}
            >
              {isVideoRecording ? <Square size={18} /> : <Video size={18} className="opacity-40 group-hover:opacity-100" />}
              <span className="text-[9px] uppercase tracking-widest hidden sm:inline">
                {isVideoRecording ? "Capturing..." : "Video"}
              </span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={!title.trim() && !content.trim() && !media.length && !finalAudioUrl && !finalVideoUrl}
            className="px-10 py-3 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] uppercase tracking-[0.3em] font-serif italic hover:bg-brand-accent hover:text-black transition-all rounded-full disabled:opacity-20"
          >
            {initialData ? 'Update Archive' : 'Seal Entry'}
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);
}
