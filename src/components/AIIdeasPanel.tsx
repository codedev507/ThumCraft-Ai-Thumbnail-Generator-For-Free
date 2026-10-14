import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Wand2, Lightbulb, TrendingUp } from 'lucide-react';
import { AIConceptIdea } from '../types/thumbnail';

interface AIIdeasPanelProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  niche: string;
  onApplyConcept: (concept: AIConceptIdea) => void;
}

export const AIIdeasPanel: React.FC<AIIdeasPanelProps> = ({
  isOpen,
  onClose,
  videoTitle,
  niche,
  onApplyConcept,
}) => {
  const [title, setTitle] = useState(videoTitle || 'I Spent 100 Hours Building an AI Robot');
  const [selectedNiche, setSelectedNiche] = useState(niche || 'Technology & Coding');
  const [stylePreference, setStylePreference] = useState('High Contrast Hyper-Arousal');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ strategySummary?: string; concepts?: AIConceptIdea[] } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: title,
          niche: selectedNiche,
          stylePreference,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Gemini AI Thumbnail Strategist</h2>
              <p className="text-xs text-zinc-400">
                Transforms video titles into viral high-converting visual concepts and curiosity hooks.
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

        {/* Input Bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 grid grid-cols-12 gap-3 items-end">
          <div className="col-span-5">
            <label className="text-[11px] font-bold text-zinc-400 block mb-1">Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I Made $50k in 30 Days"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:border-purple-400 outline-none"
            />
          </div>

          <div className="col-span-3">
            <label className="text-[11px] font-bold text-zinc-400 block mb-1">Niche</label>
            <input
              type="text"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              placeholder="e.g. Finance, Gaming, Tech"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:border-purple-400 outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="text-[11px] font-bold text-zinc-400 block mb-1">Style Tone</label>
            <select
              value={stylePreference}
              onChange={(e) => setStylePreference(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 focus:border-purple-400 outline-none"
            >
              <option value="High Contrast Hyper-Arousal">MrBeast Shock</option>
              <option value="Dark Mystery & Exposed">Curiosity Mystery</option>
              <option value="Minimal Authority">Clean Authority</option>
              <option value="Split Screen Versus">Versus Battle</option>
            </select>
          </div>

          <div className="col-span-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !title.trim()}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Concepts</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!result && !loading && (
            <div className="text-center py-12 text-zinc-500 space-y-2">
              <Lightbulb className="w-8 h-8 text-purple-400 mx-auto opacity-60" />
              <p className="text-sm font-semibold text-zinc-400">
                Enter your video title above and click "Generate Concepts"
              </p>
              <p className="text-xs">
                Gemini will craft 4 strategic thumbnail concepts with proven CTR psychology.
              </p>
            </div>
          )}

          {result?.strategySummary && (
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Winning Strategy Synthesis</span>
                {result.strategySummary}
              </div>
            </div>
          )}

          {result?.concepts && (
            <div className="grid grid-cols-2 gap-4">
              {result.concepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-purple-500/50 flex flex-col justify-between space-y-3 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {concept.category}
                      </span>
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        CTR {concept.predictedCTR}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-white">{concept.title}</h3>

                    {/* Overlay Text Display */}
                    <div
                      className="p-3 rounded-lg border border-black/40 text-center font-['Anton'] font-black text-2xl tracking-wider shadow"
                      style={{
                        backgroundColor: '#09090B',
                        color: concept.primaryColor || '#FFE600',
                        textShadow: `0 2px 8px ${concept.accentColor || '#000'}80`,
                      }}
                    >
                      {concept.overlayText}
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-snug">
                      <strong className="text-zinc-200">Composition:</strong> {concept.visualComposition}
                    </p>

                    <p className="text-[10px] text-zinc-400 italic">
                      💡 {concept.psychologicalTrigger}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onApplyConcept(concept);
                      onClose();
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Load This Concept to Canvas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
