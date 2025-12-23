/**
 * Thread Craft Splitter Engine v1.1 (Production)
 *
 * Professional tool for crafting long strings into perfectly formatted
 * Twitter threads. Respects word/line boundaries, preserves formatting,
 * and handles thread indexing (n/total) automatically with high safety margins.
 */
export function splitText(text: string, limit: number = 280): string[] {
  if (!text || !text.trim()) return [];
  // Buffer for " (999/999)" suffix safety.
  // We reserve 14 characters for the suffix to be extremely safe (e.g., " 100/100").
  const safeLimit = Math.max(limit, 30);
  const reservedSpace = 14; 
  const effectiveLimit = safeLimit - reservedSpace;
  // Normalize line endings and segment text while preserving whitespace
  const normalizedText = text.replace(/\r\n/g, "\n");
  const segments = normalizedText.split(/(\s+)/);
  const chunks: string[] = [];
  let currentChunk = "";
  for (const segment of segments) {
    if (segment === "") continue;
    // Handle extremely long segments (e.g., long URLs or continuous strings)
    if (segment.length > effectiveLimit) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      let remaining = segment;
      while (remaining.length > effectiveLimit) {
        chunks.push(remaining.substring(0, effectiveLimit));
        remaining = remaining.substring(effectiveLimit);
      }
      currentChunk = remaining;
      continue;
    }
    // Accumulate segments until the limit is reached
    if ((currentChunk + segment).length <= effectiveLimit) {
      currentChunk += segment;
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      // Trim leading spaces only if they are not intentional structural newlines
      currentChunk = segment.trim() ? segment : (segment.includes('\n') ? segment : "");
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  const total = chunks.length;
  if (total === 0) return [];
  return chunks.map((chunk, index) => {
    const suffix = ` ${index + 1}/${total}`;
    return chunk + suffix;
  });
}