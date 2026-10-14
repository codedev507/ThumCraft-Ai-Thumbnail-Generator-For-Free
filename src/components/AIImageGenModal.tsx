import React, { useState } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Plus, Check } from 'lucide-react';

interface AIImageGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (dataUrl: string, promptName: string) => void;
}

export const AIImageGenModal: React.FC<AIImageGenModalProps> = ({
  isOpen,
  onClose,
  onImageGenerated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'A shocked young tech creator reacting with wide eyes in a neon cyber studio',
    'A dramatic split between a broken cheap rusty laptop and a glowing futuristic supercomputer',
    'A shadowy silhouette pointing at a classified glowing red folder on a dark desk',
    'A luxurious vault overflowing with gold bars and emerald lasers, cinematic lighting',
    'An exhausted runner crossing a glowing finish line at midnight, extreme lens flare',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Image generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertToCanvas = () => {
    if (!generatedImage) return;
    onImageGenerated(generatedImage, prompt.slice(0, 30));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Gemini AI Artwork Generator</h2>
              <p className="text-xs text-zinc-400">
                Generate high-converting cinematic backdrops and characters with Gemini.
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
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Visual Prompt</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A shocked creator looking at a glowing holographic screen in a dark studio, rim light, saturated colors..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-100 focus:border-purple-500 outline-none resize-none"
            />
          </div>

          {/* Quick Preset Ideas */}
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1.5">
              High-CTR Idea Prompts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(qp)}
                  className="text-[10px] text-zinc-300 bg-zinc-800/80 hover:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700/80 transition-colors text-left"
                >
                  {qp.slice(0, 45)}...
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-300">Aspect Ratio:</span>
            {(['16:9', '9:16', '1:1'] as const).map((ar) => (
              <button
                key={ar}
                onClick={() => setAspectRatio(ar)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  aspectRatio === ar
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {ar} {ar === '16:9' ? '(YouTube)' : ar === '9:16' ? '(Shorts)' : '(Square)'}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering high-resolution artwork with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Artwork</span>
              </>
            )}
          </button>

          {/* Preview of Generated Image */}
          {generatedImage && (
            <div className="pt-3 border-t border-zinc-800 space-y-3 animate-in fade-in">
              <span className="font-bold text-xs text-white block">Generated Image Preview</span>
              <div className="rounded-xl overflow-hidden border border-purple-500/50 shadow-xl bg-black aspect-video max-h-64">
                <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={handleInsertToCanvas}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Insert to Canvas as New Layer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
