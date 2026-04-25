import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

import { getRandomQuote } from '../constants';

interface PasswordGateProps {
  onUnlock: (password: string) => void;
  error?: string;
}

export function PasswordGate({ onUnlock, error }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [quote] = useState(getRandomQuote);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onUnlock(password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-16 px-4">
          <motion.h1 
            initial={{ letterSpacing: '0.1em', opacity: 0 }}
            animate={{ letterSpacing: '0.3em', opacity: 0.9 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="text-7xl font-display font-medium text-white tracking-[0.2em] mb-6"
          >
            HIRAETH
          </motion.h1>
          <p className="text-white/80 font-quote text-xs tracking-[0.4em] uppercase">
            {quote}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="archive identity key"
              className={cn(
                "w-full bg-transparent border-b border-white/[0.03] py-6 px-4 outline-none text-center transition-all duration-1000",
                "focus:border-brand-accent/20 placeholder:text-neutral-900 font-mono tracking-[0.5em] text-xs lowercase",
                error && "border-red-900/30"
              )}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-900 hover:text-brand-accent/20 transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-500/20 text-[9px] text-center font-light uppercase tracking-[0.4em]"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full group mt-16 flex items-center justify-center gap-4 text-neutral-600 hover:text-brand-accent transition-all duration-700 py-5 border border-white/[0.02] hover:border-white/[0.05] uppercase text-[9px] tracking-[0.4em] font-serif italic"
          >
            open chronology
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform opacity-30" />
          </button>
        </form>

        <div className="mt-32 text-center">
          <div className="inline-flex items-center gap-3 text-[9px] text-neutral-800 uppercase tracking-[0.4em]">
            <Lock size={10} className="opacity-20" />
            Encrypted Core Architecture
          </div>
        </div>
      </motion.div>
    </div>
  );
}
