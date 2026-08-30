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

// Disamakan persis dengan icon plus di Applications.jsx (18px, strokeWidth 2.5, garis).
const PlusIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const AlertCircleIcon = ({ size = 28 }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const SpinnerIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#e2e8f0"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{
        transformOrigin: "center",
        animation: "spin 0.8s linear infinite",
      }}
    />
  </svg>
);

// Sama persis polanya dengan ConfirmDialog di Applications.jsx: ikon warning,
// title & message dinamis lewat props, tombol rata tengah lebar sama, dan
// loading state (spinner) saat proses konfirmasi berjalan.
const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  confirmStyle,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!visible) return null;
  return (
    <div
      style={styles.dialogOverlay}
      onClick={isLoading ? undefined : onCancel}
    >
      <div style={styles.dialogCard} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "#ef4444",
          }}
        >
          <AlertCircleIcon size={28} />
        </div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px",
          }}
        >
          {title || "Konfirmasi"}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            margin: "0 0 24px",
            lineHeight: 1.5,
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              color: "#475569",
              fontWeight: 600,
              fontSize: 14,
              cursor: isLoading ? "not-allowed" : "pointer",
              flex: 1,
              transition: "all 0.15s",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              background: confirmStyle?.background || "#ef4444",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: isLoading ? "not-allowed" : "pointer",
              flex: 1,
              transition: "all 0.15s",
              boxShadow:
                confirmStyle?.boxShadow || "0 2px 8px rgba(239,68,68,0.3)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <SpinnerIcon size={18} /> Menghapus...
              </span>
            ) : (
              confirmLabel || "Ya"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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
    fontSize: 14,
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
    overflowX: "hidden",
    boxSizing: "border-box",
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.06em",
    padding: "8px 8px 6px",
  },
  // width:"100%" + boxSizing memastikan item tidak pernah lebih lebar dari
  // listCard, jadi tombol pin di ujung kanan tidak pernah terdorong keluar.
  noteItem: (active) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 8px",
    borderRadius: 10,
    cursor: "pointer",
    background: active ? GREEN_BG : "transparent",
    marginBottom: 2,
    overflow: "hidden",
  }),
  noteTextCol: {
    flex: "1 1 auto",
    minWidth: 0,
    overflow: "hidden",
  },
  noteItemTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    minWidth: 0,
  },
  // display:"flex" dihapus dari <p> title — flex di elemen yang punya
  // overflow:hidden/whiteSpace:nowrap mencegah ellipsis bekerja dengan benar
  // dan bisa membuat lebar elemen melebihi container. Teksnya sekarang
  // dibungkus <span> terpisah yang benar-benar di-truncate.
  noteTitle: (active) => ({
    fontSize: 13,
    fontWeight: 700,
    color: active ? GREEN : "#0f172a",
    margin: 0,
    minWidth: 0,
    flex: "1 1 auto",
  }),
  noteTitleIcon: { flexShrink: 0, display: "inline-flex" },
  noteTitleText: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
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
    flex: "0 0 auto",
    flexShrink: 0,
  },
  // Global `button { padding: 8px 16px }` dari index.css ikut ke-apply ke
  // tombol ini karena inline style di bawah tidak pernah men-set `padding`.
  // Dengan box-sizing: border-box global, padding itu "memakan" width/height
  // 24px yang sudah kita paksa, jadi content-box jadi lebih kecil dari icon
  // 14x14 -> icon kepotong. Set padding:0 di sini supaya tidak mewarisi
  // style tombol global sama sekali.
  pinBtn: (pinned) => ({
    width: 24,
    height: 24,
    minWidth: 24,
    padding: 0,
    lineHeight: 1,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: pinned ? GREEN : "#94a3b8",
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
  dialogOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.5)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: 20,
    animation: "fadeIn 0.2s ease",
  },
  dialogCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "32px 28px 24px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
    textAlign: "center",
    animation: "scaleIn 0.25s ease",
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

const Notes = () => {
  const [notes, setNotes] = useState(null); // null = belum dimuat
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openingNote, setOpeningNote] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pinningId, setPinningId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Eksekusi hapus yang sesungguhnya (dipanggil setelah user konfirmasi).
  // Optimistic update di list, rollback kalau API gagal.
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

  // Dipanggil dari tombol trash di NoteEditor (satu-satunya entry point hapus
  // sekarang, karena tombol trash di list sudah dihapus). Cari data note-nya
  // lalu tampilkan ConfirmDialog dulu sebelum benar-benar menghapus.
  const requestDelete = (id) => {
    const target =
      notes?.find((n) => n.id === id) ||
      (selectedNote?.id === id ? selectedNote : null);
    if (target) setDeleteTarget(target);
  };

  // Dipanggil dari tombol "Ya, Hapus" pada ConfirmDialog.
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await handleDelete(deleteTarget.id);
    setIsDeleting(false);
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

  // Export sesungguhnya berjalan client-side lewat utils yang sama dengan
  // yang tadinya dipakai di NoteEditor.jsx (bukan lewat backend endpoint).
  const handleExportWord = async () => {
    if (!selectedNote) return;
    setExportingWord(true);
    try {
      let docJson = {};
      try {
        docJson = selectedNote.content ? JSON.parse(selectedNote.content) : {};
      } catch {
        docJson = {};
      }
      const { exportNoteAsDocx } = await import("../utils/exportNoteDocx.js");
      await exportNoteAsDocx(selectedNote.title, docJson);
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
      let docJson = {};
      try {
        docJson = selectedNote.content ? JSON.parse(selectedNote.content) : {};
      } catch {
        docJson = {};
      }
      const { exportNoteAsPdf } = await import("../utils/exportNotePdf.js");
      exportNoteAsPdf(selectedNote.title, docJson);
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
        <div style={styles.noteTextCol}>
          <div style={styles.noteItemTitleRow}>
            <p style={styles.noteTitle(active)}>
              {note.pinned && (
                <span style={styles.noteTitleIcon}>
                  <PinIcon size={12} />
                </span>
              )}
              <span style={styles.noteTitleText}>
                {note.title || "Tanpa judul"}
              </span>
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
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
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
              <PlusIcon size={18} />{" "}
              {creating ? "Membuat..." : "Tambah Catatan"}
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
                onDeleted={requestDelete}
              />
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Hapus Catatan"
        message={`Apakah Anda yakin ingin menghapus catatan "${deleteTarget?.title || "Tanpa judul"}"?\n\nTindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        confirmStyle={{
          background: "#ef4444",
          boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
        }}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default Notes;