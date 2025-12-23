import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Robustly copies text to clipboard with fallbacks for restricted environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern Clipboard API
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("Navigator clipboard failed, trying fallback...", err);
  }
  // 2. Fallback to hidden textarea + document.execCommand
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Ensure it's not visible but part of the DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    console.warn("document.execCommand fallback failed", err);
  }
  // 3. Last resort: Prompt user to copy manually
  try {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
    return true;
  } catch (err) {
    console.error("All clipboard fallbacks failed", err);
    return false;
  }
}