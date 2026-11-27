import { useState } from 'react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';

interface RailwaySectionProps {
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

const STATIONS = [
  {
    code: 'STN 01',
    name: 'Friendship Junction',
    note: 'Where random conversations turned into lifelong loyalty.',
  },
  {
    code: 'STN 02',
    name: 'Madness Central',
    note: 'No brakes, questionable plans, and non-stop laughter.',
  },
  {
    code: 'STN 03',
    name: 'Legendary Memories',
    note: 'Every trip, late-night snack run, and unforgettable detour.',
  },
  {
    code: 'STN 04',
    name: 'Birthday Express',
    note: 'Next stop: bigger dreams, sharper wins, same madness.',
  },
];

export function RailwaySection({
  photos,
  onOpenVault,
  onSelectLightbox,
}: RailwaySectionProps) {
  const [activeStation, setActiveStation] = useState(0);
  const sectionPhotos = pickPhotosByIds(
    photos,
    ['kushal-48', 'kushal-14', 'kushal-24', 'kushal-05'],
    15
  );

  return (
    <section
      id="railway-journey"
      className="relative py-20 lg:py-28 px-6 bg-[#0E1017] overflow-hidden border-b border-white/10"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.1), transparent 55%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-xs tracking-[0.25em] text-amber-400 uppercase">
            Night Express · Line 01
          </p>
          <h2
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            THE JOURNEY OF A LEGEND
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Some friendships feel like an overnight train across continents —
            stations change outside the window, years rush past, and the
            company inside the cabin stays golden.
          </p>
        </div>

        {/* Animated Railway Track & Moving Train */}
        <div className="relative py-6 overflow-hidden rounded-xl bg-[#080A0F] border border-white/10 [container-type:inline-size]">
          {/* Moving Illuminated Express Train */}
          <div className="animate-train-glide flex items-end gap-1.5 px-4 mb-2 w-max">
            {/* Passenger Coach 2 */}
            <div className="w-28 h-10 rounded-t-md bg-slate-800 border border-amber-400/40 flex items-center justify-around px-2">
              {[0, 1, 2, 3].map((w) => (
                <div
                  key={w}
                  className="w-4 h-3.5 rounded-xs bg-amber-300/80 shadow-[0_0_8px_rgba(252,211,77,0.7)]"
                />
              ))}
            </div>
            {/* Passenger Coach 1 */}
            <div className="w-28 h-10 rounded-t-md bg-slate-800 border border-amber-400/40 flex items-center justify-around px-2">
              {[0, 1, 2, 3].map((w) => (
                <div
                  key={w}
                  className="w-4 h-3.5 rounded-xs bg-amber-300/80 shadow-[0_0_8px_rgba(252,211,77,0.7)]"
                />
              ))}
            </div>
            {/* Locomotive */}
            <div className="relative w-32 h-12 rounded-t-lg rounded-br-sm bg-gradient-to-r from-[#0F4C81] to-[#1E3A8A] border border-amber-400/60 flex items-center justify-between px-3">
              <div className="w-6 h-4 rounded-xs bg-amber-200/90" />
              <div className="font-mono text-[9px] font-bold text-amber-300">
                LEGEND EXP
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_16px_#FDE047]" />
            </div>
          </div>

          {/* Steel Rail & Sleepers */}
          <div className="h-1.5 w-full bg-gradient-to-r from-slate-600 via-slate-300 to-slate-600" />
          <div className="flex justify-between px-2 pt-1">
            {Array.from({ length: 36 }).map((_, idx) => (
              <div key={idx} className="w-2 h-2 bg-amber-900/60 rounded-xs" />
            ))}
          </div>
        </div>

        {/* 4 Station Memory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATIONS.map((station, idx) => {
            const isSelected = activeStation === idx;
            return (
              <div
                key={station.name}
                onMouseEnter={() => setActiveStation(idx)}
                onClick={() => setActiveStation(idx)}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-4 transition-all ${
                  isSelected
                    ? 'bg-[#151A26] border-amber-400/70'
                    : 'bg-[#10141E] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-amber-400 font-bold">{station.code}</span>
                    <span className="text-slate-400">PLATFORM 0{idx + 1}</span>
                  </div>

                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black border border-white/10">
                    <FriendPhotoFrame
                      photo={sectionPhotos[idx]}
                      onOpenVault={onOpenVault}
                      onSelectLightbox={onSelectLightbox}
                      slotLabel={station.name}
                      accentColor="#F59E0B"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-white">
                    {station.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {station.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
