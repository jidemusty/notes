"use client";

import moment from "moment";
import { useMemo } from "react";
import useNotesStore from "../stores/useNotesStore";

export default function Pad() {
  const note = useNotesStore((s) => s.note);
  const saveNote = useNotesStore((s) => s.saveNote);
  const startSaveTimeOut = useNotesStore((s) => s.startSaveTimeOut);
  const updateCurrentNote = useNotesStore((s) => s.updateCurrentNote);

  const wordCount = useMemo(() => {
    const body = note?.body ?? "";
    if (!body || body.trim() === "") return 0;
    return body.trim().split(/\s+/).length;
  }, [note?.body]);

  const lastSaved = useMemo(() => {
    const last = note?.lastSaved;
    if (!last) return "Never";
    return moment(last).calendar();
  }, [note?.lastSaved]);

  const save = () => {
    if (!note || !note.id) {
      saveNote();
      return;
    }

    startSaveTimeOut();
  };

  return (
    <div className="pad">
      <input
        type="text"
        className="pad__title"
        placeholder="Untitled note"
        value={note && note.title ? note.title : ""}
        onChange={(e) => updateCurrentNote({ title: e.target.value })}
        onKeyDown={() => save()}
      />
      <textarea
        className="pad__text"
        placeholder="Start writing..."
        value={note && note.body ? note.body : ""}
        onChange={(e) => updateCurrentNote({ body: e.target.value })}
        onKeyDown={() => save()}
      />

      <footer className="pad__footer">
        <ul className="pad__footer-items">
          <li className="pad__footer-item">Words: {wordCount}</li>
          <li className="pad__footer-item pad__footer-item--right">
            Last saved: {lastSaved}
          </li>
        </ul>
      </footer>
    </div>
  );
}
