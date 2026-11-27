import { useState } from 'react';
import { Gauge } from 'lucide-react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';
import { soundEngine } from '../utils/soundEngine';

interface AutomobileSectionProps {
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

export function AutomobileSection({
  photos,
  onOpenVault,
  onSelectLightbox,
}: AutomobileSectionProps) {
  const [speed, setSpeed] = useState(110);
  const [isRevving, setIsRevving] = useState(false);
  const sectionPhotos = pickPhotosByIds(
    photos,
    ['kushal-16', 'kushal-18', 'kushal-10', 'kushal-23'],
    11
  );

  const handleRev = () => {
    soundEngine.playEngineRev();
    setIsRevving(true);
    setSpeed(248);
    window.setTimeout(() => {
      setSpeed(128);
      setIsRevving(false);
    }, 1100);
  };

  // Map 0..260 km/h to -125deg..+125deg needle rotation
  const needleDeg = -125 + (speed / 260) * 250;

  return (
    <section
      id="long-drive"
      className="relative py-20 lg:py-28 px-6 bg-[#090C12] overflow-hidden border-b border-white/10"
    >
      {/* Animated Highway Asphalt Strip at Bottom */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-16 bg-[#06080C] border-t border-white/10 flex items-center overflow-hidden pointer-events-none"
      >
        <div className="flex gap-20 animate-road-scroll whitespace-nowrap">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-20 h-1.5 bg-amber-400/70 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="font-mono text-xs tracking-[0.25em] text-red-400 uppercase">
              Midnight Highway · Grand Touring Edition
            </p>
            <h2
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              LIFE IS A JOURNEY. HE&apos;S THE DRIVER.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-[54ch]">
              Windows down, favorite playlist queued, zero destination needed —
              just open roads, late-night highway dhabas, and stories that start
              with &ldquo;let&apos;s just take a quick drive.&rdquo;
            </p>
          </div>

          {/* Interactive SVG Speedometer */}
          <div className="lg:col-span-5 bg-[#0F141E] border border-white/15 rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="relative w-52 h-36 flex items-end justify-center">
              <svg viewBox="0 0 220 140" className="w-full h-full">
                {/* Outer Arc */}
                <path
                  d="M 24 120 A 86 86 0 1 1 196 120"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Redline Arc */}
                <path
                  d="M 168 55 A 86 86 0 0 1 196 120"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                />
                {/* Center Pivot */}
                <g
                  transform={`translate(110, 110) rotate(${needleDeg})`}
                  style={{ transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <line
                    x1="0"
                    y1="8"
                    x2="0"
                    y2="-72"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle cx="0" cy="0" r="8" fill="#F4F4F6" />
                </g>
              </svg>
            </div>

            <div className="text-center">
              <div className="font-mono tabular-nums text-3xl font-bold text-white">
                {speed} <span className="text-sm text-amber-400">KM/H</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                {isRevving ? 'REDLINE OVERDRIVE' : 'LONG DRIVE CRUISE'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleRev}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              <Gauge className="w-4 h-4" />
              <span>{isRevving ? 'Revving...' : 'Rev Engine'}</span>
            </button>
          </div>
        </div>

        {/* Road-Trip Panoramic Photo Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectionPhotos.map((photo, idx) => (
            <div
              key={photo ? photo.id : idx}
              className="rounded-xl bg-[#111724] border border-white/15 overflow-hidden hover:border-amber-400/60 transition-colors"
            >
              <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>MILEAGE · 0{idx + 1}</span>
                <span className="text-amber-400">OPEN ROAD</span>
              </div>
              <div className="aspect-[4/3] bg-black">
                <FriendPhotoFrame
                  photo={photo}
                  onOpenVault={onOpenVault}
                  onSelectLightbox={onSelectLightbox}
                  slotLabel={`Road Trip #0${idx + 1}`}
                  accentColor="#EF4444"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
