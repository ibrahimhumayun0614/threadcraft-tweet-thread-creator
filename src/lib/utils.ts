import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
/**
 * Combines tailwind classes with proper merging.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Robustly copies text to clipboard with multiple fallbacks.
 * Handles "User Activation" requirements and secure context checks.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  // 1. Try Modern Clipboard API first (Requires HTTPS/Localhost and user gesture)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("Navigator clipboard API failed, attempting fallback...", err);
  }
  // 2. Fallback: document.execCommand('copy') via temporary textarea
  // This is still needed for many non-secure contexts or older browsers.
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Ensure it's not visible but part of the DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    textArea.setAttribute('readonly', ''); // Prevent keyboard from popping up on mobile
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    // Selection works slightly differently on iOS
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    }
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    console.warn("document.execCommand fallback failed", err);
  }
  // 3. Final Fallback: Manual Prompt if all else fails
  try {
    const result = window.prompt("Your browser blocked automatic copying. Copy the text below manually:", text);
    return result !== null;
  } catch (err) {
    console.error("All clipboard fallbacks failed", err);
    return false;
  }
}