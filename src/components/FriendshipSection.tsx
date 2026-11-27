import { useEffect, useRef } from 'react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';

interface FriendshipSectionProps {
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

export function FriendshipSection({
  photos,
  onOpenVault,
  onSelectLightbox,
}: FriendshipSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionPhotos = pickPhotosByIds(photos, ['kushal-04', 'kushal-27'], 25);

  // Slow-moving starry sky background
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

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.7 + Math.random() * 1.6,
      vy: 0.00015 + Math.random() * 0.0003,
      alpha: 0.25 + Math.random() * 0.65,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.y -= s.vy;
        if (s.y < 0) s.y = 1;
        ctx.fillStyle = `rgba(253, 230, 138, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      id="friendship"
      className="relative py-24 lg:py-32 px-6 bg-[#06070D] overflow-hidden border-b border-white/10"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Heartfelt Letter */}
        <div className="lg:col-span-7 space-y-6">
          <p className="font-mono text-xs tracking-[0.25em] text-amber-300 uppercase">
            A Note From Your Best Friend
          </p>

          <h2
            className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white leading-tight"
            style={{ textWrap: 'balance' }}
          >
            SOME PEOPLE MAKE LIFE AN ADVENTURE.
          </h2>

          <div className="space-y-5 text-base sm:text-lg leading-[1.8] text-slate-200 max-w-[62ch]">
            <p>
              Another year older, but the madness remains the same. From random
              conversations and unforgettable adventures to stupid jokes and
              memories that will stay forever, life is simply better with a
              friend like you.
            </p>
            <p>
              I hope your life is always full of happiness, success, crazy
              adventures, long drives, epic gaming sessions and everything
              you&apos;ve ever dreamed of.
            </p>
            <p>
              Never stop being the person you are. Keep chasing dreams, keep
              smiling and keep making memories.
            </p>
            <p className="font-display font-bold text-amber-300 text-xl pt-2">
              Happy Birthday, legend. Here&apos;s to many more adventures
              together!
            </p>
          </div>
        </div>

        {/* Quiet Companion Frames */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {sectionPhotos.map((photo, idx) => (
              <div
                key={photo ? photo.id : idx}
                className={`rounded-xl overflow-hidden border border-amber-300/25 bg-black/70 p-2 ${
                  idx === 1 ? 'mt-6 sm:mt-8' : ''
                }`}
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <FriendPhotoFrame
                    photo={photo}
                    onOpenVault={onOpenVault}
                    onSelectLightbox={onSelectLightbox}
                    slotLabel={`Memory 0${idx + 1}`}
                    accentColor="#FCD34D"
                    className="h-full"
                  />
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
