"use client";

import { useMemo } from "react";
import useNotesStore from "../stores/useNotesStore";
import Note from "./Note";

export default function Sidebar() {
  const notes = useNotesStore((s) => s.notes);
  const clearCurrentNote = useNotesStore((s) => s.clearCurrentNote);

  const notesSorted = useMemo(() => {
    const list = notes || [];
    return [...list].sort((a, b) => {
      const aT = a.lastSaved || 0;
      const bT = b.lastSaved || 0;
      return bT - aT;
    });
  }, [notes]);

  return (
    <div className="sidebar">
      <div>
        {notesSorted.length ? (
          notesSorted.map((note) => (
            <Note key={note.title || String(note.id)} note={note} />
          ))
        ) : (
          <div className="sidebar__content">No Notes, get writing!</div>
        )}
      </div>
      <div className="sidebar__content">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            clearCurrentNote();
          }}
        >
          Start a new note
        </a>
      </div>
    </div>
  );
}
