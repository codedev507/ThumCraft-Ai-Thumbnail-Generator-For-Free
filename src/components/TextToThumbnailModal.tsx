import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Loader2, Image as ImageIcon, Flame, Check } from 'lucide-react';
import { CanvasLayer } from '../types/thumbnail';

interface TextToThumbnailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedThumbnail: (layers: CanvasLayer[], backgroundColor: string, title: string) => void;
}

export const TextToThumbnailModal: React.FC<TextToThumbnailModalProps> = ({
  isOpen,
  onClose,
  onApplyGeneratedThumbnail,
}) => {
  const [textPrompt, setTextPrompt] = useState('');
  const [style, setStyle] = useState('mrbeast');
  const [genre, setGenre] = useState('Technology & Creator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'I spent 100 hours trapped in an abandoned high-tech underground vault with an autonomous AI',
    'How I built a $50,000/month automated SaaS with zero coding in 30 days',
    'Human vs AI coding championship: who builds an app faster?',
    'The dark secret behind luxury supercars that billionaires hide',
    'I tested the most dangerous fitness challenge in the world',
  ];

  const handleGenerate = async () => {
    if (!textPrompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/text-to-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textPrompt,
          style,
          genre,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.layers) {
        onApplyGeneratedThumbnail(data.layers, data.backgroundColor || '#09090B', data.title || textPrompt);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate thumbnail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-white">AI Text-to-Thumbnail Generator</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Full Composite Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Input your video idea, script, or prompt — Gemini generates the artwork, hook text, and viral layout in one click.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-200 block">
              Describe your video or paste your script/idea
            </label>
            <textarea
              rows={4}
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="e.g. I Spent 100 Hours Building an AI Robot That Controls My Smart Home... or a full paragraph explaining the climax and big stakes!"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-100 focus:border-amber-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Quick Idea Prompts */}
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1.5">
              Try a Viral Concept Prompt:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => setTextPrompt(qp)}
                  className="text-[10px] text-zinc-300 bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/80 transition-colors text-left truncate max-w-xs"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Style & Genre Controls */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Visual Style Archetype</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
              >
                <option value="mrbeast">MrBeast Viral High-Contrast (Yellow/Cyan Shock)</option>
                <option value="mystery">Dark Mystery & Censored Exposed (Crimson/Obsidian)</option>
                <option value="versus">Split Screen Versus Showdown ($1 vs $1M)</option>
                <option value="cyberpunk">Cyberpunk Neon Tech (Violet/Lime)</option>
                <option value="minimalist">Clean Authority Minimalist (Monochrome Studio)</option>
                <option value="luxury">Gold Luxury Wealth (Emerald/Gold Foil)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Channel Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 outline-none"
              >
                <option value="Technology & Creator">Technology & AI</option>
                <option value="Gaming & Esports">Gaming & Challenges</option>
                <option value="Finance & Wealth">Finance, Business & Crypto</option>
                <option value="Fitness & Health">Fitness & Transformation</option>
                <option value="Documentary & True Crime">Documentary & Mystery</option>
                <option value="Education & Science">Education & Science</option>
              </select>
            </div>
          </div>

          {/* 4-Track System Architecture Card */}
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Decoupled 4-Track Architecture Pipeline</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
                <span className="text-amber-400 font-bold block mb-0.5">Track 1</span>
                <span className="text-zinc-200 font-semibold block">Prompt Dissector</span>
                <span className="text-zinc-500 text-[9px]">Art Director LLM</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
                <span className="text-emerald-400 font-bold block mb-0.5">Track 2</span>
                <span className="text-zinc-200 font-semibold block">Environment Gen</span>
                <span className="text-zinc-500 text-[9px]">Clean 16:9 BG (No Text)</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
                <span className="text-cyan-400 font-bold block mb-0.5">Track 3</span>
                <span className="text-zinc-200 font-semibold block">Alpha Character</span>
                <span className="text-zinc-500 text-[9px]">Transparent Cutout</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
                <span className="text-rose-400 font-bold block mb-0.5">Track 4</span>
                <span className="text-zinc-200 font-semibold block">Typography Hydration</span>
                <span className="text-zinc-500 text-[9px]">Moveable Vectors</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !textPrompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-400 hover:to-red-500 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Artwork, Hook Typography & Layout with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Full Thumbnail (Text to Canvas)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
