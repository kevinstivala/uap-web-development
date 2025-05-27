import { create } from "zustand";

type Filter = 'all' | 'activa' | 'completada';

interface UIState {
    filter: Filter;
    setFilter:(filter: Filter) => void;
}

export const useUIStore = create<UIState>((set) => ({
    filter: 'all',
    setFilter: (filter) => set({filter}),
}));