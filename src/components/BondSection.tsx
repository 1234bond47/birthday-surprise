import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';

interface BondSectionProps {
  friendName: string;
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

type DossierTab = 'profile' | 'gadgets' | 'clearance';

export function BondSection({
  friendName,
  photos,
  onOpenVault,
  onSelectLightbox,
}: BondSectionProps) {
  const [activeTab, setActiveTab] = useState<DossierTab>('profile');
  const sectionPhotos = pickPhotosByIds(
    photos,
    ['kushal-07', 'kushal-31', 'kushal-33'],
    8
  );

  return (
    <section
      id="bond-mission"
      className="relative py-20 lg:py-28 px-6 bg-[#070709] text-white overflow-hidden border-b border-[#D4AF37]/25"
    >
      {/* Subtle Luxury Gold Gunbarrel Radial */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 80% 25%, rgba(212, 175, 55, 0.12), transparent 55%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
        {/* Header + Luxury Grand Tourer Silhouette */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="font-mono text-xs tracking-[0.28em] text-[#D4AF37] uppercase">
              MI6 Classified Archive · Eyes Only
            </p>
            <h2
              className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-wide text-white"
              style={{ textWrap: 'balance' }}
            >
              AGENT 007: BIRTHDAY EDITION
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-mono text-[#D4AF37]">
              <span>Mission: Enjoy another legendary year.</span>
              <span aria-hidden="true">·</span>
              <span>Status: Too cool to be replaced.</span>
            </div>
          </div>

          {/* Custom SVG Luxury Sports Coupe Silhouette */}
          <div className="lg:col-span-5 flex flex-col items-end">
            <svg
              aria-hidden="true"
              viewBox="0 0 420 140"
              className="w-full max-w-md opacity-90"
            >
              <defs>
                <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path
                d="M28 96 L52 72 L132 62 L198 34 L298 36 L362 66 L396 78 L392 98 L345 98 M125 98 L285 98 M20 100 L402 100"
                fill="none"
                stroke="url(#goldLine)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="96" cy="98" r="21" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              <circle cx="96" cy="98" r="8" fill="none" stroke="#FDE68A" strokeWidth="1.5" />
              <circle cx="322" cy="98" r="21" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              <circle cx="322" cy="98" r="8" fill="none" stroke="#FDE68A" strokeWidth="1.5" />
            </svg>
            <span className="font-mono text-[11px] text-[#D4AF37]/75 tracking-widest uppercase">
              Q-Branch Vehicle · Aston Birthday Spec
            </span>
          </div>
        </div>

        {/* Classified Dossier + Intelligence Photo Files */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Classified Dossier */}
          <div className="lg:col-span-5 bg-[#0E0E12] border border-[#D4AF37]/35 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                <span className="font-mono text-xs tracking-widest uppercase font-bold">
                  Classified Dossier
                </span>
              </div>
              <span className="font-mono text-xs text-red-400 font-bold tracking-wider">
                TOP SECRET
              </span>
            </div>

            {/* Interactive Tabs */}
            <div className="flex gap-1 p-1 bg-black/60 border border-white/10 rounded-lg">
              {[
                { id: 'profile' as const, label: 'Field Profile' },
                { id: 'gadgets' as const, label: 'Equipment' },
                { id: 'clearance' as const, label: 'Audit Notes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-2.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'profile' && (
              <dl className="space-y-3 text-sm font-mono">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">CODENAME</dt>
                  <dd className="text-[#D4AF37] font-bold text-right">{friendName}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">DRINK ORDER</dt>
                  <dd className="text-white text-right">
                    Chai / Coffee, shaken by bad jokes
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">WEAKNESS</dt>
                  <dd className="text-white text-right">
                    &ldquo;One last game&rdquo; at 2:30 AM
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">LOYALTY RATING</dt>
                  <dd className="text-emerald-400 font-bold text-right">
                    UNBREAKABLE
                  </dd>
                </div>
              </dl>
            )}

            {activeTab === 'gadgets' && (
              <ul className="space-y-3 text-sm text-slate-300 font-mono">
                <li className="border-b border-white/10 pb-2">
                  01. Tactical Car Keys — ready for spontaneous 1 AM highway runs.
                </li>
                <li className="border-b border-white/10 pb-2">
                  02. Encrypted Calculator — survives endless CA balance sheet battles.
                </li>
                <li>
                  03. Emergency Meme Arsenal — deployed during serious meetings.
                </li>
              </ul>
            )}

            {activeTab === 'clearance' && (
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-mono">
                <p>
                  FIELD OBSERVATION: Subject consistently improves every room he
                  walks into and takes zero responsibility for group chaos.
                </p>
                <p className="text-[#D4AF37]">
                  DIRECTIVE: Celebrate immediately. No excuses permitted.
                </p>
              </div>
            )}
          </div>

          {/* 3 Surveillance Intelligence Photo Files */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sectionPhotos.map((photo, idx) => (
              <div
                key={photo ? photo.id : idx}
                className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-xl p-3 space-y-3 hover:border-[#D4AF37] transition-colors"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-[#D4AF37]">
                  <span>FILE #00{idx + 7}</span>
                  <span>VERIFIED</span>
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-black">
                  <FriendPhotoFrame
                    photo={photo}
                    onOpenVault={onOpenVault}
                    onSelectLightbox={onSelectLightbox}
                    slotLabel={`Intel File 00${idx + 7}`}
                    accentColor="#D4AF37"
                  />
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  {idx === 0 && 'Target spotted looking effortlessly sharp'}
                  {idx === 1 && 'Zero evidence of calm behavior'}
                  {idx === 2 && 'Authorized for legendary adventures'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
