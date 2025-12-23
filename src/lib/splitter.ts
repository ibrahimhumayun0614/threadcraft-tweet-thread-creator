/**
 * Thread Craft Splitter Engine
 *
 * Professional tool for crafting long strings into perfectly formatted 
 * Twitter threads. Respects word/line boundaries, preserves formatting, 
 * and handles thread indexing (n/total) automatically.
 */
export function splitText(text: string, limit: number = 280): string[] {
  // Early exit for empty or whitespace-only strings
  if (!text || !text.trim()) return [];
  // Buffer for " (999/999)" suffix safety.
  // We reserve space for the suffix to ensure we never exceed the character limit.
  const safeLimit = Math.max(limit, 24);
  const reservedSpace = 12;
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
      // Flush existing buffer
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      // Split the long segment into manageable pieces
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
      // Commit current crafted chunk
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      // Start new chunk, trimming leading whitespace from next segment
      currentChunk = segment.trim() ? segment : "";
    }
  }
  // Finalize the last crafted chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  const total = chunks.length;
  if (total === 0) return [];
  // Post-processing pass: Apply branding-consistent numbering suffix
  return chunks.map((chunk, index) => {
    const suffix = ` ${index + 1}/${total}`;
    return chunk + suffix;
  });
}