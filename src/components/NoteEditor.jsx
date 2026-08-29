import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import api from "../api/axios.js";

const GREEN = "#15803d";
const GREEN_BG = "#f0fdf4";

const AUTOSAVE_DELAY = 900; // ms - hindari request ke server di setiap ketikan

const styles = {
  wrapper: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e9edec",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "70vh",
  },
  header: {
    padding: "16px 20px 12px",
    borderBottom: "1px solid #f1f5f4",
  },
  titleInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    padding: 0,
    marginBottom: 6,
    fontFamily: "inherit",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  metaText: { fontSize: 12, color: "#94a3b8" },
  statusBadge: (variant) => {
    const map = {
      saving: { bg: "#fff7ed", text: "#d97706", label: "Saving..." },
      saved: { bg: GREEN_BG, text: GREEN, label: "Saved" },
      failed: { bg: "#fef2f2", text: "#dc2626", label: "Failed to save" },
      idle: { bg: "#f1f5f4", text: "#94a3b8", label: "" },
    };
    const c = map[variant] || map.idle;
    return {
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 999,
      background: c.bg,
      color: c.text,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
    };
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: "8px 14px",
    borderBottom: "1px solid #f1f5f4",
    flexWrap: "wrap",
  },
  toolBtn: (active) => ({
    width: 30,
    height: 30,
    borderRadius: 7,
    border: "none",
    background: active ? GREEN_BG : "transparent",
    color: active ? GREEN : "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
  }),
  divider: {
    width: 1,
    height: 20,
    background: "#e9edec",
    margin: "0 6px",
  },
  exportWrap: { position: "relative" },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#0f172a",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  exportMenu: {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    minWidth: 160,
    overflow: "hidden",
    zIndex: 20,
  },
  exportMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "10px 14px",
    border: "none",
    background: "#fff",
    color: "#0f172a",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
  },
  editorBody: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px 40px",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: 14,
    flexDirection: "column",
    gap: 8,
  },
};

const ToolIcon = ({ children }) => (
  <span style={{ display: "inline-flex" }}>{children}</span>
);

const NoteEditor = ({ note, onSaved, onDeleted }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | failed
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(null); // 'pdf' | 'docx' | null

  const saveTimerRef = useRef(null);
  const noteIdRef = useRef(note?.id);
  const skipNextChangeRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Mulai menulis catatan..." }),
    ],
    content: (() => {
      if (!note?.content) return "";
      try {
        return JSON.parse(note.content);
      } catch {
        return "";
      }
    })(),
    onUpdate: () => {
      if (skipNextChangeRef.current) {
        skipNextChangeRef.current = false;
        return;
      }
      scheduleAutosave();
    },
  });

  // Saat berpindah catatan, muat ulang konten editor & reset status.
  useEffect(() => {
    if (!editor) return;
    noteIdRef.current = note?.id;
    setTitle(note?.title || "");
    setSaveStatus("idle");
    skipNextChangeRef.current = true;
    let parsed = "";
    if (note?.content) {
      try {
        parsed = JSON.parse(note.content);
      } catch {
        parsed = "";
      }
    }
    editor.commands.setContent(parsed || "", false);
    setShowExportMenu(false);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id, editor]);

  const persist = useCallback(
    async (payload) => {
      const targetId = noteIdRef.current;
      if (!targetId) return;
      setSaveStatus("saving");
      try {
        const { data } = await api.patch(`/notes/${targetId}`, payload);
        // Hanya terapkan hasil kalau user belum berpindah ke catatan lain.
        if (noteIdRef.current === targetId) {
          setSaveStatus("saved");
          onSaved?.(data.note);
        }
      } catch (err) {
        if (noteIdRef.current === targetId) {
          setSaveStatus("failed");
        }
      }
    },
    [onSaved],
  );

  const scheduleAutosave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (!editor) return;
      persist({
        title,
        content: JSON.stringify(editor.getJSON()),
      });
    }, AUTOSAVE_DELAY);
  }, [editor, persist, title]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    scheduleAutosave();
  };

  // Simpan segera saat pengguna meninggalkan field judul, tanpa menunggu debounce.
  const handleTitleBlur = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (!editor) return;
    persist({ title, content: JSON.stringify(editor.getJSON()) });
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL link:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleExport = async (format) => {
    if (!editor) return;
    setExporting(format);
    setShowExportMenu(false);
    try {
      const docJson = editor.getJSON();
      if (format === "pdf") {
        const { exportNoteAsPdf } = await import("../utils/exportNotePdf.js");
        exportNoteAsPdf(title, docJson);
      } else {
        const { exportNoteAsDocx } = await import("../utils/exportNoteDocx.js");
        await exportNoteAsDocx(title, docJson);
      }
    } finally {
      setExporting(null);
    }
  };

  if (!note) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.emptyState}>
          <span style={{ fontSize: 32 }}>📝</span>
          <p style={{ margin: 0 }}>Pilih catatan atau buat catatan baru</p>
        </div>
      </div>
    );
  }

  const lastUpdated = note?.updatedAt
    ? new Date(note.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
    : null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <input
          style={styles.titleInput}
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          placeholder="Judul catatan..."
        />
        <div style={styles.metaRow}>
          <span style={styles.metaText}>
            {lastUpdated ? `Diperbarui ${lastUpdated}` : "Belum pernah disimpan"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {saveStatus !== "idle" && (
              <span style={styles.statusBadge(saveStatus)}>
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Saved"}
                {saveStatus === "failed" && "Failed to save"}
              </span>
            )}
            <div style={styles.exportWrap}>
              <button
                style={styles.exportBtn}
                onClick={() => setShowExportMenu((s) => !s)}
                disabled={!!exporting}
              >
                {exporting ? "Mengekspor..." : "Export"} ▾
              </button>
              {showExportMenu && (
                <div style={styles.exportMenu}>
                  <button
                    style={styles.exportMenuItem}
                    onClick={() => handleExport("pdf")}
                  >
                    📄 PDF
                  </button>
                  <button
                    style={styles.exportMenuItem}
                    onClick={() => handleExport("docx")}
                  >
                    📃 Word (.docx)
                  </button>
                </div>
              )}
            </div>
            {onDeleted && (
              <button
                style={{
                  ...styles.exportBtn,
                  color: "#dc2626",
                  borderColor: "#fee2e2",
                }}
                onClick={() => onDeleted(note.id)}
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {editor && (
        <div style={styles.toolbar}>
          <button
            style={styles.toolBtn(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <ToolIcon>B</ToolIcon>
          </button>
          <button
            style={{ ...styles.toolBtn(editor.isActive("italic")), fontStyle: "italic" }}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <ToolIcon>I</ToolIcon>
          </button>
          <button
            style={{
              ...styles.toolBtn(editor.isActive("underline")),
              textDecoration: "underline",
            }}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <ToolIcon>U</ToolIcon>
          </button>

          <span style={styles.divider} />

          <button
            style={styles.toolBtn(editor.isActive("heading", { level: 1 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="Heading 1"
          >
            H1
          </button>
          <button
            style={styles.toolBtn(editor.isActive("heading", { level: 2 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="Heading 2"
          >
            H2
          </button>
          <button
            style={styles.toolBtn(editor.isActive("heading", { level: 3 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            title="Heading 3"
          >
            H3
          </button>

          <span style={styles.divider} />

          <button
            style={styles.toolBtn(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            •≡
          </button>
          <button
            style={styles.toolBtn(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            1≡
          </button>

          <span style={styles.divider} />

          <button
            style={styles.toolBtn(editor.isActive({ textAlign: "left" }))}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align left"
          >
            ⯇≡
          </button>
          <button
            style={styles.toolBtn(editor.isActive({ textAlign: "center" }))}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align center"
          >
            ≡
          </button>
          <button
            style={styles.toolBtn(editor.isActive({ textAlign: "right" }))}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align right"
          >
            ≡⯈
          </button>

          <span style={styles.divider} />

          <button
            style={styles.toolBtn(editor.isActive("link"))}
            onClick={setLink}
            title="Link"
          >
            🔗
          </button>

          <span style={styles.divider} />

          <button
            style={styles.toolBtn(false)}
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            ↺
          </button>
          <button
            style={styles.toolBtn(false)}
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            ↻
          </button>
        </div>
      )}

      <div style={styles.editorBody} className="note-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NoteEditor;
