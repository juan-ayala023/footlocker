"use client";

import { create } from "zustand";

type Rect = { top: number; left: number; width: number; height: number };

/** Imagen que "vuela" de la card del catálogo a la galería del producto. */
export type SharedImage = { slug: string; src: string; from: Rect; to: Rect | null };

type UiState = {
  /** true cuando terminó el preloader (o no hubo). El hero espera esto para su reveal. */
  introDone: boolean;
  setIntroDone: () => void;

  sharedImage: SharedImage | null;
  startShared: (s: Omit<SharedImage, "to">) => void;
  landShared: (slug: string, to: Rect) => void;
  endShared: () => void;

  /** Producto en pantalla, para el mensaje prellenado de WhatsApp. */
  viewing: { name: string; url: string; size?: number } | null;
  setViewing: (v: UiState["viewing"]) => void;
};

export const useUi = create<UiState>()((set) => ({
  introDone: false,
  setIntroDone: () => set({ introDone: true }),

  sharedImage: null,
  startShared: (s) => set({ sharedImage: { ...s, to: null } }),
  landShared: (slug, to) =>
    set((state) => (state.sharedImage?.slug === slug ? { sharedImage: { ...state.sharedImage, to } } : state)),
  endShared: () => set({ sharedImage: null }),

  viewing: null,
  setViewing: (viewing) => set({ viewing }),
}));

export const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};
