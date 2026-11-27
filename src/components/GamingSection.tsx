import { useState } from 'react';
import { Hammer, Star } from 'lucide-react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';
import { soundEngine } from '../utils/soundEngine';

interface GamingSectionProps {
  friendName: string;
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

const CRAFT_ITEMS = [
  'Diamond Birthday Cake Crafted! (+100 Hunger)',
  'Enchanted Friend Pickaxe Crafted! (Unbreakable III)',
  'Netherite Chaos Shield Crafted! (Zero Fears)',
];

export function GamingSection({
  friendName,
  photos,
  onOpenVault,
  onSelectLightbox,
}: GamingSectionProps) {
  const [craftIndex, setCraftIndex] = useState(0);
  const [wantedStars, setWantedStars] = useState(5);
  const [missionPassed, setMissionPassed] = useState(false);

  const mcPhotos = pickPhotosByIds(photos, ['kushal-40', 'kushal-29'], 19);
  const gtaPhotos = pickPhotosByIds(photos, ['kushal-32', 'kushal-34'], 21);

  return (
    <section
      id="gaming-zone"
      className="relative py-20 lg:py-28 px-6 bg-[#070910] overflow-hidden border-b border-white/10"
    >
      <div className="max-w-[1200px] mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-xs tracking-[0.25em] text-emerald-400 uppercase">
            Multiplayer Arena · Minecraft &amp; Los Santos
          </p>
          <h2
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            REAL LIFE LEVEL: LEGENDARY
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Whether stacking diamond blocks at 2 AM or pulling off impossible
            heists in Los Santos, he plays every lobby at maximum chaos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MINECRAFT WORLD */}
          <div className="rounded-xl overflow-hidden border-4 border-[#3E2716] bg-[#1C1612] flex flex-col justify-between">
            {/* Pixel Grass Top Strip */}
            <div className="h-4 w-full bg-[#4E9A36] border-b-4 border-[#3A7527]" />

            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#4ADE80] tracking-wider uppercase">
                    Minecraft Survival · Overworld
                  </span>
                  {/* Pixel Diamond SVG */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="w-7 h-7"
                    shapeRendering="crispEdges"
                  >
                    <rect x="4" y="2" width="8" height="2" fill="#22D3EE" />
                    <rect x="2" y="4" width="12" height="6" fill="#06B6D4" />
                    <rect x="4" y="5" width="3" height="2" fill="#A5F3FC" />
                    <rect x="4" y="10" width="8" height="2" fill="#0891B2" />
                    <rect x="6" y="12" width="4" height="2" fill="#0E7490" />
                  </svg>
                </div>

                {/* Crafting Table Interactive Box */}
                <div className="p-4 bg-[#2A2018] border-2 border-[#5A4230] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-xs text-amber-200">
                      {CRAFT_ITEMS[craftIndex]}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playBrickSnap();
                        setCraftIndex((prev) => (prev + 1) % CRAFT_ITEMS.length);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-[#4E9A36] hover:bg-[#5BB33F] border-b-4 border-[#2F6120] text-white font-mono text-xs font-bold shrink-0 cursor-pointer"
                    >
                      <Hammer className="w-3.5 h-3.5" />
                      <span>Craft Item</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pixel Photo Frames */}
              <div className="grid grid-cols-2 gap-4">
                {mcPhotos.map((photo, idx) => (
                  <div
                    key={photo ? photo.id : idx}
                    className="border-4 border-[#5E4735] bg-[#120E0B] p-1.5"
                  >
                    <div className="aspect-square overflow-hidden bg-black">
                      <FriendPhotoFrame
                        photo={photo}
                        onOpenVault={onOpenVault}
                        onSelectLightbox={onSelectLightbox}
                        slotLabel={`Pixel Frame 0${idx + 1}`}
                        accentColor="#4ADE80"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GTA V LOS SANTOS NIGHT */}
          <div
            className="rounded-xl overflow-hidden border border-fuchsia-500/35 p-6 flex flex-col justify-between gap-6"
            style={{
              background:
                'linear-gradient(145deg, #090614 0%, #160B29 55%, #091526 100%)',
            }}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold text-fuchsia-400 tracking-wider uppercase">
                  Los Santos Night · Grand Theft Birthday
                </span>

                {/* Interactive Wanted Stars */}
                <div className="flex items-center gap-0.5" aria-label="Wanted level">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => {
                        soundEngine.playWarningBeep();
                        setWantedStars(starNum);
                      }}
                      aria-label={`Set ${starNum} wanted stars`}
                      className="p-1.5 min-w-[32px] min-h-[36px] flex items-center justify-center cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          starNum <= wantedStars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Mission Passed Banner */}
              <div className="p-4 rounded-lg bg-black/60 border border-cyan-400/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-lg font-extrabold text-amber-400 tracking-wide">
                      {missionPassed
                        ? 'MISSION PASSED! +RESPECT'
                        : `PLAYER: ${friendName}`}
                    </div>
                    <div className="font-mono text-xs text-cyan-300">
                      Wanted Level: {wantedStars}/5 Stars · Crew Leader
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playLevelUpChord();
                      setMissionPassed((prev) => !prev);
                    }}
                    className="px-3.5 py-2 min-h-[40px] rounded bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-mono text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {missionPassed ? 'Reset Mission' : 'Complete Heist'}
                  </button>
                </div>

                {/* Stat Bars */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-mono">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>DRIVING</span>
                      <span>100%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>CHAOS</span>
                      <span>99%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[99%] bg-fuchsia-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GTA Character Cards */}
            <div className="grid grid-cols-2 gap-4">
              {gtaPhotos.map((photo, idx) => (
                <div
                  key={photo ? photo.id : idx}
                  className="rounded-lg overflow-hidden border border-cyan-400/35 bg-black/70 p-1.5"
                >
                  <div className="aspect-square rounded overflow-hidden">
                    <FriendPhotoFrame
                      photo={photo}
                      onOpenVault={onOpenVault}
                      onSelectLightbox={onSelectLightbox}
                      slotLabel={`GTA Profile 0${idx + 1}`}
                      accentColor="#22D3EE"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
