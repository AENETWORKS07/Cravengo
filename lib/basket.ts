"use client";

import { create } from "zustand";

/** Items picked on the menu, carried to the Earn screen for the demo visit. Not persisted on purpose. */
type Basket = {
  itemIds: string[];
  storeId: string | null;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  setStore: (id: string) => void;
  clear: () => void;
};

export const useBasket = create<Basket>()((set, get) => ({
  itemIds: [],
  storeId: null,
  add: (id) => set({ itemIds: [...get().itemIds, id] }),
  remove: (id) => {
    const ids = [...get().itemIds];
    const i = ids.lastIndexOf(id);
    if (i >= 0) ids.splice(i, 1);
    set({ itemIds: ids });
  },
  toggle: (id) => (get().itemIds.includes(id) ? get().remove(id) : get().add(id)),
  setStore: (id) => set({ storeId: id }),
  clear: () => set({ itemIds: [] }),
}));
