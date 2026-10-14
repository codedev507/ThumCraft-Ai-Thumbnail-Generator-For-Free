import React, { useState, useEffect, useRef } from 'react';
import {
  Tv,
  Smartphone,
  Sun,
  Moon,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { CanvasLayer } from '../types/thumbnail';
import { renderThumbnailCanvas } from '../utils/canvasRender';

interface FeedSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  layers: CanvasLayer[];
  backgroundColor: string;
}

export const FeedSimulatorModal: React.FC<FeedSimulatorModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  layers,
  backgroundColor,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const canvas = document.createElement('canvas');
    renderThumbnailCanvas({
      canvas,
      layers,
      backgroundColor,
      width: 1280,
      height: 720,
      showGuides: false,
      showTimestampShield: false,
      showHeatmap: false,
    }).then(() => {
      setThumbnailUrl(canvas.toDataURL('image/png'));
    });
  }, [isOpen, layers, backgroundColor]);

  if (!isOpen) return null;

  // Realistic mock competitors
  const competitors = [
    {
      id: 'c1',
      title: 'I Built a $100,000 Secret Underground Bunker in 7 Days!',
      channel: 'MrBeast',
      views: '42M views',
      time: '2 days ago',
      duration: '18:24',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'c2',
      title: 'The Terrifying Math Problem That Broke Physics Forever',
      channel: 'Veritasium',
      views: '8.4M views',
      time: '1 week ago',
      duration: '22:15',
      thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'c3',
      title: 'M4 Mac Studio Review: Apple Just Killed Desktop PCs.',
      channel: 'Marques Brownlee',
      views: '3.1M views',
      time: '3 days ago',
      duration: '14:50',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">YouTube Home Feed Simulator</h2>
              <p className="text-xs text-zinc-400">
                Audit visual standout factor against top creators in real desktop & mobile environments.
              </p>
            </div>
          </div>

          {/* Device & Theme Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  device === 'desktop' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  device === 'mobile' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
            </div>

            <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md transition-colors ${
                  isDark ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
                title="YouTube Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition-colors ${
                  !isDark ? 'bg-zinc-200 text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="YouTube Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors font-bold ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Simulator Viewport Frame */}
        <div
          className={`flex-1 overflow-y-auto p-6 transition-colors ${
            isDark ? 'bg-[#0f0f0f] text-white' : 'bg-white text-zinc-900'
          }`}
        >
          {/* Mock YouTube Top Bar */}
          <div
            className={`flex items-center justify-between pb-4 mb-6 border-b ${
              isDark ? 'border-zinc-800' : 'border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-base">
              <span className="w-5 h-3.5 rounded bg-red-600 flex items-center justify-center text-white text-[8px] font-black">
                ▶
              </span>
              <span>YouTube</span>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border max-w-sm w-full mx-4 ${
                isDark ? 'bg-[#121212] border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-500'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs">Search</span>
            </div>

            <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
              Y
            </div>
          </div>

          {/* Desktop Layout Grid or Mobile Column */}
          {device === 'desktop' ? (
            <div className="grid grid-cols-3 gap-5">
              {/* YOUR THUMBNAIL (FOCAL CARD) */}
              <div className="group space-y-2.5 relative">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black shadow-lg ring-2 ring-red-500/50">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Your Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 animate-pulse" />
                  )}

                  {/* YouTube Timestamp Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                    14:28
                  </div>

                  {/* Creator Studio Focus Tag */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg">
                    YOUR VIDEO
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-white text-xs shrink-0">
                    YOU
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-snug line-clamp-2">
                      {videoTitle || 'Untitled Video Title'}
                    </h3>
                    <div className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Your Channel • 1.2M views • Just now
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitor Cards */}
              {competitors.map((comp) => (
                <div key={comp.id} className="space-y-2.5">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black shadow">
                    <img src={comp.thumbnail} alt={comp.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                      {comp.duration}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <img src={comp.avatar} alt={comp.channel} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm leading-snug line-clamp-2">{comp.title}</h3>
                      <div className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {comp.channel} • {comp.views} • {comp.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Mobile App Simulator (Centered smartphone width) */
            <div className="max-w-md mx-auto space-y-6">
              {/* YOUR THUMBNAIL ON MOBILE */}
              <div className="space-y-2 border-b pb-5 border-zinc-800">
                <div className="relative rounded-none sm:rounded-xl overflow-hidden aspect-video bg-black shadow ring-2 ring-red-500">
                  {thumbnailUrl && (
                    <img src={thumbnailUrl} alt="Your Thumbnail" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                    14:28
                  </div>
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    YOUR VIDEO (MOBILE FEED)
                  </div>
                </div>

                <div className="flex gap-3 px-1 pt-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-white text-xs shrink-0">
                    YOU
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-snug">{videoTitle || 'Untitled Video Title'}</h3>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Your Channel • 1.2M views • 1 hour ago
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitor on mobile */}
              <div className="space-y-2">
                <div className="relative rounded-none sm:rounded-xl overflow-hidden aspect-video bg-black shadow">
                  <img src={competitors[0].thumbnail} alt={competitors[0].title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                    {competitors[0].duration}
                  </div>
                </div>

                <div className="flex gap-3 px-1 pt-1">
                  <img src={competitors[0].avatar} alt={competitors[0].channel} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm leading-snug">{competitors[0].title}</h3>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {competitors[0].channel} • {competitors[0].views} • {competitors[0].time}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
