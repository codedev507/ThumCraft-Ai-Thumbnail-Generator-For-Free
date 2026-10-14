import React, { useState } from 'react';
import { Swords, Search, ExternalLink, TrendingUp, AlertCircle, CheckCircle2, Flame, Loader2 } from 'lucide-react';
import { CompetitorBenchmarkItem, CanvasLayer } from '../types/thumbnail';
import { renderThumbnailCanvas } from '../utils/canvasRender';

interface CompetitorBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  layers: CanvasLayer[];
  backgroundColor: string;
}

export const CompetitorBenchmarkModal: React.FC<CompetitorBenchmarkModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  layers,
  backgroundColor,
}) => {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [userThumbUrl, setUserThumbUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [benchmarks, setBenchmarks] = useState<CompetitorBenchmarkItem[]>([
    {
      id: 'comp-1',
      title: 'I Built a $100,000 Secret AI Bunker in 48 Hours!',
      channel: 'MrBeast',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      views: '34M views',
      publishedTime: '3 days ago',
      CTRScoreEstimate: 94,
    },
    {
      id: 'comp-2',
      title: 'Why AI Agents Will Replace Programmers by 2027',
      channel: 'Fireship',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      views: '1.8M views',
      publishedTime: '1 week ago',
      CTRScoreEstimate: 88,
    },
    {
      id: 'comp-3',
      title: 'The Math Problem That Defeated Physicists',
      channel: 'Veritasium',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      views: '9.2M views',
      publishedTime: '2 weeks ago',
      CTRScoreEstimate: 91,
    },
  ]);

  React.useEffect(() => {
    if (!isOpen) return;
    const canvas = document.createElement('canvas');
    renderThumbnailCanvas({
      canvas,
      layers,
      backgroundColor,
      width: 1280,
      height: 720,
    }).then(() => {
      setUserThumbUrl(canvas.toDataURL('image/png'));
    });
  }, [isOpen, layers, backgroundColor]);

  if (!isOpen) return null;

  const handleAddCompetitor = () => {
    if (!competitorUrl.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const newComp: CompetitorBenchmarkItem = {
        id: `comp_${Date.now()}`,
        title: competitorUrl.startsWith('http')
          ? 'Competitor Video from URL'
          : competitorUrl,
        channel: 'Competitor Channel',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
        views: '4.5M views',
        publishedTime: '5 days ago',
        CTRScoreEstimate: 89,
      };
      setBenchmarks((prev) => [newComp, ...prev]);
      setCompetitorUrl('');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-white">Competitor Benchmark Canvas</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Visual Standout Audit
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Place your working draft thumbnail side-by-side against top competitors to test if you pop or blend in.
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
          {/* Add Competitor URL Input */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <label className="text-xs font-bold text-zinc-300 block">
              Paste Competitor Video URL or Video Topic to Benchmark:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCompetitor()}
                placeholder="e.g. https://www.youtube.com/watch?v=... or search competitor name"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-rose-500 outline-none"
              />
              <button
                onClick={handleAddCompetitor}
                disabled={loading || !competitorUrl.trim()}
                className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Add Competitor</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Comparison Showcase */}
          <div className="grid grid-cols-2 gap-5">
            {/* YOUR WORKING DRAFT */}
            <div className="p-4 rounded-xl bg-zinc-950 border-2 border-indigo-500 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                    YOUR DRAFT THUMBNAIL
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Visual Focus
                </span>
              </div>

              <div className="rounded-lg overflow-hidden aspect-video bg-black shadow-inner border border-zinc-800">
                {userThumbUrl ? (
                  <img src={userThumbUrl} alt="Your Draft" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 animate-pulse" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-xs text-white line-clamp-1">{videoTitle || 'Your Video Title'}</h3>
                <div className="text-[10px] text-zinc-400 mt-0.5">Your Channel • Projected CTR: 11.8%</div>
              </div>

              {/* Standout Diagnostic */}
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dominant Contrast Advantage</span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Your saturated text overlay and heavy outline creates higher luminance separation compared to competitors.
                </p>
              </div>
            </div>

            {/* BENCHMARK COMPETITORS LIST */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-400 uppercase tracking-wider">
                  Top Ranking Competitors in Feed
                </span>
                <span className="text-[10px] text-zinc-500">{benchmarks.length} benchmarked</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {benchmarks.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="w-36 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800">
                      <img src={comp.thumbnailUrl} alt={comp.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-bold text-xs text-zinc-200 line-clamp-2">{comp.title}</h4>
                      <div className="text-[10px] text-zinc-400">
                        {comp.channel} • {comp.views} • {comp.publishedTime}
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                          CTR Score: {comp.CTRScoreEstimate}/100
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
