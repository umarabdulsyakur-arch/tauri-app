/** Mengubah teks tag (dipisah koma/spasi) menjadi string JSON array. */
export function parseTags(input: string): string {
  const tags = input
    .split(/[\s,]+/)
    .map((t) => t.trim().replace(/^#/, ""))
    .filter(Boolean);
  const unique = Array.from(new Set(tags));
  return JSON.stringify(unique);
}

/** Mengembalikan array tag dari kolom tags (JSON string). */
export function readTags(json: string): string[] {
  try {
    const value = JSON.parse(json);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
