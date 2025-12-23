/**
 * Thread Craft Splitter Engine v1.4 (Final Audit - X Branding)
 *
 * Professional tool for crafting long strings into perfectly formatted
 * X (Twitter) threads. Respects word/line boundaries, preserves formatting,
 * and handles thread indexing (n/total) automatically with high safety margins.
 */
export function splitText(text: string | null | undefined, limit: number = 280): string[] {
  // Handle null, undefined, or purely whitespace inputs gracefully
  if (!text || typeof text !== 'string' || !text.trim()) {
    return [];
  }
  // Buffer for " (999/999)" suffix safety.
  // We reserve 14 characters for the suffix to be extremely safe (e.g., " 100/100").
  const safeLimit = Math.max(limit, 30);
  const reservedSpace = 14;
  const effectiveLimit = safeLimit - reservedSpace;
  // Normalize line endings and segment text while preserving whitespace
  const normalizedText = text.replace(/\r\n/g, "\n");
  // Split by any whitespace but capture the separators to maintain structure
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
      const trimmed = currentChunk.trim();
      if (trimmed) {
        chunks.push(trimmed);
      }
      // If the current segment is just whitespace (like multiple newlines),
      // we only carry it over if it contains structural information (newlines)
      currentChunk = segment.trim() ? segment : (segment.includes('\n') ? segment : "");
    }
  }
  const finalTrimmed = currentChunk.trim();
  if (finalTrimmed) {
    chunks.push(finalTrimmed);
  }
  const total = chunks.length;
  if (total === 0) return [];
  // Logic Audit: If only one post, do not add "1/1" suffix as it is redundant for single posts.
  if (total === 1) {
    return [chunks[0]];
  }
  return chunks.map((chunk, index) => {
    const suffix = ` ${index + 1}/${total}`;
    // Final check: Ensure the chunk itself is trimmed before appending the suffix
    return chunk.trim() + suffix;
  });
}