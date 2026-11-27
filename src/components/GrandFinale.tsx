import { useCallback, useEffect, useRef, useState } from 'react';
import { PartyPopper, RotateCcw } from 'lucide-react';
import { CelebrationConfig, FriendPhoto } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';
import { soundEngine } from '../utils/soundEngine';

interface GrandFinaleProps {
  photos: FriendPhoto[];
  config: CelebrationConfig;
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
  onReplay: () => void;
}

export function GrandFinale({
  photos,
  config,
  onOpenVault,
  onSelectLightbox,
  onReplay,
}: GrandFinaleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spawnBurstRef = useRef<((cx: number, cy: number, count?: number) => void) | null>(null);
  const [candlesLit, setCandlesLit] = useState(true);

  const heroPhoto =
    photos.find((p) => p.id === config.finalePhotoId) || photos[0];

  const triggerFireworkBurst = useCallback(() => {
    soundEngine.playFireworkPop();
    const canvas = canvasRef.current;
    const spawn = spawnBurstRef.current;
    if (canvas && spawn) {
      spawn(canvas.width * 0.28, canvas.height * 0.24, 52);
      spawn(canvas.width * 0.72, canvas.height * 0.24, 52);
      spawn(canvas.width * 0.5, canvas.height * 0.18, 64);
    }
  }, []);

  // Fireworks + Golden Confetti Canvas
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

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      gravity: number;
    }

    const colors = ['#F59E0B', '#FDE68A', '#38BDF8', '#F43F5E', '#A855F7', '#FFFFFF'];
    const sparks: Spark[] = [];

    const spawnBurst = (cx: number, cy: number, count = 48) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 6.5;
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 1.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          gravity: 0.06,
        });
      }
    };

    spawnBurstRef.current = spawnBurst;

    // Initial celebratory bursts
    spawnBurst(canvas.width * 0.25, canvas.height * 0.25, 55);
    spawnBurst(canvas.width * 0.75, canvas.height * 0.3, 55);

    const autoTimer = window.setInterval(() => {
      spawnBurst(
        canvas.width * (0.15 + Math.random() * 0.7),
        canvas.height * (0.15 + Math.random() * 0.45),
        40
      );
    }, 1800);

    const render = () => {
      ctx.fillStyle = 'rgba(5, 6, 10, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.alpha -= 0.012;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.clearInterval(autoTimer);
      window.removeEventListener('resize', resize);
      spawnBurstRef.current = null;
    };
  }, []);

  return (
    <section
      id="grand-finale"
      className="relative py-24 lg:py-32 px-6 bg-[#05060A] overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 max-w-[1100px] mx-auto text-center space-y-12">
        {/* Headline */}
        <div className="space-y-4">
          <p className="font-mono text-xs tracking-[0.3em] text-amber-400 uppercase">
            Grand Finale · {config.friendName}
          </p>
          <h2
            className="font-display font-extrabold tracking-tight text-white leading-[1.04]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
              textWrap: 'balance',
            }}
          >
            HAPPY BIRTHDAY, LEGEND!
          </h2>
          <p className="font-serif-luxury text-lg sm:text-2xl text-amber-300">
            THE UNIVERSE IS YOURS. MAKE IT EPIC.
          </p>
        </div>

        {/* Massive Cinematic Frame + Spectacular Animated Birthday Cake */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          {/* Best Uploaded Photograph in Massive Golden Frame */}
          <div className="lg:col-span-7 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#F59E0B]/40 via-[#FDE68A]/20 to-[#0F4C81]/30 border border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black">
              <FriendPhotoFrame
                photo={heroPhoto}
                onOpenVault={onOpenVault}
                onSelectLightbox={onSelectLightbox}
                slotLabel="Feature His Best Photo Here"
                accentColor="#F59E0B"
              />
            </div>
          </div>

          {/* Animated Multi-Tier Celebration Cake */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0B0E17]/90 border border-amber-400/35 p-8 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center pt-4">
              {/* Candles */}
              <div className="flex items-end gap-5 mb-1">
                {[0, 1, 2, 3, 4].map((c) => (
                  <div key={c} className="flex flex-col items-center">
                    {candlesLit ? (
                      <div
                        className="w-2.5 h-5 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-white animate-candle-flicker shadow-[0_0_12px_#FBBF24]"
                        style={{ animationDelay: `${c * 0.14}s` }}
                      />
                    ) : (
                      <div className="w-1.5 h-3 rounded-full bg-slate-400/40" />
                    )}
                    <div className="w-2 h-8 rounded-t-xs bg-gradient-to-b from-amber-200 to-amber-500 border border-amber-100/40" />
                  </div>
                ))}
              </div>

              {/* Top Tier */}
              <div className="w-36 h-10 rounded-t-xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 border-b-4 border-amber-700 flex items-center justify-center">
                <span className="font-mono text-[10px] font-bold text-black tracking-wider">
                  MAKE A WISH
                </span>
              </div>

              {/* Middle Tier */}
              <div className="w-48 h-12 rounded-t-lg bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] border-b-4 border-amber-400 flex items-center justify-center">
                <span className="font-mono text-[10px] font-bold text-amber-300 tracking-widest">
                  100% LEGENDARY
                </span>
              </div>

              {/* Bottom Tier */}
              <div className="w-60 h-14 rounded-t-lg bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b-4 border-amber-500 flex items-center justify-center">
                <span className="font-display text-xs font-extrabold text-white tracking-widest">
                  HAPPY BIRTHDAY
                </span>
              </div>

              {/* Cake Platter */}
              <div className="w-64 max-w-full h-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-200 to-amber-600 mt-0.5" />
            </div>

            <button
              type="button"
              onClick={() => {
                setCandlesLit((prev) => !prev);
                triggerFireworkBurst();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer"
            >
              <PartyPopper className="w-4 h-4" />
              <span>
                {candlesLit
                  ? 'Make a Wish & Fireworks!'
                  : 'Relight Candles & Launch!'}
              </span>
            </button>
          </div>
        </div>

        {/* Final Replay CTA */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playExplosionFanfare();
              onReplay();
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 min-h-[52px] rounded-xl bg-white hover:bg-amber-300 text-black font-display font-extrabold text-sm sm:text-base tracking-wider uppercase transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            <span>REPLAY THE ADVENTURE</span>
          </button>

          <p className="font-mono text-xs text-slate-500">
            Built with chaos, loyalty, and infinite memories.
          </p>
        </div>
      </div>
    </section>
  );
}
