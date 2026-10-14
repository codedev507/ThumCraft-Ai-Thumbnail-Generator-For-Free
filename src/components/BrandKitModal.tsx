import React, { useState } from 'react';
import { Folder, Plus, Upload, Trash2, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { BrandKitFolder, BrandKitItem } from '../types/thumbnail';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertAsset: (asset: BrandKitItem) => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  isOpen,
  onClose,
  onInsertAsset,
}) => {
  const [folders, setFolders] = useState<BrandKitFolder[]>([
    {
      id: 'folder-reactions',
      name: 'My Reaction Faces',
      description: 'Cutout portraits with transparent backgrounds',
      items: [
        {
          id: 'item-1',
          name: 'Shocked / Jaw Dropped',
          type: 'cutout',
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        },
        {
          id: 'item-2',
          name: 'Hyped / Screaming',
          type: 'cutout',
          src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        },
        {
          id: 'item-3',
          name: 'Thinking / Skeptical',
          type: 'cutout',
          src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'folder-logos',
      name: 'Logos & Watermarks',
      description: 'Channel badges, verified ticks, and sponsor logos',
      items: [
        {
          id: 'item-4',
          name: 'Verified Creator Badge',
          type: 'logo',
          src: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
        },
      ],
    },
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>('folder-reactions');
  const activeFolder = folders.find((f) => f.id === activeFolderId) || folders[0];

  if (!isOpen) return null;

  const handleUploadAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const newItem: BrandKitItem = {
        id: `item_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'cutout',
        src,
      };

      setFolders((prev) =>
        prev.map((f) => (f.id === activeFolderId ? { ...f, items: [...f.items, newItem] } : f))
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Smart Brand Asset Catalog</h2>
              <p className="text-xs text-zinc-400">
                Organize your own reaction faces, cutouts, channel logos, and permanent assets.
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
        <div className="flex-1 flex overflow-hidden">
          {/* Folders List Left */}
          <div className="w-56 border-r border-zinc-800 bg-zinc-950/60 p-3 space-y-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 block">Brand Folders</span>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                  activeFolderId === folder.id
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{folder.items.length}</span>
              </button>
            ))}
          </div>

          {/* Folder Content Right */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-white">{activeFolder.name}</h3>
                <p className="text-xs text-zinc-400">{activeFolder.description}</p>
              </div>

              <label className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Folder</span>
                <input type="file" accept="image/*" onChange={handleUploadAsset} className="hidden" />
              </label>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-3 gap-3">
              {activeFolder.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onInsertAsset(item);
                    onClose();
                  }}
                  className="group relative rounded-xl border border-zinc-800 hover:border-indigo-500 bg-zinc-950/80 p-2 cursor-pointer transition-all hover:scale-[1.02] shadow"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-black flex items-center justify-center border border-zinc-800/80">
                    {item.src ? (
                      <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-zinc-600" />
                    )}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-zinc-300 truncate group-hover:text-indigo-400 transition-colors">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
