import { useCallback, useEffect, useState } from "react";

import {
  BACKGROUND_PRESETS,
  BACKGROUND_STORAGE_KEY,
  CUSTOM_BACKGROUND_ID,
  CUSTOM_BACKGROUND_STORAGE_KEY,
} from "@/lib/intellistack/backgrounds";

/** Background choice is saved on this device only. */
export function useBackground() {
  const [selectedId, setSelectedId] = useState(BACKGROUND_PRESETS[0]?.id ?? "");
  const [customSrc, setCustomSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BACKGROUND_STORAGE_KEY);
      const custom = localStorage.getItem(CUSTOM_BACKGROUND_STORAGE_KEY);
      if (custom) setCustomSrc(custom);
      if (stored === CUSTOM_BACKGROUND_ID && custom) setSelectedId(CUSTOM_BACKGROUND_ID);
      else if (stored && BACKGROUND_PRESETS.some((p) => p.id === stored)) setSelectedId(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    try {
      localStorage.setItem(BACKGROUND_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const setCustom = useCallback(
    (dataUrl: string) => {
      try {
        localStorage.setItem(CUSTOM_BACKGROUND_STORAGE_KEY, dataUrl);
      } catch {
        throw new Error("This photo is too large to save on this device. Try a smaller image.");
      }
      setCustomSrc(dataUrl);
      select(CUSTOM_BACKGROUND_ID);
    },
    [select],
  );

  const clearCustom = useCallback(() => {
    try {
      localStorage.removeItem(CUSTOM_BACKGROUND_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setCustomSrc(null);
    select(BACKGROUND_PRESETS[0]?.id ?? "");
  }, [select]);

  const src =
    selectedId === CUSTOM_BACKGROUND_ID && customSrc
      ? customSrc
      : (BACKGROUND_PRESETS.find((p) => p.id === selectedId) ?? BACKGROUND_PRESETS[0])?.src ?? "";

  return { selectedId, customSrc, src, select, setCustom, clearCustom };
}
