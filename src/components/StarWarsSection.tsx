import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';
import { soundEngine } from '../utils/soundEngine';

interface StarWarsSectionProps {
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

const SABER_COLORS = [
  { id: 'blue', label: 'Jedi Blue', hex: '#38BDF8', glow: 'rgba(56,189,248,0.8)' },
  { id: 'green', label: 'Consular Green', hex: '#22C55E', glow: 'rgba(34,197,94,0.8)' },
  { id: 'gold', label: 'Sentinel Gold', hex: '#F59E0B', glow: 'rgba(245,158,11,0.85)' },
];

const GALAXY_TRANSMISSIONS = [
  {
    code: 'SECTOR 01 · HYPERDRIVE',
    quote:
      'Use the Force, Kushal — especially when Monday mornings hit like an Imperial Star Destroyer.',
  },
  {
    code: 'SECTOR 02 · JEDI ARCHIVE',
    quote:
      'Even Yoda admits: patience you must have, unless there is a long drive or late-night gaming lobby waiting.',
  },
  {
    code: 'SECTOR 03 · REBEL FLEET',
    quote:
      'No Death Star could ever survive a full squad roast session with you on voice chat.',
  },
  {
    code: 'SECTOR 04 · OUTER RIM',
    quote:
      'A true Jedi does not look back at explosions. He just asks where the birthday dinner is.',
  },
];

export function StarWarsSection({
  photos,
  onOpenVault,
  onSelectLightbox,
}: StarWarsSectionProps) {
  const [saber, setSaber] = useState(SABER_COLORS[0]);
  const sectionPhotos = pickPhotosByIds(
    photos,
    ['kushal-02', 'kushal-22', 'kushal-30', 'kushal-20'],
    0
  );

  return (
    <section
      id="star-wars"
      className="relative py-20 lg:py-28 px-6 bg-[#040711] overflow-hidden border-b border-white/10"
    >
      {/* Nebula Glow & Planet SVG */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: saber.hex }}
      />

      {/* Custom SVG Ringed Planet & Starfighters */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 220"
        className="hidden md:block absolute top-12 right-8 w-72 opacity-40 pointer-events-none"
      >
        <defs>
          <radialGradient id="planetGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0F172A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>
        <circle cx="230" cy="110" r="56" fill="url(#planetGrad)" />
        <ellipse
          cx="230"
          cy="110"
          rx="118"
          ry="24"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeOpacity="0.55"
          transform="rotate(-14 230 110)"
        />
        <path
          d="M70 50 L94 58 L74 66 L78 58 Z"
          fill="#E2E8F0"
          opacity="0.85"
        />
        <path
          d="M110 175 L130 181 L113 187 L116 181 Z"
          fill="#38BDF8"
          opacity="0.75"
        />
      </svg>

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
        {/* Heading + Lightsaber Blade Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono text-xs tracking-[0.25em] text-[#38BDF8] uppercase">
              Episode Birthday · Galactic Archive
            </p>
            <h2
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              MAY THE BIRTHDAY BE WITH YOU
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              In a galaxy not so far away, one absolute legend continues his
              interstellar quest of chaos, loyalty, and unforgettable stories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-lg border border-white/10 self-start">
            {SABER_COLORS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.playSaberIgnite();
                  setSaber(item);
                }}
                className={`px-3 py-2 min-h-[38px] rounded-md text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  saber.id === item.id
                    ? 'bg-white text-black font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lightsaber Glowing Beam Divider */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-4 rounded-sm bg-gradient-to-r from-slate-600 via-slate-300 to-slate-500 border border-white/30 shrink-0" />
          <div
            className="h-2 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: `0 0 12px ${saber.hex}, 0 0 28px ${saber.glow}`,
            }}
          />
        </div>

        {/* Floating Holographic Photo Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALAXY_TRANSMISSIONS.map((item, idx) => {
            const photo = sectionPhotos[idx];
            return (
              <div
                key={item.code}
                className="animate-float-slow rounded-xl border bg-[#071124]/80 p-4 flex flex-col justify-between gap-4 transition-all duration-300"
                style={{
                  animationDelay: `${idx * 0.6}s`,
                  borderColor: `${saber.hex}55`,
                  boxShadow: `0 0 24px ${saber.hex}18`,
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-sky-300">
                    <span>{item.code}</span>
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>

                  <div className="aspect-[4/5] rounded-lg overflow-hidden border border-sky-400/30 bg-[#040814]">
                    <FriendPhotoFrame
                      photo={photo}
                      onOpenVault={onOpenVault}
                      onSelectLightbox={onSelectLightbox}
                      slotLabel={`Holo Frame 0${idx + 1}`}
                      accentColor={saber.hex}
                    />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-2 border-t border-white/10">
                  “{item.quote}”
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
