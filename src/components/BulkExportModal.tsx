import React, { useState, useEffect } from 'react';
import {
  FolderArchive,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Tv,
  Smartphone,
  Instagram,
  Twitter,
  Youtube,
  HardDrive,
} from 'lucide-react';
import { CanvasLayer, PlatformExportPreset } from '../types/thumbnail';
import {
  PLATFORM_PRESETS,
  exportPresetToBlob,
  downloadBulkZipArchive,
  downloadSingleThumbnail,
} from '../utils/exportZip';

interface BulkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  layers: CanvasLayer[];
  backgroundColor: string;
}

export const BulkExportModal: React.FC<BulkExportModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  layers,
  backgroundColor,
}) => {
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState<number>(0.92);
  const [previewData, setPreviewData] = useState<Record<string, { dataUrl: string; sizeBytes: number }>>({});
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ progress: number; item: string }>({ progress: 0, item: '' });

  // Generate real previews and measure file sizes for each platform
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function generateAllPreviews() {
      const results: Record<string, { dataUrl: string; sizeBytes: number }> = {};
      for (const preset of PLATFORM_PRESETS) {
        try {
          const res = await exportPresetToBlob(preset, layers, backgroundColor, format, quality);
          if (isMounted) {
            results[preset.id] = { dataUrl: res.dataUrl, sizeBytes: res.sizeBytes };
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (isMounted) {
        setPreviewData(results);
      }
    }

    generateAllPreviews();
    return () => {
      isMounted = false;
    };
  }, [isOpen, layers, backgroundColor, format, quality]);

  if (!isOpen) return null;

  const handleBulkZipDownload = async () => {
    setIsExportingZip(true);
    try {
      await downloadBulkZipArchive(
        PLATFORM_PRESETS,
        layers,
        backgroundColor,
        projectTitle || 'thumbnail',
        format,
        quality,
        (progress, item) => setZipProgress({ progress, item })
      );
    } catch (err) {
      console.error('Bulk zip failed:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const getPlatformIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-pink-400" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-rose-400" />;
      case 'Twitter':
        return <Twitter className="w-4 h-4 text-sky-400" />;
      default:
        return <Tv className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Multi-Platform Bulk Export Suite</h2>
              <p className="text-xs text-zinc-400">
                Export optimized aspect ratios for YouTube, Shorts, TikTok, Instagram & X in one click.
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

        {/* Export Controls Bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Format Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-300">Format:</span>
              <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
                {(['image/png', 'image/jpeg', 'image/webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      format === fmt ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {fmt.replace('image/', '').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for JPEG / WebP) */}
            {format !== 'image/png' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400">Quality:</span>
                <input
                  type="range"
                  min={0.6}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-24 accent-red-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-zinc-300">{Math.round(quality * 100)}%</span>
              </div>
            )}
          </div>

          {/* Bulk Download Button */}
          <button
            onClick={handleBulkZipDownload}
            disabled={isExportingZip}
            className="py-2.5 px-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40"
          >
            {isExportingZip ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting ({zipProgress.progress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download All Formats (.ZIP)</span>
              </>
            )}
          </button>
        </div>

        {/* Platform Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
          {PLATFORM_PRESETS.map((preset) => {
            const data = previewData[preset.id];
            const sizeKB = data ? Math.round(data.sizeBytes / 1024) : 0;
            const sizeMB = (sizeKB / 1024).toFixed(2);
            const isYtOver2MB = preset.platform === 'YouTube' && sizeKB > 2000;

            return (
              <div
                key={preset.id}
                className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {getPlatformIcon(preset.iconName)}
                      <span className="font-extrabold text-sm text-white">{preset.platform}</span>
                      <span className="text-zinc-500 text-xs font-normal">• {preset.formatName}</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                      {preset.aspectRatioLabel} ({preset.width}x{preset.height})
                    </span>
                  </div>

                  {/* Thumbnail Preview Aspect Frame */}
                  <div className="relative rounded-lg overflow-hidden bg-black border border-zinc-800 flex items-center justify-center max-h-48">
                    {data ? (
                      <img
                        src={data.dataUrl}
                        alt={preset.formatName}
                        className="max-h-44 object-contain shadow"
                      />
                    ) : (
                      <div className="py-12 flex items-center gap-2 text-xs text-zinc-500">
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        <span>Rendering {preset.width}x{preset.height}...</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400">{preset.description}</p>
                </div>

                {/* Footer & Size Check */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {sizeKB > 1024 ? `${sizeMB} MB` : `${sizeKB} KB`}
                    </span>

                    {/* YouTube 2MB Limit Check Badge */}
                    {preset.platform === 'YouTube' && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          isYtOver2MB
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isYtOver2MB ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Over 2MB Limit!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>YouTube Safe (&lt;2MB)</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {data && (
                    <button
                      onClick={() =>
                        downloadSingleThumbnail(
                          data.dataUrl,
                          `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-${preset.width}x${preset.height}.${
                            format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png'
                          }`
                        )
                      }
                      className="py-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
