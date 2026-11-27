import { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Link2,
  Share2,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  CelebrationConfig,
  encodeShareHash,
  FriendPhoto,
} from '../utils/photoStore';

interface PhotoVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: FriendPhoto[];
  urlPhotos: FriendPhoto[];
  config: CelebrationConfig;
  onUpdateConfig: (next: CelebrationConfig) => void;
  onUploadFiles: (files: FileList | File[]) => Promise<void>;
  onAddPhotoUrls: (rawText: string) => number;
  onDeletePhoto: (id: string) => Promise<void>;
  onClearAll: () => Promise<void>;
  uploadProgress: { current: number; total: number } | null;
}

function getCurrentBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  const cleanPath = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  return `${window.location.origin}${cleanPath}`;
}

export function PhotoVaultModal({
  isOpen,
  onClose,
  photos,
  urlPhotos,
  config,
  onUpdateConfig,
  onUploadFiles,
  onAddPhotoUrls,
  onDeletePhoto,
  onClearAll,
  uploadProgress,
}: PhotoVaultModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'device'>('links');
  const [urlInput, setUrlInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasCustomPhotos = photos.some((p) => !p.isBundled);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await onUploadFiles(e.dataTransfer.files);
    }
  };

  const handleImportUrls = () => {
    const added = onAddPhotoUrls(urlInput);
    if (added > 0) {
      setImportStatus(`Added ${added} photo link${added === 1 ? '' : 's'}!`);
      setUrlInput('');
    } else {
      setImportStatus('Please paste valid http/https or Google Drive links (one per line).');
    }
  };

  const baseUrl = getCurrentBaseUrl();
  const shareableUrl =
    urlPhotos.length > 0
      ? `${baseUrl}/${encodeShareHash(config, urlPhotos)}`
      : baseUrl || '/';

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vault-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0B0E14] border border-white/15 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div>
            <h2
              id="vault-modal-title"
              className="font-display text-xl font-bold text-white"
            >
              Legend Photo Vault ({photos.length}/50 Loaded)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add Kushal&apos;s real photographs via shareable links or device
              upload.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close photo vault"
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Friend Personalization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/10">
            <div>
              <label
                htmlFor="friend-name-input"
                className="block text-xs font-mono text-slate-400 mb-1.5"
              >
                Best Friend&apos;s Name / Title
              </label>
              <input
                id="friend-name-input"
                type="text"
                value={config.friendName}
                onChange={(e) =>
                  onUpdateConfig({ ...config, friendName: e.target.value })
                }
                placeholder="e.g. KUSHAL"
                className="w-full px-3.5 py-2.5 text-sm bg-black/50 border border-white/15 rounded-md text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
            <div>
              <label
                htmlFor="milestone-input"
                className="block text-xs font-mono text-slate-400 mb-1.5"
              >
                Unlocked Age / Level Headline
              </label>
              <input
                id="milestone-input"
                type="text"
                value={config.milestoneTitle}
                onChange={(e) =>
                  onUpdateConfig({ ...config, milestoneTitle: e.target.value })
                }
                placeholder="e.g. LEVEL 19 UNLOCKED"
                className="w-full px-3.5 py-2.5 text-sm bg-black/50 border border-white/15 rounded-md text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'links'
                  ? 'bg-[#F59E0B] text-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Paste Photo Links &amp; Share URL (Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('device')}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'device'
                  ? 'bg-[#F59E0B] text-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload from Device</span>
            </button>
          </div>

          {/* Tab 1: Paste Links & Generate Shareable URL */}
          {activeTab === 'links' ? (
            <div className="space-y-4 p-5 rounded-xl bg-white/[0.02] border border-white/15">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white">
                  Paste up to 50 Image or Google Drive Links (one per line)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Paste public Google Drive photo links (set to &ldquo;Anyone
                  with the link&rdquo;) or direct image URLs. They encode
                  directly into a shareable birthday link so Kushal sees every
                  photo when he opens it!
                </p>
              </div>

              <textarea
                rows={4}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={
                  'https://drive.google.com/file/d/...\nhttps://drive.google.com/file/d/...\n(Paste as many lines as you want)'
                }
                className="w-full p-3 rounded-lg bg-black/60 border border-white/15 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F59E0B]"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleImportUrls}
                  className="px-4 py-2.5 min-h-[40px] rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-bold transition-colors cursor-pointer"
                >
                  Load Photo Links
                </button>

                {importStatus && (
                  <span className="text-xs font-mono text-emerald-400">
                    {importStatus}
                  </span>
                )}
              </div>

              {/* Generated Shareable Link Box */}
              {urlPhotos.length > 0 && (
                <div className="mt-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/35 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <Share2 className="w-4 h-4" />
                    <span>
                      Shareable Link Ready ({urlPhotos.length} linked photos
                      embedded!)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareableUrl}
                      className="flex-1 px-3 py-2 rounded bg-black/60 border border-white/15 font-mono text-[11px] text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleCopyShareLink}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shrink-0 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Device Drag & Drop */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                  : 'border-white/20 bg-white/[0.02] hover:border-white/35'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    await onUploadFiles(e.target.files);
                    e.target.value = '';
                  }
                }}
              />

              <Upload
                className="w-8 h-8 mx-auto mb-3 text-[#F59E0B]"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-white mb-1">
                Drop all 50 photographs here, or select files from your device
              </p>
              <p className="text-xs text-slate-400 mb-4 max-w-lg mx-auto">
                Device uploads save locally in this browser. To share with
                Kushal on another phone, use the{' '}
                <strong className="text-slate-200">Paste Photo Links</strong>{' '}
                tab or place image files in{' '}
                <code className="text-amber-300">src/assets/friend-photos/</code>{' '}
                before building.
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadProgress !== null}
                className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                {uploadProgress
                  ? `Optimizing ${uploadProgress.current} of ${uploadProgress.total}...`
                  : 'Select Photos (Multiple)'}
              </button>
            </div>
          )}

          {/* Loaded Grid */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {photos.length} memories loaded · Click the star to pick
                    Kushal&apos;s Grand Finale photo
                  </span>
                </div>

                {hasCustomPhotos && (
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All Added
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {photos.map((photo, index) => {
                  const isFinale =
                    config.finalePhotoId === photo.id ||
                    (!config.finalePhotoId && index === 0);

                  return (
                    <div
                      key={photo.id}
                      className={`relative group aspect-square rounded-lg overflow-hidden border bg-black ${
                        isFinale
                          ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]'
                          : 'border-white/15'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />

                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 font-mono text-[10px] text-white">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          title="Set as Grand Finale Hero Photo"
                          aria-label={`Set photo ${index + 1} as Finale photo`}
                          onClick={() =>
                            onUpdateConfig({ ...config, finalePhotoId: photo.id })
                          }
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                            isFinale
                              ? 'bg-[#F59E0B] text-black'
                              : 'bg-black/70 text-white/70 hover:text-[#F59E0B]'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>

                        {!photo.isBundled && (
                          <button
                            type="button"
                            title="Remove photo"
                            aria-label={`Delete photo ${index + 1}`}
                            onClick={() => onDeletePhoto(photo.id)}
                            className="w-6 h-6 rounded bg-black/70 text-white/70 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <span className="text-xs text-slate-400">
            Bundled folder:{' '}
            <code className="text-slate-300">src/assets/friend-photos/</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[40px] rounded-lg bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Done &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}
