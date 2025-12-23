/**
 * Thread Craft Splitter Engine
 *
 * Splits a long string into chunks of maximum 280 characters,
 * respecting word/line boundaries, preserving formatting where possible,
 * and appending "n/total" suffixes for Twitter threads.
 */
export function splitText(text: string, limit: number = 280): string[] {
  // Early exit for empty or whitespace-only strings
  if (!text || !text.trim()) return [];
  // Buffer for " (999/999)" suffix (up to 10 chars)
  // We ensure limit is at least 20 to prevent logical crashes with tiny limits
  const safeLimit = Math.max(limit, 20);
  const reservedSpace = 10;
  const effectiveLimit = safeLimit - reservedSpace;
  // Split by whitespace but capture the whitespace to preserve formatting
  // We normalize line endings to \n first for consistency
  const normalizedText = text.replace(/\r\n/g, "\n");
  const segments = normalizedText.split(/(\s+)/);
  const chunks: string[] = [];
  let currentChunk = "";
  for (const segment of segments) {
    if (segment === "") continue;
    // Handle extremely long segments (e.g., long URLs or words with no whitespace)
    if (segment.length > effectiveLimit) {
      // If we have an existing chunk, push it first
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
    // Check if adding the next segment exceeds the limit
    if ((currentChunk + segment).length <= effectiveLimit) {
      currentChunk += segment;
    } else {
      // Push the current chunk if it has content
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      // Start new chunk with the current segment (trimmed if it was leading whitespace)
      currentChunk = segment.trim() ? segment : "";
    }
  }
  // Push final chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  const total = chunks.length;
  if (total === 0) return [];
  // Final pass: Apply numbering suffix
  return chunks.map((chunk, index) => {
    const suffix = ` ${index + 1}/${total}`;
    return chunk + suffix;
  });
}