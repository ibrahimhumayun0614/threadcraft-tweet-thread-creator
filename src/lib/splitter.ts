/**
 * Splits a long string into chunks of maximum 280 characters,
 * respecting word boundaries, normalizing whitespace, and appending numbering.
 */
export function splitText(text: string, limit: number = 280): string[] {
  if (!text.trim()) return [];
  // We reserve space for suffixes like " (99/99)" which is ~10 chars.
  // This allows for threads up to 9,999 tweets, which is more than enough.
  const reservedSpace = 10;
  const effectiveLimit = limit - reservedSpace;
  // Split by double newlines to preserve paragraph-like structures if they fit.
  const paragraphs = text.split(/\n\n+/);
  const initialChunks: string[] = [];
  let currentChunk = "";
  for (const paragraph of paragraphs) {
    // Normalize internal whitespace within the paragraph
    const words = paragraph.replace(/\s+/g, ' ').trim().split(' ');
    for (const word of words) {
      // If a single word is longer than the entire effective limit, we must break it.
      if (word.length > effectiveLimit) {
        // Push current accumulator if it exists
        if (currentChunk) {
          initialChunks.push(currentChunk);
          currentChunk = "";
        }
        let remainingWord = word;
        while (remainingWord.length > effectiveLimit) {
          initialChunks.push(remainingWord.substring(0, effectiveLimit));
          remainingWord = remainingWord.substring(effectiveLimit);
        }
        currentChunk = remainingWord;
        continue;
      }
      const nextLength = currentChunk ? currentChunk.length + 1 + word.length : word.length;
      if (nextLength <= effectiveLimit) {
        currentChunk = currentChunk ? `${currentChunk} ${word}` : word;
      } else {
        if (currentChunk) initialChunks.push(currentChunk);
        currentChunk = word;
      }
    }
  }
  if (currentChunk) {
    initialChunks.push(currentChunk);
  }
  // Final pass: Apply numbering suffix to each chunk (e.g., " 1/5")
  const total = initialChunks.length;
  return initialChunks.map((chunk, index) => {
    const suffix = ` ${index + 1}/${total}`;
    return chunk + suffix;
  });
}