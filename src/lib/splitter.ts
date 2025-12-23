/**
 * Splits a long string into chunks of maximum 280 characters,
 * respecting word boundaries and normalizing whitespace.
 */
export function splitText(text: string, limit: number = 280): string[] {
  if (!text.trim()) return [];
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";
  // Process by paragraphs first to preserve some structure
  for (const paragraph of paragraphs) {
    const words = paragraph.replace(/\s+/g, ' ').trim().split(' ');
    for (const word of words) {
      // If adding this word (plus a space) exceeds the limit
      const nextLength = currentChunk ? currentChunk.length + 1 + word.length : word.length;
      if (nextLength <= limit) {
        currentChunk = currentChunk ? `${currentChunk} ${word}` : word;
      } else {
        // Current chunk is full, push it and start new one
        if (currentChunk) chunks.push(currentChunk);
        // Handle case where a single word is longer than the limit
        if (word.length > limit) {
          let remainingWord = word;
          while (remainingWord.length > limit) {
            chunks.push(remainingWord.substring(0, limit));
            remainingWord = remainingWord.substring(limit);
          }
          currentChunk = remainingWord;
        } else {
          currentChunk = word;
        }
      }
    }
    // After a paragraph, we might want to start a new chunk or just keep going
    // For a threader, we usually just continue until the char limit is hit.
  }
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  return chunks;
}