"use client";

import { create } from "zustand";

interface UIState {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
  drawerNodeId: string | null;
  setDrawerNodeId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  paletteOpen: false,
  setPaletteOpen: (open) => set({ paletteOpen: open }),
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
  drawerNodeId: null,
  setDrawerNodeId: (id) => set({ drawerNodeId: id }),
}));
