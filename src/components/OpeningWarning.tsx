import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Volume2, VolumeX, Upload } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface OpeningWarningProps {
  friendName: string;
  milestoneTitle: string;
  photoCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenVault: () => void;
  onComplete: () => void;
}

const WARNING_LINES = [
  'WARNING: A LEGENDARY HUMAN HAS LEVELLED UP TODAY.',
  'An extraordinary lifeform has unlocked another year.',
  'Intelligence: Classified.',
  'Gaming Skills: Dangerous.',
  'Driving Passion: Unlimited.',
  'CA Survival Rate: Under Investigation.',
  'Madness Level: MAXIMUM.',
  'Friendship Status: PRICELESS.',
];

export function OpeningWarning({
  friendName,
  milestoneTitle,
  photoCount,
  isMuted,
  onToggleMute,
  onOpenVault,
  onComplete,
}: OpeningWarningProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showUnlockBanner, setShowUnlockBanner] = useState(false);
  const [phase, setPhase] = useState<'warning' | 'explosion' | 'legend-statement'>('warning');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transitionTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
      transitionTimersRef.current = [];
    };
  }, []);

  // Reveal lines one by one
  useEffect(() => {
    if (phase !== 'warning') return;

    if (visibleCount < WARNING_LINES.length) {
      const timer = window.setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, visibleCount === 0 ? 450 : 420);
      return () => window.clearTimeout(timer);
    }

    const unlockTimer = window.setTimeout(() => {
      setShowUnlockBanner(true);
    }, 450);

    return () => window.clearTimeout(unlockTimer);
  }, [visibleCount, phase]);

  // Canvas galaxy explosion animation when button is clicked
  useEffect(() => {
    if (phase === 'warning') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const palette = ['#F59E0B', '#FDE68A', '#38BDF8', '#FFFFFF', '#FBBF24'];
    const particles: Particle[] = Array.from({ length: 240 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 14;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3.8,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.006 + Math.random() * 0.01,
      };
    });

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.992;
        p.vy *= 0.992;
        p.alpha = Math.max(0, p.alpha - p.decay);

        if (p.alpha > 0) {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [phase]);

  const handleInitiate = () => {
    soundEngine.unlock();
    soundEngine.playExplosionFanfare();
    soundEngine.startMusic();
    setPhase('explosion');

    transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
    const t1 = window.setTimeout(() => {
      setPhase('legend-statement');
    }, 1150);

    const t2 = window.setTimeout(() => {
      onComplete();
    }, 3400);
    transitionTimersRef.current = [t1, t2];
  };

  const handleRevealAllNow = () => {
    soundEngine.unlock();
    soundEngine.playWarningBeep();
    setVisibleCount(WARNING_LINES.length);
    setShowUnlockBanner(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-y-auto">
      {/* Explosion Canvas */}
      {phase !== 'warning' && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-10"
        />
      )}

      {/* Subtle Red Alert Vignette */}
      {phase === 'warning' && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(220, 38, 38, 0.14), transparent 65%)',
          }}
        />
      )}

      {/* Top Utility Bar */}
      <div className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10">
        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Photos ({photoCount}/50)</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              onToggleMute();
            }}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#F59E0B]" />
            )}
            <span className="hidden sm:inline">{isMuted ? 'Audio Muted' : 'Audio On'}</span>
          </button>

          {phase === 'warning' && (
            <button
              type="button"
              onClick={onComplete}
              className="px-3 py-2 min-h-[40px] text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-6 py-10">
        {phase === 'warning' && (
          <div className="max-w-2xl w-full space-y-6">
            {/* Red Warning Symbol */}
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-11 h-11 rounded-lg bg-red-500/15 border border-red-500/40 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="font-mono text-sm sm:text-base font-bold tracking-[0.2em] uppercase">
                ⚠️ SYSTEM WARNING
              </span>
            </div>

            {/* Line-by-line Reveal */}
            <div className="space-y-2.5 font-mono text-sm sm:text-base">
              {WARNING_LINES.slice(0, visibleCount).map((line, index) => {
                const isHeadline = index === 0;
                const isHighlight =
                  line.includes('MAXIMUM') || line.includes('PRICELESS');
                return (
                  <p
                    key={line}
                    className={`transition-opacity duration-300 ${
                      isHeadline
                        ? 'text-red-400 font-bold text-base sm:text-lg'
                        : isHighlight
                          ? 'text-amber-300 font-semibold'
                          : 'text-slate-200'
                    }`}
                  >
                    <span className="text-slate-500 mr-2">&gt;</span>
                    {line}
                  </p>
                );
              })}
            </div>

            {!showUnlockBanner && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRevealAllNow}
                  className="py-2 min-h-[40px] text-xs font-mono text-slate-400 hover:text-slate-200 underline underline-offset-4 cursor-pointer"
                >
                  Reveal All Lines Immediately
                </button>
              </div>
            )}

            {/* Dramatic Notification + Golden Button */}
            {showUnlockBanner && (
              <div className="pt-4 space-y-6 animate-fadeIn">
                <div className="p-5 rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent">
                  <div className="font-mono text-xs text-amber-300 tracking-widest uppercase mb-1">
                    {friendName} · {milestoneTitle}
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold tracking-wide text-amber-400">
                    LEVEL UP UNLOCKED: NEW AGE ACHIEVED!
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleInitiate}
                    className="px-7 py-4 min-h-[52px] rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-display font-extrabold text-sm sm:text-base tracking-wider uppercase animate-pulse-gold hover:scale-[1.02] transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                  >
                    INITIATE BIRTHDAY CELEBRATION
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 'explosion' && (
          <div className="text-center space-y-3">
            <div className="font-mono text-xs tracking-[0.35em] text-amber-300 uppercase">
              Hyperdrive Engaged
            </div>
            <div className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              LAUNCHING CELEBRATION...
            </div>
          </div>
        )}

        {phase === 'legend-statement' && (
          <div className="text-center max-w-3xl px-4 space-y-4">
            <p className="font-mono text-xs tracking-[0.3em] text-amber-400 uppercase">
              Transmission Confirmed
            </p>
            <h1
              className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              THIS UNIVERSE BELONGS TO ONE LEGEND.
            </h1>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-20 px-6 py-4 text-center text-[11px] font-mono text-slate-500 border-t border-white/10">
        Audio synthesis enabled on interaction · Best experienced with sound on
      </div>
    </div>
  );
}
