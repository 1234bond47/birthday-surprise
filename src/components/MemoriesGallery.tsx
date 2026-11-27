import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Star,
  Upload,
  X,
} from 'lucide-react';
import { CelebrationConfig, FriendPhoto } from '../utils/photoStore';

interface MemoriesGalleryProps {
  photos: FriendPhoto[];
  config: CelebrationConfig;
  onUpdateConfig: (next: CelebrationConfig) => void;
  onOpenVault: () => void;
  lightboxIndex: number | null;
  onSetLightboxIndex: (index: number | null) => void;
}

export function MemoriesGallery({
  photos,
  config,
  onUpdateConfig,
  onOpenVault,
  lightboxIndex,
  onSetLightboxIndex,
}: MemoriesGalleryProps) {
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = photos.length;

  useEffect(() => {
    if (lightboxIndex === null) {
      setIsSlideshow(false);
      return;
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSetLightboxIndex(null);
      if (e.key === 'ArrowRight' && total > 0) {
        onSetLightboxIndex((lightboxIndex + 1) % total);
      }
      if (e.key === 'ArrowLeft' && total > 0) {
        onSetLightboxIndex((lightboxIndex - 1 + total) % total);
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, total, onSetLightboxIndex]);

  useEffect(() => {
    if (!isSlideshow || lightboxIndex === null || total === 0) return;
    const timer = window.setInterval(() => {
      onSetLightboxIndex((lightboxIndex + 1) % total);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [isSlideshow, lightboxIndex, total, onSetLightboxIndex]);

  const formatIndex = (idx: number) =>
    `${String(idx + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;

  return (
    <section
      id="memories-gallery"
      className="relative py-20 lg:py-28 px-6 bg-[#05060A] border-b border-white/10"
    >
      <div className="max-w-[1280px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono text-xs tracking-[0.25em] text-[#F59E0B] uppercase">
              Complete Personal Archive · {photos.length}/50 Photos
            </p>
            <h2
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              50 PHOTOS. A MILLION MEMORIES.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Every single uploaded photograph lives here in its original aspect
              ratio — click any frame to launch the full-screen cinema viewer.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenVault}
            className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-display font-bold text-sm transition-colors self-start md:self-auto shrink-0 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>
              {photos.length === 0
                ? 'Upload His 50 Photos'
                : `Add / Manage Photos (${photos.length})`}
            </span>
          </button>
        </div>

        {/* Empty State vs Full 50-Photo Responsive Masonry */}
        {photos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-white/20 bg-[#0B0E16] p-12 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="font-display text-2xl font-bold text-white">
                Ready for His 50 Real Photographs
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Zero stock faces or fake AI portraits are used anywhere on this
                website. Click below to select up to 50+ personal photos of your
                best friend — every photo will instantly appear here and across
                all universes.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenVault}
              className="px-6 py-3.5 min-h-[48px] rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-display font-bold text-sm transition-colors cursor-pointer"
            >
              Upload His Photos Now
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo, idx) => {
              const isFinale =
                config.finalePhotoId === photo.id ||
                (!config.finalePhotoId && idx === 0);

              return (
                <div
                  key={photo.id}
                  className="break-inside-avoid group relative rounded-xl overflow-hidden border border-white/15 bg-[#0D1017] hover:border-[#F59E0B]/70 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => onSetLightboxIndex(idx)}
                    className="block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F59E0B]"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </button>

                  {/* Counter & Finale Star Overlay */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between gap-2">
                    <span className="font-mono tabular-nums text-xs font-bold text-white">
                      {String(idx + 1).padStart(2, '0')}/
                      {String(total).padStart(2, '0')}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateConfig({ ...config, finalePhotoId: photo.id });
                      }}
                      aria-label={`Set photo ${idx + 1} as Finale hero`}
                      title="Feature in Grand Finale"
                      className={`pointer-events-auto min-w-[34px] min-h-[34px] flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                        isFinale
                          ? 'bg-[#F59E0B] text-black'
                          : 'bg-black/65 text-white/80 hover:text-[#F59E0B]'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Cinema Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo viewer"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={() => onSetLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between gap-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono tabular-nums text-sm font-bold text-[#F59E0B]">
              {formatIndex(lightboxIndex)}{' '}
              <span className="text-slate-300 font-normal ml-2">
                {photos[lightboxIndex].name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateConfig({
                    ...config,
                    finalePhotoId: photos[lightboxIndex].id,
                  })
                }
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  config.finalePhotoId === photos[lightboxIndex].id
                    ? 'bg-[#F59E0B] text-black font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">
                  {config.finalePhotoId === photos[lightboxIndex].id
                    ? 'Finale Hero'
                    : 'Set Finale'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsSlideshow((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
              >
                {isSlideshow ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Slideshow</span>
                  </>
                )}
              </button>

              <button
                type="button"
                aria-label="Close lightbox"
                onClick={() => onSetLightboxIndex(null)}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image (100% Uncropped Original Aspect Ratio) */}
          <div
            className="flex-1 flex items-center justify-center relative my-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null || total === 0) return;
              const delta = e.changedTouches[0].clientX - touchStartX;
              if (delta > 45) {
                onSetLightboxIndex((lightboxIndex - 1 + total) % total);
              } else if (delta < -45) {
                onSetLightboxIndex((lightboxIndex + 1) % total);
              }
              setTouchStartX(null);
            }}
          >
            <button
              type="button"
              aria-label="Previous photograph"
              onClick={() =>
                onSetLightboxIndex((lightboxIndex - 1 + total) % total)
              }
              className="absolute left-1 sm:left-4 w-12 h-12 rounded-full bg-black/70 hover:bg-[#F59E0B] hover:text-black text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].name}
              referrerPolicy="no-referrer"
              className="max-h-[76vh] max-w-[88vw] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />

            <button
              type="button"
              aria-label="Next photograph"
              onClick={() => onSetLightboxIndex((lightboxIndex + 1) % total)}
              className="absolute right-1 sm:right-4 w-12 h-12 rounded-full bg-black/70 hover:bg-[#F59E0B] hover:text-black text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail Strip Footer */}
          <div
            className="text-center font-mono text-xs text-slate-400"
            onClick={(e) => e.stopPropagation()}
          >
            Use Arrow Keys or Swipe Buttons to Navigate · ESC to Close
          </div>
        </div>
      )}
    </section>
  );
}
