import { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';
import { soundEngine } from '../utils/soundEngine';

interface LegoSectionProps {
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

const BRICK_THEMES = [
  { name: 'Red Brick', bg: '#D92323', border: '#EF4444', text: '#FFFFFF' },
  { name: 'Yellow Brick', bg: '#FACC15', border: '#FDE047', text: '#111827' },
  { name: 'Blue Brick', bg: '#1D4ED8', border: '#3B82F6', text: '#FFFFFF' },
  { name: 'Green Brick', bg: '#15803D', border: '#22C55E', text: '#FFFFFF' },
];

export function LegoSection({
  photos,
  onOpenVault,
  onSelectLightbox,
}: LegoSectionProps) {
  const [extraLayers, setExtraLayers] = useState(0);
  const sectionPhotos = pickPhotosByIds(
    photos,
    ['kushal-13', 'kushal-09', 'kushal-47', 'kushal-49'],
    4
  );

  const handleStackBrick = () => {
    soundEngine.playBrickSnap();
    setExtraLayers((prev) => (prev >= 3 ? 3 : prev + 1));
  };

  return (
    <section
      id="lego-world"
      className="relative py-20 lg:py-28 px-6 bg-[#131722] overflow-hidden border-b border-white/10"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.06) 2px, transparent 2px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Header + LEGO Cake Interactive Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FACC15]">
              <span>Brick Workshop · Edition 01</span>
            </div>
            <h2
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              BUILT DIFFERENT. BUILT LEGENDARY.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-[54ch]">
              Piece by piece, joke by joke, late night by late night — nobody
              else is engineered quite like this guy. Every memory clicks right
              into place.
            </p>
          </div>

          {/* Animated LEGO Birthday Cake */}
          <div className="lg:col-span-5 bg-[#0C0F17] border-2 border-white/15 rounded-2xl p-6 flex flex-col items-center gap-5 shadow-xl">
            <div className="text-xs font-mono text-[#FACC15] uppercase tracking-wider">
              LEGO Brick Birthday Cake
            </div>

            <div className="flex flex-col items-center pt-4 pb-2 min-h-[180px] justify-end">
              {/* Candles */}
              <div className="flex items-end gap-4 mb-1">
                {[0, 1, 2].map((c) => (
                  <div key={c} className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-4 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-white animate-candle-flicker"
                      style={{ animationDelay: `${c * 0.2}s` }}
                    />
                    <div className="w-2.5 h-6 bg-[#38BDF8] border border-white/30 rounded-xs" />
                  </div>
                ))}
              </div>

              {/* Extra stacked bricks */}
              {Array.from({ length: extraLayers }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center transition-all duration-200"
                >
                  <div className="flex gap-3">
                    <div className="w-4 h-1.5 bg-[#22C55E] rounded-t-xs" />
                    <div className="w-4 h-1.5 bg-[#22C55E] rounded-t-xs" />
                  </div>
                  <div className="w-28 h-6 bg-[#16A34A] border-b-4 border-[#14532D] rounded-xs" />
                </div>
              ))}

              {/* Top Tier (Yellow) */}
              <div className="flex gap-4">
                <div className="w-5 h-2 bg-[#FDE047] rounded-t-xs" />
                <div className="w-5 h-2 bg-[#FDE047] rounded-t-xs" />
                <div className="w-5 h-2 bg-[#FDE047] rounded-t-xs" />
              </div>
              <div className="w-36 h-8 bg-[#FACC15] border-b-4 border-[#CA8A04] rounded-xs flex items-center justify-center">
                <span className="font-mono text-[10px] font-bold text-black">
                  100% LEGEND
                </span>
              </div>

              {/* Middle Tier (Blue) */}
              <div className="w-48 h-9 bg-[#2563EB] border-b-4 border-[#1E3A8A] rounded-xs mt-0.5 flex items-center justify-center">
                <span className="font-mono text-[10px] font-bold text-white">
                  EXTRA CHAOS
                </span>
              </div>

              {/* Base Tier (Red) */}
              <div className="w-60 h-10 bg-[#DC2626] border-b-4 border-[#991B1B] rounded-xs mt-0.5 flex items-center justify-center">
                <span className="font-mono text-[11px] font-bold text-white">
                  HAPPY BIRTHDAY
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleStackBrick}
                disabled={extraLayers >= 3}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {extraLayers >= 3 ? 'Max Tower Built!' : 'Stack Extra Brick'}
                </span>
              </button>

              {extraLayers > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playBrickSnap();
                    setExtraLayers(0);
                  }}
                  aria-label="Reset cake bricks"
                  className="p-2 min-h-[40px] rounded-lg border border-white/15 text-slate-300 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LEGO Studded Photo Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {BRICK_THEMES.map((brick, idx) => (
            <div key={brick.name} className="group flex flex-col">
              {/* Top LEGO Studs */}
              <div className="flex justify-around px-6">
                {[0, 1, 2, 3].map((stud) => (
                  <div
                    key={stud}
                    className="w-6 h-2.5 rounded-t-sm border-t border-x"
                    style={{
                      backgroundColor: brick.bg,
                      borderColor: brick.border,
                    }}
                  />
                ))}
              </div>

              {/* Brick Frame Body */}
              <div
                className="rounded-xl p-3 border-b-8 transition-transform duration-200 group-hover:-translate-y-1.5"
                style={{
                  backgroundColor: brick.bg,
                  borderColor: 'rgba(0,0,0,0.35)',
                }}
              >
                <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#0D1017] border-2 border-black/25">
                  <FriendPhotoFrame
                    photo={sectionPhotos[idx]}
                    onOpenVault={onOpenVault}
                    onSelectLightbox={onSelectLightbox}
                    slotLabel={`Brick Set #0${idx + 1}`}
                    accentColor={brick.bg}
                  />
                </div>
                <div
                  className="pt-2.5 px-1 flex items-center justify-between font-mono text-xs font-bold"
                  style={{ color: brick.text }}
                >
                  <span>SET #0{idx + 5}</span>
                  <span>LIMITED EDITION</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
