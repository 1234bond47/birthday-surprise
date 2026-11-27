import { useEffect, useState } from 'react';
import {
  ArrowUp,
  Camera,
  Menu,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

interface FloatingControlsProps {
  photoCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenVault: () => void;
}

const SECTIONS = [
  { id: 'intro', label: 'Intro' },
  { id: 'star-wars', label: 'Galaxy' },
  { id: 'lego-world', label: 'LEGO' },
  { id: 'bond-mission', label: '007' },
  { id: 'long-drive', label: 'Drive' },
  { id: 'railway-journey', label: 'Railway' },
  { id: 'gaming-zone', label: 'Gaming' },
  { id: 'ca-ledger', label: 'CA Audit' },
  { id: 'memories-gallery', label: '50 Photos' },
  { id: 'friendship', label: 'Letter' },
  { id: 'grand-finale', label: 'Finale' },
];

export function FloatingControls({
  photoCount,
  isMuted,
  onToggleMute,
  onOpenVault,
}: FloatingControlsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jumpTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Clean 3-Zone Floating Header */}
      <header className="sticky top-0 z-40 bg-[#05060A]/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#intro"
            className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            THE LEGEND WAS BORN
          </a>

          {/* Zone 2: Concise Single-Line Nav Links */}
          <nav
            aria-label="Universe navigation"
            className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300"
          >
            <a href="#star-wars" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">
              Galaxy
            </a>
            <a href="#bond-mission" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">
              Agent 007
            </a>
            <a href="#gaming-zone" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">
              Gaming
            </a>
            <a href="#memories-gallery" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">
              50 Memories
            </a>
            <a href="#grand-finale" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">
              Finale
            </a>
          </nav>

          {/* Zone 3: Primary Photo Vault Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenVault}
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Photos ({photoCount}/50)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Compact Floating Utility Dock (Bottom Right: Universe Menu + Music + Back to Top) */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {menuOpen && (
          <div className="w-56 max-h-[65vh] overflow-y-auto p-2 rounded-xl bg-[#0B0E14]/95 border border-white/15 shadow-2xl backdrop-blur-md">
            <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-white/10 mb-1">
              Jump to Universe
            </div>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => jumpTo(sec.id)}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-[#F59E0B] rounded-md transition-colors cursor-pointer"
              >
                {sec.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0B0E14]/90 border border-white/15 shadow-xl backdrop-blur-md">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-200 hover:bg-white/10 hover:text-[#F59E0B] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Music' : 'Mute Music'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#F59E0B]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close section menu' : 'Open section menu'}
            aria-expanded={menuOpen}
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-[#F59E0B] transition-colors cursor-pointer"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Universes</span>
          </button>

          {showBackTop && (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              title="Back to Top"
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-[#F59E0B] hover:text-black transition-colors cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
