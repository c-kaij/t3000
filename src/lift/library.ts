import { createContext, useContext } from 'react';
import type { Exercise, MovementViz } from './types';

export const STORAGE_KEY = 'exerciseTiers.customExercises.v1';

export interface StoredCustom {
  exercise: Exercise;
  movement: MovementViz | null;
}

export function loadCustom(): StoredCustom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface LibraryContextValue {
  exercises: Exercise[];
  movements: Record<string, MovementViz>;
  addExercise: (exercise: Exercise, movement: MovementViz | null) => void;
  removeExercise: (id: string) => void;
}

export const LibraryContext = createContext<LibraryContextValue | null>(null);

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within a LibraryProvider');
  return ctx;
}
