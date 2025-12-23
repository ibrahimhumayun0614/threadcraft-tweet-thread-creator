/**
 * Splits a long string into chunks of maximum 280 characters,
 * respecting word/line boundaries, preserving single newlines,
 * and appending "n/total" suffixes.
 */
export function splitText(text: string, limit: number = 280): string[] {
  if (!text.trim()) return [];
  // Buffer for " (99/99)" suffix
  const reservedSpace = 10;
  const effectiveLimit = limit - reservedSpace;
  // Split by whitespace but keep the whitespace characters (including newlines)
  // This allows us to reconstruct the text with original formatting.
  const segments = text.split(/(\s+)/);
  const chunks: string[] = [];
  let currentChunk = "";
  for (const segment of segments) {
    if (!segment) continue;
    // Handle extremely long segments (e.g., long URLs or words)
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
      // Push the current chunk (trimmed to avoid trailing whitespace issues)
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      // Start new chunk. If the segment is just whitespace, skip starting a chunk with it.
      currentChunk = segment.trim() ? segment : "";
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  // Final pass: Apply numbering suffix to each chunk (e.g., " 1/5")
  const total = chunks.length;
  return chunks.map((chunk, index) => {
    const suffix = ` ${index + 1}/${total}`;
    return chunk + suffix;
  });
}