// Mengubah dokumen JSON dari Tiptap menjadi struktur "blocks" yang netral,
// supaya bisa dipakai ulang oleh exporter PDF maupun Word (.docx) tanpa
// masing-masing harus mem-parsing struktur Tiptap sendiri-sendiri.
//
// Block yang didukung: heading, paragraph, bulletList, orderedList.
// Tiap block berisi "runs" (untuk heading/paragraph) atau "items" (list),
// di mana tiap run = { text, bold, italic, underline, link }.

const runsFromInline = (content = []) => {
  const runs = [];
  for (const node of content) {
    if (node.type !== "text" || !node.text) continue;
    const marks = node.marks || [];
    const run = {
      text: node.text,
      bold: marks.some((m) => m.type === "bold"),
      italic: marks.some((m) => m.type === "italic"),
      underline: marks.some((m) => m.type === "underline"),
      link: marks.find((m) => m.type === "link")?.attrs?.href || null,
    };
    runs.push(run);
  }
  return runs;
};

const listItemParagraphs = (listItemContent = []) => {
  // Satu list item bisa berisi 1+ paragraph; gabungkan jadi 1 baris runs.
  const runs = [];
  for (const child of listItemContent) {
    if (child.type === "paragraph") {
      runs.push(...runsFromInline(child.content || []));
    }
  }
  return runs;
};

export const tiptapJsonToBlocks = (doc) => {
  if (!doc || !Array.isArray(doc.content)) return [];

  const blocks = [];

  for (const node of doc.content) {
    switch (node.type) {
      case "heading":
        blocks.push({
          type: "heading",
          level: node.attrs?.level || 2,
          align: node.attrs?.textAlign || "left",
          runs: runsFromInline(node.content || []),
        });
        break;
      case "paragraph":
        blocks.push({
          type: "paragraph",
          align: node.attrs?.textAlign || "left",
          runs: runsFromInline(node.content || []),
        });
        break;
      case "bulletList":
        blocks.push({
          type: "bulletList",
          items: (node.content || [])
            .filter((li) => li.type === "listItem")
            .map((li) => listItemParagraphs(li.content || [])),
        });
        break;
      case "orderedList":
        blocks.push({
          type: "orderedList",
          items: (node.content || [])
            .filter((li) => li.type === "listItem")
            .map((li) => listItemParagraphs(li.content || [])),
        });
        break;
      default:
        // Blok tak dikenal (mis. blockquote/codeBlock) - render sebagai
        // paragraph biasa dari teks-nya supaya tidak hilang total.
        if (Array.isArray(node.content)) {
          blocks.push({
            type: "paragraph",
            align: "left",
            runs: runsFromInline(
              node.content.flatMap((c) => c.content || c),
            ),
          });
        }
        break;
    }
  }

  return blocks;
};

// Nama file aman dari judul catatan.
export const safeFileName = (title) => {
  const clean = (title || "Catatan")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ");
  return clean.length > 0 ? clean : "Catatan";
};
