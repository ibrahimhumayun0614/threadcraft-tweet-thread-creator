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
 * Designed to work in secure contexts, restricted preview environments, and legacy browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Modern Clipboard API (Requires HTTPS/Localhost and user gesture)
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("Navigator clipboard API failed, attempting fallback...", err);
  }
  // 2. Fallback: document.execCommand('copy') via temporary textarea
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Ensure the textarea is off-screen but visible enough to be selectable
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    console.warn("document.execCommand fallback failed", err);
  }
  // 3. Final Fallback: Manual Prompt
  // This is useful in heavily restricted iframe environments where clipboard access is blocked
  try {
    const result = window.prompt("Your browser blocked automatic copying. Copy the text below manually (Ctrl+C / Cmd+C):", text);
    return result !== null;
  } catch (err) {
    console.error("All clipboard fallbacks failed", err);
    return false;
  }
}