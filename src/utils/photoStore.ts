export interface FriendPhoto {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  isBundled?: boolean;
  isExternalUrl?: boolean;
  uploadedAt: number;
}

export interface CelebrationConfig {
  friendName: string;
  milestoneTitle: string;
  finalePhotoId: string | null;
}

const DB_NAME = 'legend_birthday_vault_v1';
const STORE_NAME = 'photos';
const CONFIG_STORAGE_KEY = 'legend_birthday_config_v1';
const URL_PHOTOS_STORAGE_KEY = 'legend_birthday_url_photos_v1';

import { KUSHAL_PHOTOS } from '../data/kushalPhotos';

// Automatically pick up any personal images placed inside /src/assets/friend-photos/
const bundledModules = import.meta.glob<string>(
  '/src/assets/friend-photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);

export function getBundledPhotos(): FriendPhoto[] {
  const folderPhotos = Object.entries(bundledModules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, url], index) => {
      const fileName = path.split('/').pop() || `Memory ${index + 1}`;
      return {
        id: `bundled-${index}-${fileName}`,
        name: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        url,
        width: 1200,
        height: 900,
        isBundled: true,
        uploadedAt: 1000 + index,
      };
    });

  return [...KUSHAL_PHOTOS, ...folderPhotos];
}

export function normalizePhotoUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Convert Google Drive share links into direct embeddable image URLs
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1600`;
  }

  const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w1600`;
  }

  const ucMatch = trimmed.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w1600`;
  }

  return trimmed;
}

export function parsePhotoUrls(inputText: string): FriendPhoto[] {
  const lines = inputText
    .split(/[\n,]+/)
    .map((line) => normalizePhotoUrl(line))
    .filter((url) => /^https?:\/\//i.test(url));

  const unique = Array.from(new Set(lines));
  const now = Date.now();
  return unique.map((url, idx) => ({
    id: `url-${now}-${idx}`,
    name: `Memory ${String(idx + 1).padStart(2, '0')}`,
    url,
    width: 1200,
    height: 900,
    isExternalUrl: true,
    uploadedAt: now + idx,
  }));
}

export function loadUrlPhotos(): FriendPhoto[] {
  try {
    const raw = localStorage.getItem(URL_PHOTOS_STORAGE_KEY);
    if (!raw) return [];
    const urls = JSON.parse(raw) as string[];
    if (!Array.isArray(urls)) return [];
    return urls.map((url, idx) => ({
      id: `url-saved-${idx}`,
      name: `Memory ${String(idx + 1).padStart(2, '0')}`,
      url,
      width: 1200,
      height: 900,
      isExternalUrl: true,
      uploadedAt: idx,
    }));
  } catch {
    return [];
  }
}

export function saveUrlPhotos(photos: FriendPhoto[]): void {
  try {
    const urls = photos.map((p) => p.url);
    localStorage.setItem(URL_PHOTOS_STORAGE_KEY, JSON.stringify(urls));
  } catch {
    // ignore storage errors
  }
}

export function encodeShareHash(
  config: CelebrationConfig,
  urlPhotos: FriendPhoto[]
): string {
  const payload = {
    n: config.friendName,
    m: config.milestoneTitle,
    f: config.finalePhotoId,
    u: urlPhotos.map((p) => p.url),
  };
  const json = JSON.stringify(payload);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return `#legend=${encoded}`;
}

export function decodeShareHash(): {
  config?: Partial<CelebrationConfig>;
  urlPhotos?: FriendPhoto[];
} | null {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#legend=')) return null;
    const encoded = hash.slice('#legend='.length);
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json) as {
      n?: string;
      m?: string;
      f?: string | null;
      u?: string[];
    };
    const urlPhotos: FriendPhoto[] = Array.isArray(parsed.u)
      ? parsed.u.map((url, idx) => ({
          id: `url-shared-${idx}`,
          name: `Memory ${String(idx + 1).padStart(2, '0')}`,
          url,
          width: 1200,
          height: 900,
          isExternalUrl: true,
          uploadedAt: idx,
        }))
      : [];
    return {
      config: {
        friendName: parsed.n || 'KUSHAL',
        milestoneTitle: parsed.m || 'LEVEL 19 UNLOCKED',
        finalePhotoId: parsed.f ?? null,
      },
      urlPhotos,
    };
  } catch {
    return null;
  }
}

export function loadConfig(): CelebrationConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CelebrationConfig>;
      return {
        friendName:
          !parsed.friendName || parsed.friendName === 'THE LEGEND'
            ? 'KUSHAL'
            : parsed.friendName,
        milestoneTitle:
          !parsed.milestoneTitle || parsed.milestoneTitle === 'NEW AGE ACHIEVED'
            ? 'LEVEL 19 UNLOCKED'
            : parsed.milestoneTitle,
        finalePhotoId: parsed.finalePhotoId || 'kushal-20',
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    friendName: 'KUSHAL',
    milestoneTitle: 'LEVEL 19 UNLOCKED',
    finalePhotoId: 'kushal-20',
  };
}

export function saveConfig(config: CelebrationConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

interface StoredPhotoRecord {
  id: string;
  name: string;
  blob: Blob;
  width: number;
  height: number;
  uploadedAt: number;
}

export async function loadUploadedPhotos(): Promise<FriendPhoto[]> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const records = (request.result as StoredPhotoRecord[]).sort(
          (a, b) => a.uploadedAt - b.uploadedAt
        );
        const photos: FriendPhoto[] = records.map((rec) => ({
          id: rec.id,
          name: rec.name,
          url: URL.createObjectURL(rec.blob),
          width: rec.width,
          height: rec.height,
          uploadedAt: rec.uploadedAt,
        }));
        resolve(photos);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

async function optimizeImageFile(
  file: File
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1600;
      let targetWidth = img.naturalWidth || 1200;
      let targetHeight = img.naturalHeight || 900;

      if (targetWidth > maxDim || targetHeight > maxDim) {
        if (targetWidth >= targetHeight) {
          targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
          targetWidth = maxDim;
        } else {
          targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
          targetHeight = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ blob: file, width: targetWidth, height: targetHeight });
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, width: targetWidth, height: targetHeight });
          } else {
            resolve({ blob: file, width: targetWidth, height: targetHeight });
          }
        },
        'image/webp',
        0.86
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Unable to read image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

export async function addUploadedFiles(
  files: FileList | File[],
  onProgress?: (completed: number, total: number) => void
): Promise<FriendPhoto[]> {
  const imageFiles = Array.from(files).filter((f) =>
    f.type.startsWith('image/')
  );
  if (imageFiles.length === 0) return [];

  const db = await openDB();
  const created: FriendPhoto[] = [];
  const baseTime = Date.now();

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    try {
      const { blob, width, height } = await optimizeImageFile(file);
      const id = `upload-${baseTime}-${i}-${Math.random().toString(36).slice(2, 8)}`;
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const record: StoredPhotoRecord = {
        id,
        name: cleanName || `Memory ${i + 1}`,
        blob,
        width,
        height,
        uploadedAt: baseTime + i,
      };

      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      created.push({
        id: record.id,
        name: record.name,
        url: URL.createObjectURL(blob),
        width,
        height,
        uploadedAt: record.uploadedAt,
      });
    } catch {
      // skip unreadable file cleanly
    }

    onProgress?.(i + 1, imageFiles.length);
  }

  return created;
}

export async function deleteUploadedPhoto(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllUploadedPhotos(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function pickSectionPhotos(
  photos: FriendPhoto[],
  startIndex: number,
  count: number
): FriendPhoto[] {
  if (photos.length === 0) return [];
  const result: FriendPhoto[] = [];
  for (let i = 0; i < count; i++) {
    result.push(photos[(startIndex + i) % photos.length]);
  }
  return result;
}

export function pickPhotosByIds(
  photos: FriendPhoto[],
  preferredIds: string[],
  fallbackStart = 0
): FriendPhoto[] {
  if (photos.length === 0) return [];
  return preferredIds.map((id, idx) => {
    const match = photos.find((p) => p.id === id);
    return match || photos[(fallbackStart + idx) % photos.length];
  });
}
