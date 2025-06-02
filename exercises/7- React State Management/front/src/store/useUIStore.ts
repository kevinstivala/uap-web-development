import { create } from "zustand";

type Filter = 'all' | 'activa' | 'completada';

interface UIState {
    filter: Filter;
    offset: number;
    limit: number;
    // Añadido: Paginación
    setFilter:(filter: Filter) => void;
    setOffset: (offset: number) => void;
    setLimit: (limit: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
    filter: 'all',
    offset: 0,
    limit: 5, // Valor por defecto para la paginación
    setFilter: (filter) => set({filter}),
    setOffset: (offset) => set({offset}),
    setLimit: (limit) => set({limit}),
}));