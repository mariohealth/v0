const ZIP_STORAGE_KEY = 'userZipCode';
const CARRIER_STORAGE_KEY = 'userCarrierId';

function readStorage(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value?: string | null) {
  try {
    if (typeof window === 'undefined') return;
    if (value && value.trim()) {
      localStorage.setItem(key, value.trim());
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore storage errors
  }
}

export function normalizeZip(zip?: string | null): string | undefined {
  if (!zip) return undefined;
  const trimmed = zip.trim();
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(trimmed) ? trimmed : undefined;
}

export function persistZip(zip?: string | null) {
  const normalized = normalizeZip(zip);
  writeStorage(ZIP_STORAGE_KEY, normalized || null);
}

export function getEffectiveZip(input?: {
  profileZip?: string | null;
  preferenceZip?: string | null;
  urlZip?: string | null;
}): string | undefined {
  const fromProfile = normalizeZip(input?.profileZip);
  if (fromProfile) {
    persistZip(fromProfile);
    return fromProfile;
  }

  const fromPreference = normalizeZip(input?.preferenceZip);
  if (fromPreference) {
    persistZip(fromPreference);
    return fromPreference;
  }

  const fromUrl = normalizeZip(input?.urlZip);
  if (fromUrl) {
    persistZip(fromUrl);
    return fromUrl;
  }

  const stored = normalizeZip(readStorage(ZIP_STORAGE_KEY));
  if (stored) return stored;

  return undefined;
}

function normalizeCarrier(carrierId?: string | null): string | undefined {
  const trimmed = carrierId?.trim();
  return trimmed ? trimmed : undefined;
}

export function persistCarrier(carrierId?: string | null) {
  const normalized = normalizeCarrier(carrierId);
  writeStorage(CARRIER_STORAGE_KEY, normalized || null);
}

export function getEffectiveCarrier(input?: {
  selectedCarrierId?: string | null;
  preferredCarrierIds?: Array<string | null | undefined>;
}): string | undefined {
  const selected = normalizeCarrier(input?.selectedCarrierId);
  if (selected) {
    persistCarrier(selected);
    return selected;
  }

  const stored = normalizeCarrier(readStorage(CARRIER_STORAGE_KEY));
  if (stored) return stored;

  const preferred = (input?.preferredCarrierIds || [])
    .map(normalizeCarrier)
    .find(Boolean);
  if (preferred) {
    persistCarrier(preferred);
    return preferred;
  }

  return undefined;
}

export const localeStorageKeys = {
  zip: ZIP_STORAGE_KEY,
  carrier: CARRIER_STORAGE_KEY,
};

