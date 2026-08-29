import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import PageLoader from "../components/PageLoader.jsx";
import NotesCalendar from "../components/NotesCalendar.jsx";
import NoteEditor from "../components/NoteEditor.jsx";

const GREEN = "#15803d";
const GREEN_BG = "#f0fdf4";

const PinIcon = ({ size = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 17v5" />
    <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
  </svg>
);

const WordIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#2b579a" />
    <path
      d="M6 7.5h1.7l1.15 6.3 1.35-6.3h1.6l1.35 6.3 1.15-6.3H16l-2 9h-1.75L11 10.6 9.75 16.5H8l-2-9z"
      fill="#fff"
    />
  </svg>
);

const PdfIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#dc2626" />
    <text
      x="12"
      y="15.5"
      fontSize="7.5"
      fontWeight="700"
      fill="#fff"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
    >
      PDF
    </text>
  </svg>
);

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
  headerActions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  exportBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
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
    display: "flex",
    alignItems: "center",
    gap: 4,
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
  noteItemActions: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flexShrink: 0,
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
  }),
  emptyList: {
    padding: "24px 12px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12.5,
  },
  rightCol: { minHeight: "70vh" },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  modalBox: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    width: 340,
    maxWidth: "90vw",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 8px",
  },
  modalText: {
    fontSize: 12.5,
    color: "#64748b",
    margin: "0 0 18px",
    lineHeight: 1.5,
  },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 8 },
  modalCancelBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    fontWeight: 600,
    fontSize: 12.5,
    cursor: "pointer",
  },
  modalConfirmBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontWeight: 600,
    fontSize: 12.5,
    cursor: "pointer",
  },
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
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const Notes = () => {
  const [notes, setNotes] = useState(null); // null = belum dimuat
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openingNote, setOpeningNote] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pinningId, setPinningId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [exportingWord, setExportingWord] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

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

  const confirmDelete = () => {
    if (!deleteTarget) return;
    handleDelete(deleteTarget.id);
    setDeleteTarget(null);
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

  const handleExportWord = async () => {
    if (!selectedNote) return;
    setExportingWord(true);
    try {
      const { data } = await api.get(`/notes/${selectedNote.id}/export`, {
        params: { format: "docx" },
        responseType: "blob",
      });
      downloadBlob(data, `${selectedNote.title || "catatan"}.docx`);
    } catch {
      setError("Gagal mengekspor catatan ke Word.");
    } finally {
      setExportingWord(false);
    }
  };

  const handleExportPdf = async () => {
    if (!selectedNote) return;
    setExportingPdf(true);
    try {
      const { data } = await api.get(`/notes/${selectedNote.id}/export`, {
        params: { format: "pdf" },
        responseType: "blob",
      });
      downloadBlob(data, `${selectedNote.title || "catatan"}.pdf`);
    } catch {
      setError("Gagal mengekspor catatan ke PDF.");
    } finally {
      setExportingPdf(false);
    }
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
              {note.pinned && <PinIcon size={12} />}
              {note.title || "Tanpa judul"}
            </p>
          </div>
          <p style={styles.noteDate}>{formatShortDate(note.updatedAt)}</p>
          {note.snippet && <p style={styles.noteSnippet}>{note.snippet}</p>}
        </div>
        <div style={styles.noteItemActions}>
          <button
            style={styles.pinBtn(note.pinned)}
            onClick={(e) => handleTogglePin(e, note)}
            disabled={pinningId === note.id}
            title={note.pinned ? "Unpin" : "Pin"}
          >
            <PinIcon size={14} />
          </button>
          <button
            className="btn-action-delete"
            title="Hapus"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(note);
            }}
          >
            {Icons.trash}
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <style>{`
        .btn-action-delete { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 8px 10px; border-radius: 8px; transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; }
        .btn-action-delete:hover { color: #ef4444 !important; background: #fef2f2 !important; }
      `}</style>
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>Catatan</h1>
            <p style={styles.pageSubtitle}>
              Simpan catatan, ide, dan persiapan seputar pencarian kerjamu.
            </p>
          </div>
          <div style={styles.headerActions}>
            <button
              style={styles.exportBtn}
              onClick={handleExportWord}
              disabled={!selectedNote || exportingWord}
              title="Export ke Word"
            >
              <WordIcon size={16} /> {exportingWord ? "Mengekspor..." : "Word"}
            </button>
            <button
              style={styles.exportBtn}
              onClick={handleExportPdf}
              disabled={!selectedNote || exportingPdf}
              title="Export ke PDF"
            >
              <PdfIcon size={16} /> {exportingPdf ? "Mengekspor..." : "PDF"}
            </button>
            <button
              style={styles.newNoteBtn}
              onClick={handleCreate}
              disabled={creating}
            >
              {Icons.plus} {creating ? "Membuat..." : "Tambah Catatan"}
            </button>
          </div>
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

      {deleteTarget && (
        <div style={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <p style={styles.modalTitle}>Hapus catatan?</p>
            <p style={styles.modalText}>
              "{deleteTarget.title || "Tanpa judul"}" akan dihapus secara
              permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancelBtn}
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button style={styles.modalConfirmBtn} onClick={confirmDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Notes;
