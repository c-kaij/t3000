import { useMemo, useState, type ReactNode } from 'react';
import { EXERCISES } from './data/exercises';
import { MOVEMENTS } from './data/movements';
import { LibraryContext, loadCustom, STORAGE_KEY, type LibraryContextValue } from './library';
import type { MovementViz } from './types';

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState(() => loadCustom());

  const value = useMemo<LibraryContextValue>(() => {
    const exercises = [...EXERCISES, ...custom.map((c) => c.exercise)];
    const movements: Record<string, MovementViz> = { ...MOVEMENTS };
    for (const c of custom) {
      if (c.movement) movements[c.exercise.id] = c.movement;
    }

    const addExercise: LibraryContextValue['addExercise'] = (exercise, movement) => {
      setCustom((prev) => {
        const next = [...prev, { exercise, movement }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    };

    const removeExercise: LibraryContextValue['removeExercise'] = (id) => {
      setCustom((prev) => {
        const next = prev.filter((c) => c.exercise.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    };

    return { exercises, movements, addExercise, removeExercise };
  }, [custom]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
