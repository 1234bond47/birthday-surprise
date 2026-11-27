import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addUploadedFiles,
  CelebrationConfig,
  clearAllUploadedPhotos,
  decodeShareHash,
  deleteUploadedPhoto,
  FriendPhoto,
  getBundledPhotos,
  loadConfig,
  loadUploadedPhotos,
  loadUrlPhotos,
  parsePhotoUrls,
  saveConfig,
  saveUrlPhotos,
} from './utils/photoStore';
import { soundEngine } from './utils/soundEngine';
import { OpeningWarning } from './components/OpeningWarning';
import { FloatingControls } from './components/FloatingControls';
import { CinematicIntro } from './components/CinematicIntro';
import { StarWarsSection } from './components/StarWarsSection';
import { LegoSection } from './components/LegoSection';
import { BondSection } from './components/BondSection';
import { AutomobileSection } from './components/AutomobileSection';
import { RailwaySection } from './components/RailwaySection';
import { GamingSection } from './components/GamingSection';
import { CaSection } from './components/CaSection';
import { MemoriesGallery } from './components/MemoriesGallery';
import { FriendshipSection } from './components/FriendshipSection';
import { GrandFinale } from './components/GrandFinale';
import { PhotoVaultModal } from './components/PhotoVaultModal';

export default function App() {
  const [stage, setStage] = useState<'opening' | 'main'>('opening');
  const [uploadedPhotos, setUploadedPhotos] = useState<FriendPhoto[]>([]);
  const [urlPhotos, setUrlPhotos] = useState<FriendPhoto[]>(() => {
    const shared = decodeShareHash();
    if (shared?.urlPhotos && shared.urlPhotos.length > 0) {
      return shared.urlPhotos;
    }
    return loadUrlPhotos();
  });
  const [config, setConfig] = useState<CelebrationConfig>(() => {
    const base = loadConfig();
    const shared = decodeShareHash();
    if (shared?.config) {
      return {
        friendName: shared.config.friendName || base.friendName,
        milestoneTitle: shared.config.milestoneTitle || base.milestoneTitle,
        finalePhotoId: shared.config.finalePhotoId ?? base.finalePhotoId,
      };
    }
    return base;
  });
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const bundledPhotos = useMemo(() => getBundledPhotos(), []);
  const allPhotos = useMemo(
    () => [...bundledPhotos, ...urlPhotos, ...uploadedPhotos],
    [bundledPhotos, urlPhotos, uploadedPhotos]
  );

  useEffect(() => {
    let active = true;
    loadUploadedPhotos().then((loaded) => {
      if (active) {
        setUploadedPhotos(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleUpdateConfig = useCallback((next: CelebrationConfig) => {
    setConfig(next);
    saveConfig(next);
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const handleUploadFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return;
    setUploadProgress({ current: 0, total: list.length });
    const created = await addUploadedFiles(list, (current, total) => {
      setUploadProgress({ current, total });
    });
    setUploadedPhotos((prev) => [...prev, ...created]);
    setUploadProgress(null);
  }, []);

  const handleAddPhotoUrls = useCallback((rawText: string) => {
    const parsed = parsePhotoUrls(rawText);
    if (parsed.length === 0) return 0;
    setUrlPhotos((prev) => {
      const existingUrls = new Set(prev.map((p) => p.url));
      const fresh = parsed.filter((p) => !existingUrls.has(p.url));
      const merged = [...prev, ...fresh];
      saveUrlPhotos(merged);
      return merged;
    });
    return parsed.length;
  }, []);

  const handleDeletePhoto = useCallback(
    async (id: string) => {
      if (id.startsWith('url-')) {
        setUrlPhotos((prev) => {
          const next = prev.filter((p) => p.id !== id);
          saveUrlPhotos(next);
          return next;
        });
      } else {
        await deleteUploadedPhoto(id);
        setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
      }
      if (config.finalePhotoId === id) {
        handleUpdateConfig({ ...config, finalePhotoId: null });
      }
    },
    [config, handleUpdateConfig]
  );

  const handleClearAll = useCallback(async () => {
    await clearAllUploadedPhotos();
    setUploadedPhotos([]);
    setUrlPhotos([]);
    saveUrlPhotos([]);
    handleUpdateConfig({ ...config, finalePhotoId: null });
  }, [config, handleUpdateConfig]);

  const handleSelectLightboxByPhoto = useCallback(
    (photo: FriendPhoto) => {
      const idx = allPhotos.findIndex((p) => p.id === photo.id);
      if (idx !== -1) {
        setLightboxIndex(idx);
      }
    },
    [allPhotos]
  );

  const handleReplay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setStage('opening');
  }, []);

  return (
    <div className="min-h-screen bg-[#05060A] text-[#F4F4F6]">
      {stage === 'opening' ? (
        <OpeningWarning
          friendName={config.friendName}
          milestoneTitle={config.milestoneTitle}
          photoCount={allPhotos.length}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenVault={() => setIsVaultOpen(true)}
          onComplete={() => {
            window.scrollTo({ top: 0, behavior: 'auto' });
            setStage('main');
          }}
        />
      ) : (
        <>
          <FloatingControls
            photoCount={allPhotos.length}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenVault={() => setIsVaultOpen(true)}
          />

          <main>
            <CinematicIntro
              friendName={config.friendName}
              photoCount={allPhotos.length}
              onOpenVault={() => setIsVaultOpen(true)}
              onEnterUniverse={() => {
                document
                  .getElementById('star-wars')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <StarWarsSection
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <LegoSection
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <BondSection
              friendName={config.friendName}
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <AutomobileSection
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <RailwaySection
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <GamingSection
              friendName={config.friendName}
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <CaSection
              friendName={config.friendName}
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <MemoriesGallery
              photos={allPhotos}
              config={config}
              onUpdateConfig={handleUpdateConfig}
              onOpenVault={() => setIsVaultOpen(true)}
              lightboxIndex={lightboxIndex}
              onSetLightboxIndex={setLightboxIndex}
            />

            <FriendshipSection
              photos={allPhotos}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
            />

            <GrandFinale
              photos={allPhotos}
              config={config}
              onOpenVault={() => setIsVaultOpen(true)}
              onSelectLightbox={handleSelectLightboxByPhoto}
              onReplay={handleReplay}
            />
          </main>
        </>
      )}

      <PhotoVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        photos={allPhotos}
        urlPhotos={urlPhotos}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onUploadFiles={handleUploadFiles}
        onAddPhotoUrls={handleAddPhotoUrls}
        onDeletePhoto={handleDeletePhoto}
        onClearAll={handleClearAll}
        uploadProgress={uploadProgress}
      />
    </div>
  );
}
