import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface CinematicIntroProps {
  friendName: string;
  photoCount: number;
  onOpenVault: () => void;
  onEnterUniverse: () => void;
}

export function CinematicIntro({
  friendName,
  photoCount,
  onOpenVault,
  onEnterUniverse,
}: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  // Subtle starfield background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.phase += s.speed;
        const alpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Cinematic loading progress bar
  useEffect(() => {
    const interval = window.setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 40);
    return () => window.clearInterval(interval);
  }, []);

  const handleEnterClick = () => {
    soundEngine.unlock();
    soundEngine.playLevelUpChord();
    soundEngine.startMusic();
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      onEnterUniverse();
      return;
    }
    const t = window.setTimeout(() => {
      soundEngine.playWarningBeep();
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 550);
    return () => window.clearTimeout(t);
  }, [countdown, onEnterUniverse]);

  return (
    <section
      id="intro"
      className="relative min-h-[92vh] flex items-center justify-center px-6 py-20 bg-[#030408] overflow-hidden border-b border-white/10"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Deep Radial Halo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.12), rgba(56, 189, 248, 0.05) 45%, transparent 72%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-xs sm:text-sm tracking-[0.25em] text-[#38BDF8] uppercase">
            A special mission has been detected...
          </p>
          <p className="text-sm sm:text-base text-slate-300">
            Today, the world celebrates{' '}
            <span className="text-amber-400 font-semibold">ONE LEGEND</span> —{' '}
            {friendName}.
          </p>
        </div>

        <div className="space-y-4">
          <h1
            className="font-display font-extrabold tracking-tight text-white leading-[1.02]"
            style={{
              fontSize: 'clamp(2.75rem, 6.5vw, 5.25rem)',
              textWrap: 'balance',
            }}
          >
            THE LEGEND WAS BORN
          </h1>
          <p className="font-serif-luxury text-lg sm:text-2xl text-amber-300/90 tracking-wide">
            One Life. 50 Memories. Infinite Adventures.
          </p>
        </div>

        {/* Cinematic Loading Bar */}
        <div className="max-w-sm mx-auto space-y-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#38BDF8] via-[#F59E0B] to-[#FDE68A] transition-all duration-100"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>GALAXY ARCHIVE SYNC</span>
            <span className="tabular-nums">{loadProgress}%</span>
          </div>
        </div>

        {/* Countdown or Primary Enter Button */}
        <div className="pt-2 flex flex-col items-center gap-4">
          {countdown !== null ? (
            <div className="py-4 px-10 rounded-xl border border-amber-400/50 bg-amber-500/10">
              <div className="font-mono text-xs text-amber-300 tracking-widest uppercase mb-1">
                Warp Jump In
              </div>
              <div className="font-display text-5xl font-extrabold text-amber-400 tabular-nums">
                {countdown}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEnterClick}
              className="inline-flex items-center gap-2.5 px-8 py-4 min-h-[52px] rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-display font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-[0_0_32px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
            >
              <span>ENTER THE UNIVERSE</span>
              <ChevronDown className="w-5 h-5" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenVault}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-mono text-slate-300 hover:text-amber-300 border border-white/15 rounded-lg bg-white/[0.03] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>
              {photoCount === 0
                ? 'Upload His 50 Personal Photographs Here'
                : `${photoCount} Personal Photographs Loaded — Manage Vault`}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
