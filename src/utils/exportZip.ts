import JSZip from 'jszip';
import { CanvasLayer, PlatformExportPreset } from '../types/thumbnail';
import { renderThumbnailCanvas } from './canvasRender';

export const PLATFORM_PRESETS: PlatformExportPreset[] = [
  {
    id: 'yt-hd',
    platform: 'YouTube',
    formatName: 'Standard HD Thumbnail',
    width: 1280,
    height: 720,
    aspectRatioLabel: '16:9',
    description: 'Recommended standard YouTube video thumbnail size (max 2MB)',
    iconName: 'Youtube',
    maxSizeBytes: 2 * 1024 * 1024,
  },
  {
    id: 'yt-fhd',
    platform: 'YouTube',
    formatName: 'Ultra 1080p Crisp',
    width: 1920,
    height: 1080,
    aspectRatioLabel: '16:9',
    description: 'Crisp Full HD for 4K displays and YouTube TV app',
    iconName: 'Tv',
    maxSizeBytes: 2 * 1024 * 1024,
  },
  {
    id: 'vertical-shorts',
    platform: 'Shorts & TikTok',
    formatName: 'Vertical Cover',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16',
    description: 'YouTube Shorts, TikTok, and Instagram Reels cover preview',
    iconName: 'Smartphone',
  },
  {
    id: 'square-social',
    platform: 'Instagram / Feed',
    formatName: 'Square Carousel',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
    description: 'Instagram feed posts, LinkedIn video teasers, and Community tab',
    iconName: 'Instagram',
  },
  {
    id: 'twitter-card',
    platform: 'Twitter / X',
    formatName: 'Large Video Card',
    width: 1200,
    height: 675,
    aspectRatioLabel: '16:9',
    description: 'High engagement video thumbnail card on X timeline',
    iconName: 'Twitter',
  },
];

export async function exportPresetToBlob(
  preset: PlatformExportPreset,
  layers: CanvasLayer[],
  backgroundColor: string,
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality: number = 0.92
): Promise<{ blob: Blob; dataUrl: string; sizeBytes: number }> {
  const canvas = document.createElement('canvas');

  await renderThumbnailCanvas({
    canvas,
    layers,
    backgroundColor,
    width: preset.width,
    height: preset.height,
    showGuides: false,
    showTimestampShield: false,
    showHeatmap: false,
  });

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Canvas export failed');
        }
        const dataUrl = canvas.toDataURL(format, quality);
        resolve({
          blob,
          dataUrl,
          sizeBytes: blob.size,
        });
      },
      format,
      quality
    );
  });
}

export async function downloadBulkZipArchive(
  presets: PlatformExportPreset[],
  layers: CanvasLayer[],
  backgroundColor: string,
  projectTitle: string = 'thumbnail',
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality: number = 0.92,
  onProgress?: (progress: number, currentItem: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(`${projectTitle.toLowerCase().replace(/\s+/g, '-')}-exports`);

  const total = presets.length;
  let completed = 0;

  for (const preset of presets) {
    if (onProgress) {
      onProgress(Math.round((completed / total) * 100), preset.formatName);
    }

    const { blob } = await exportPresetToBlob(preset, layers, backgroundColor, format, quality);
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const filename = `${preset.platform.toLowerCase().replace(/\s+/g, '-')}_${preset.width}x${preset.height}.${ext}`;

    folder?.file(filename, blob);
    completed++;
  }

  if (onProgress) {
    onProgress(100, 'Zipping archive...');
  }

  const zipContent = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(zipContent);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-bundle.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export function downloadSingleThumbnail(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
