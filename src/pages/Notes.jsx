import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import PageLoader from "../components/PageLoader.jsx";
import NotesCalendar from "../components/NotesCalendar.jsx";
import NoteEditor from "../components/NoteEditor.jsx";

const GREEN = "#15803d";
const GREEN_BG = "#f0fdf4";

const styles = {
  page: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    background: "#f4f6f5",
    padding: 24,
    boxSizing: "border-box",
    minHeight: "100vh",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 16,
  },
  pageTitle: { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0 },
  pageSubtitle: { fontSize: 13, color: "#64748b", margin: "4px 0 0" },
  newNoteBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: GREEN,
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: 18,
    alignItems: "start",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    position: "sticky",
    top: 24,
  },
  listCard: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e9edec",
    padding: 12,
    maxHeight: "calc(100vh - 340px)",
    minHeight: 220,
    overflowY: "auto",
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.06em",
    padding: "8px 8px 6px",
  },
  noteItem: (active) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    padding: "10px 8px",
    borderRadius: 10,
    cursor: "pointer",
    background: active ? GREEN_BG : "transparent",
    marginBottom: 2,
  }),
  noteItemTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  noteTitle: (active) => ({
    fontSize: 13,
    fontWeight: 700,
    color: active ? GREEN : "#0f172a",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  noteDate: { fontSize: 10.5, color: "#94a3b8", margin: "2px 0 3px" },
  noteSnippet: {
    fontSize: 11.5,
    color: "#64748b",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  pinBtn: (pinned) => ({
    width: 24,
    height: 24,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: pinned ? GREEN : "#cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    fontSize: 14,
  }),
  emptyList: {
    padding: "24px 12px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12.5,
  },
  rightCol: { minHeight: "70vh" },
};

// Cuplikan teks singkat dari dokumen JSON Tiptap (dipakai untuk update
// tampilan list secara instan setelah autosave, tanpa perlu refetch list).
const quickSnippet = (docJson, maxLen = 140) => {
  if (!docJson) return "";
  let text = "";
  const walk = (node) => {
    if (!node || text.length >= maxLen) return;
    if (node.type === "text" && node.text) text += node.text + " ";
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        if (text.length >= maxLen) break;
        walk(child);
      }
    }
  };
  walk(docJson);
  text = text.trim();
  return text.length > maxLen ? text.slice(0, maxLen).trim() + "…" : text;
};

const formatShortDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const Notes = () => {
  const [notes, setNotes] = useState(null); // null = belum dimuat
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openingNote, setOpeningNote] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pinningId, setPinningId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/notes")
      .then(({ data }) => {
        if (cancelled) return;
        const list = data?.notes || [];
        setNotes(list);
        if (list.length > 0) {
          openNote(list[0].id);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Gagal memuat daftar catatan.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNote = async (id) => {
    setSelectedId(id);
    setOpeningNote(true);
    try {
      const { data } = await api.get(`/notes/${id}`);
      setSelectedNote(data.note);
    } catch {
      setSelectedNote(null);
    } finally {
      setOpeningNote(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data } = await api.post("/notes", { title: "Catatan Baru" });
      setNotes((prev) => [
        {
          id: data.note.id,
          title: data.note.title,
          pinned: false,
          snippet: "",
          createdAt: data.note.createdAt,
          updatedAt: data.note.updatedAt,
        },
        ...(prev || []),
      ]);
      setSelectedId(data.note.id);
      setSelectedNote(data.note);
    } catch {
      setError("Gagal membuat catatan baru.");
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePin = async (e, note) => {
    e.stopPropagation();
    const newPinned = !note.pinned;
    setPinningId(note.id);
    // Optimistic update - tidak perlu full-page loading untuk aksi kecil ini.
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, pinned: newPinned } : n)),
    );
    try {
      await api.patch(`/notes/${note.id}`, { pinned: newPinned });
    } catch {
      // rollback
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, pinned: !newPinned } : n)),
      );
      setError("Gagal mengubah status pin.");
    } finally {
      setPinningId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus catatan ini? Tindakan ini tidak bisa dibatalkan.")) return;
    const prevNotes = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setSelectedNote(null);
    }
    try {
      await api.delete(`/notes/${id}`);
    } catch {
      setNotes(prevNotes);
      setError("Gagal menghapus catatan.");
    }
  };

  // Saat autosave berhasil, sinkronkan list secara lokal (tanpa refetch).
  const handleSaved = (updatedNote) => {
    setNotes((prev) => {
      if (!prev) return prev;
      const next = prev.map((n) =>
        n.id === updatedNote.id
          ? {
              ...n,
              title: updatedNote.title,
              updatedAt: updatedNote.updatedAt,
              snippet: updatedNote.content
                ? quickSnippet(JSON.parse(updatedNote.content))
                : n.snippet,
            }
          : n,
      );
      // Urutkan ulang: pinned dulu, lalu terbaru diupdate.
      return [...next].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    });
  };

  const { pinned, others } = useMemo(() => {
    const list = notes || [];
    return {
      pinned: list.filter((n) => n.pinned),
      others: list.filter((n) => !n.pinned),
    };
  }, [notes]);

  if (error && notes === null) {
    return (
      <Layout>
        <div style={styles.page}>{error}</div>
      </Layout>
    );
  }

  if (notes === null) return <PageLoader message="Memuat catatan..." />;

  const renderNoteItem = (note) => {
    const active = note.id === selectedId;
    return (
      <div
        key={note.id}
        style={styles.noteItem(active)}
        onClick={() => openNote(note.id)}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.noteItemTitleRow}>
            <p style={styles.noteTitle(active)}>
              {note.pinned ? "📌 " : ""}
              {note.title || "Tanpa judul"}
            </p>
          </div>
          <p style={styles.noteDate}>{formatShortDate(note.updatedAt)}</p>
          {note.snippet && <p style={styles.noteSnippet}>{note.snippet}</p>}
        </div>
        <button
          style={styles.pinBtn(note.pinned)}
          onClick={(e) => handleTogglePin(e, note)}
          disabled={pinningId === note.id}
          title={note.pinned ? "Unpin" : "Pin"}
        >
          📌
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>Catatan</h1>
            <p style={styles.pageSubtitle}>
              Simpan catatan, ide, dan persiapan seputar pencarian kerjamu.
            </p>
          </div>
          <button
            style={styles.newNoteBtn}
            onClick={handleCreate}
            disabled={creating}
          >
            + {creating ? "Membuat..." : "Catatan Baru"}
          </button>
        </div>

        <div style={styles.columns}>
          <div style={styles.leftCol}>
            <NotesCalendar />

            <div style={styles.listCard}>
              {notes.length === 0 ? (
                <div style={styles.emptyList}>
                  Belum ada catatan. Buat catatan pertamamu!
                </div>
              ) : (
                <>
                  {pinned.length > 0 && (
                    <>
                      <div style={styles.sectionLabel}>PINNED</div>
                      {pinned.map(renderNoteItem)}
                    </>
                  )}
                  <div style={styles.sectionLabel}>ALL NOTES</div>
                  {others.length === 0 && pinned.length > 0 ? (
                    <div style={{ ...styles.emptyList, padding: "10px 12px" }}>
                      Tidak ada catatan lain.
                    </div>
                  ) : (
                    others.map(renderNoteItem)
                  )}
                </>
              )}
            </div>
          </div>

          <div style={styles.rightCol}>
            {openingNote ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e9edec",
                  minHeight: "70vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: 13,
                }}
              >
                Memuat catatan...
              </div>
            ) : (
              <NoteEditor
                note={selectedNote}
                onSaved={handleSaved}
                onDeleted={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notes;
