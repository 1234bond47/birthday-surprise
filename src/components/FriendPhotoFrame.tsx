import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { FriendPhoto } from '../utils/photoStore';

interface FriendPhotoFrameProps {
  photo?: FriendPhoto;
  onOpenVault: () => void;
  onSelectLightbox?: (photo: FriendPhoto) => void;
  slotLabel?: string;
  className?: string;
  imgClassName?: string;
  preserveAspect?: boolean;
  accentColor?: string;
}

export function FriendPhotoFrame({
  photo,
  onOpenVault,
  onSelectLightbox,
  slotLabel = 'Upload His Photos',
  className = '',
  imgClassName = '',
  preserveAspect = false,
  accentColor = '#F59E0B',
}: FriendPhotoFrameProps) {
  const [imgError, setImgError] = useState(false);

  if (!photo || imgError) {
    return (
      <button
        type="button"
        onClick={onOpenVault}
        className={`w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 p-6 text-center bg-[#0D1017]/90 border border-dashed border-white/25 hover:border-[#F59E0B] transition-colors cursor-pointer group ${className}`}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center border border-white/15 bg-white/5 group-hover:scale-105 transition-transform"
          style={{ color: accentColor }}
        >
          <Upload className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-white">{slotLabel}</div>
          <p className="text-xs text-slate-400 max-w-[26ch]">
            Add up to 50 real photos of him — zero fake faces or stock placeholders.
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => (onSelectLightbox ? onSelectLightbox(photo) : onOpenVault())}
      className={`relative block w-full overflow-hidden text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#F59E0B] ${className}`}
      title={`View ${photo.name}`}
    >
      <img
        src={photo.url}
        alt={photo.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`w-full ${
          preserveAspect
            ? 'h-auto object-contain'
            : 'h-full object-cover object-[50%_20%]'
        } transition-transform duration-500 ease-out group-hover:scale-[1.03] ${imgClassName}`}
      />
      <span className="sr-only">Open photo {photo.name}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 text-[11px] font-mono text-white border border-white/15"
      >
        <Camera className="w-3 h-3 text-[#F59E0B]" />
        View
      </span>
    </button>
  );
}
