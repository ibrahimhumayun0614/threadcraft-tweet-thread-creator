/**
 * Splits a long string into chunks of maximum 280 characters,
 * respecting word boundaries, normalizing whitespace, and appending numbering.
 */
export function splitText(text: string, limit: number = 280): string[] {
  if (!text.trim()) return [];
  // We reserve space for suffixes like " (99/99)" which is ~10 chars
  const reservedSpace = 10;
  const effectiveLimit = limit - reservedSpace;
  const paragraphs = text.split(/\n\n+/);
  const initialChunks: string[] = [];
  let currentChunk = "";
  for (const paragraph of paragraphs) {
    const words = paragraph.replace(/\s+/g, ' ').trim().split(' ');
    for (const word of words) {
      const nextLength = currentChunk ? currentChunk.length + 1 + word.length : word.length;
      if (nextLength <= effectiveLimit) {
        currentChunk = currentChunk ? `${currentChunk} ${word}` : word;
      } else {
        if (currentChunk) initialChunks.push(currentChunk);
        if (word.length > effectiveLimit) {
          let remainingWord = word;
          while (remainingWord.length > effectiveLimit) {
            initialChunks.push(remainingWord.substring(0, effectiveLimit));
            remainingWord = remainingWord.substring(effectiveLimit);
          }
          currentChunk = remainingWord;
        } else {
          currentChunk = word;
        }
      }
    }
  }
  if (currentChunk) {
    initialChunks.push(currentChunk);
  }
  // Apply numbering suffix to each chunk
  const total = initialChunks.length;
  return initialChunks.map((chunk, index) => {
    const suffix = ` ${index + 1}/${total}`;
    return chunk + suffix;
  });
}