import moment from "moment";
import { create } from "zustand";
import type { PersistOptions } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";

export type Note = {
  id: number | null;
  title: string | null;
  body: string | null;
  lastSaved: number | null;
};

type State = {
  note: Note;
  notes: Note[];
  saveTimeOut: number | null;
  notesSorted: () => Note[];
  lastSaved: () => string;
  wordCount: () => number;
  saveNote: () => void;
  startSaveTimeOut: () => void;
  stopSaveTimeout: () => void;
  openNote: (note: Note) => void;
  clearCurrentNote: () => void;
  deleteNote: (id: number) => void;
  updateCurrentNote: (partial: Partial<Note>) => void;
};

// No-op storage helper is not necessary when using createJSONStorage

export const useNotesStore = create<State>()(
  persist<State>(
    (set, get) => ({
      note: { id: null, title: null, body: null, lastSaved: null },
      notes: [],
      saveTimeOut: null,
      notesSorted: () => {
        const notes = get().notes || [];
        return [...notes].sort((a, b) => {
          const aT = a.lastSaved || 0;
          const bT = b.lastSaved || 0;
          return bT - aT;
        });
      },
      lastSaved: () => {
        const last = get().note.lastSaved;
        if (!last) return "Never";
        return moment(last).calendar();
      },
      wordCount: () => {
        const body = get().note.body;
        if (!body || body.trim() === "") return 0;
        return body.trim().split(/\s+/).length;
      },
      saveNote: () => {
        set((state) => {
          const updatedNote: Note = { ...state.note };
          const now = Date.now();
          updatedNote.lastSaved = now;

          // If note has an id, update existing note; otherwise create new
          if (updatedNote.id) {
            const idx = state.notes.findIndex((n) => n.id === updatedNote.id);
            if (idx >= 0) {
              const notes = [...state.notes];
              notes[idx] = updatedNote;
              return { note: updatedNote, notes };
            }
          }

          // new note
          const id = now;
          updatedNote.id = id;
          return { note: updatedNote, notes: [updatedNote, ...state.notes] };
        });
      },
      startSaveTimeOut: () => {
        const s = get();
        if (s.saveTimeOut !== null) return;
        const timeout = window.setTimeout(() => {
          get().saveNote();
          get().stopSaveTimeout();
        }, 1000);
        set(() => ({ saveTimeOut: timeout }));
      },
      stopSaveTimeout: () => {
        const s = get();
        if (s.saveTimeOut) {
          clearTimeout(s.saveTimeOut);
        }
        set(() => ({ saveTimeOut: null }));
      },
      openNote: (note) => set(() => ({ note })),
      clearCurrentNote: () => {
        get().stopSaveTimeout();
        set(() => ({
          note: { id: null, title: null, body: null, lastSaved: null },
        }));
      },
      deleteNote: (id) => {
        const s = get();
        if (id === s.note.id) {
          s.clearCurrentNote();
        }
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      },
      updateCurrentNote: (partial) => {
        set((state) => ({ note: { ...state.note, ...partial } }));
      },
    }),
    {
      name: "notes-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : undefined
      ),
      partialize: (state) => ({ notes: state.notes }),
    } as PersistOptions<State>
  )
);

export default useNotesStore;
