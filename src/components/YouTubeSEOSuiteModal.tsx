import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  TrendingUp,
  Clock,
  Tag,
  FileText,
  Loader2,
  Wand2,
  HelpCircle,
  Smartphone,
} from 'lucide-react';

interface YouTubeSEOSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  onUpdateTitle: (title: string) => void;
  thumbnailOverlayText: string;
  genre: string;
}

export const YouTubeSEOSuiteModal: React.FC<YouTubeSEOSuiteModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  onUpdateTitle,
  thumbnailOverlayText,
  genre,
}) => {
  const [title, setTitle] = useState(videoTitle);
  const [thumbText, setThumbText] = useState(thumbnailOverlayText);
  const [keywords, setKeywords] = useState('AI coding, autonomous agent, tech challenge, robotics');
  const [loading, setLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<any>(null);

  // Copy feedback states
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunSEOAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/seo-suite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: title,
          thumbnailText: thumbText,
          genre,
          keywords,
        }),
      });
      const data = await res.json();
      setSeoResult(data);
    } catch (err) {
      console.error('SEO audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTags = () => {
    if (!seoResult?.searchTags) return;
    navigator.clipboard.writeText(seoResult.searchTags.join(', '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopyDescription = () => {
    if (!seoResult?.fullDescription) return;
    navigator.clipboard.writeText(seoResult.fullDescription);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleApplyTitle = (newTitle: string, index: number) => {
    setTitle(newTitle);
    onUpdateTitle(newTitle);
    setCopiedTitleIndex(index);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  const charCount = title.length;
  const isOptimalLength = charCount >= 45 && charCount <= 65;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-white">100% YouTube SEO & Algorithm Suite</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Algorithmic Rank Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Audits title-thumbnail curiosity synergy, mobile character length truncation, search tags & chapters.
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Input Form */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Title input with character count monitor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-zinc-200">Video Title</label>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isOptimalLength ? 'text-emerald-400' : charCount > 65 ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  >
                    {charCount}/60 chars {isOptimalLength ? '(Optimal)' : charCount > 65 ? '(Truncates on Mobile)' : '(Short)'}
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. I Spent 100 Hours Building an Autonomous AI Robot"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Thumbnail Text overlay (for synergy calculation) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-zinc-200">Thumbnail Text Overlay</label>
                  <span className="text-[10px] text-zinc-500">For Title-Thumb Synergy</span>
                </div>
                <input
                  type="text"
                  value={thumbText}
                  onChange={(e) => setThumbText(e.target.value)}
                  placeholder="e.g. I SURVIVED 100 HOURS!"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleRunSEOAudit}
                disabled={loading || !title.trim()}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing YouTube Algorithm & Search Rankings...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Run Full 100% SEO Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Output */}
          {seoResult && (
            <div className="space-y-6 animate-in fade-in">
              {/* Score Badges */}
              <div className="grid grid-cols-3 gap-4">
                {/* SEO Health Score */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-black text-emerald-400 font-mono">{seoResult.seoScore}</span>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">SEO Score</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-white block">YouTube SEO Index</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">High searchability and algorithmic discovery potential.</p>
                  </div>
                </div>

                {/* Title-Thumbnail Synergy Score */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/40 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-black text-indigo-400 font-mono">{seoResult.synergyScore}</span>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">Synergy</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-white block">Title-Thumb Synergy</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{seoResult.synergyVerdict}</p>
                  </div>
                </div>

                {/* Mobile Truncation Check */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center shrink-0 ${
                    seoResult.isMobileTruncated
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  }`}>
                    <Smartphone className="w-6 h-6" />
                    <span className="text-[8px] uppercase font-bold mt-0.5">Mobile</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-white block">Mobile Display</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {seoResult.isMobileTruncated ? 'Title exceeds 60 chars (will cut off with ...)' : 'Safe! 100% visible on mobile app.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 High-Ranking Alternative Titles */}
              <div className="space-y-3">
                <span className="font-bold text-xs text-zinc-200 uppercase tracking-wider block">
                  High-Ranking Alternative Titles (Algorithmic & Search Optimized)
                </span>
                <div className="space-y-2">
                  {seoResult.alternativeTitles?.map((alt: any, idx: number) => {
                    const isCopied = copiedTitleIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                              {alt.type}
                            </span>
                            <span className="text-xs font-black text-emerald-400 font-mono">
                              Est. CTR: {alt.predictedCTR}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">{alt.charCount} chars</span>
                          </div>
                          <div className="font-bold text-xs text-white">{alt.title}</div>
                        </div>

                        <button
                          onClick={() => handleApplyTitle(alt.title, idx)}
                          className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-emerald-600 text-zinc-200 hover:text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{isCopied ? 'Applied!' : 'Use This Title'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* High-Volume Search Tags */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">
                      Recommended YouTube Search Tags ({seoResult.searchTags?.length})
                    </span>
                  </div>

                  <button
                    onClick={handleCopyTags}
                    className="py-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-zinc-700 transition-colors"
                  >
                    {copiedTags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTags ? 'Tags Copied!' : 'Copy All Tags'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {seoResult.searchTags?.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Description & Video Chapters Template */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" />
                    <span className="font-bold text-xs text-white">Algorithmic Video Description & Chapters</span>
                  </div>

                  <button
                    onClick={handleCopyDescription}
                    className="py-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-zinc-700 transition-colors"
                  >
                    {copiedDesc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDesc ? 'Description Copied!' : 'Copy Full Description'}</span>
                  </button>
                </div>

                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {seoResult.fullDescription}
                </div>
              </div>

              {/* Algorithmic Checklist */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  YouTube Algorithm Success Checklist:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                  {seoResult.rankingChecklist?.map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-900/60 rounded-lg border border-zinc-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
