"use client";

import { toast } from "sonner";
import useNotesStore, { Note as NoteType } from "../stores/useNotesStore";

type Props = { note: NoteType };

export default function Note({ note }: Props) {
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const openNote = useNotesStore((s) => s.openNote);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (note.id === null) return;

    const noteTitle = note.title || "Untitled Note";

    toast(`Delete "${noteTitle}"?`, {
      action: {
        label: "Delete",
        onClick: () => {
          deleteNote(note.id!);
          toast.success(`Deleted "${noteTitle}"`);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast.error("Cancelled deletion");
        },
      },
      classNames: {
        actionButton: "bg-red-600 text-white hover:bg-red-700",
        cancelButton: "bg-gray-200 hover:bg-gray-300",
      },
      style: {
        "--toast-button-gap": "2px", // minimal gap between buttons
        "--toast-button-margin": "0 2px", // minimal margin around buttons
      } as React.CSSProperties,
    });
  };

  return (
    <div className="note">
      <a href="#" className="note__delete">
        <span className="note__delete-icon" onClick={handleDelete}>
          &times;
        </span>
      </a>
      <div className="note__content">
        <a
          href="#"
          className="note__title"
          onClick={(e) => {
            e.preventDefault();
            openNote(note);
          }}
        >
          {note.title ? <span>{note.title}</span> : <span>Untitled Note</span>}
        </a>
        <p className="note__body">
          {note.body ? (
            <span>{note.body}</span>
          ) : (
            <span>
              <em>Empty</em>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
