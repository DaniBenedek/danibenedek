"use client";

// Wraps each word (or char) of a text node in a span for GSAP targeting.
// Usage: splitLines(el) -> returns array of line spans to animate.
export function splitWords(el: HTMLElement) {
  const text = el.textContent ?? "";
  el.innerHTML = text
    .split(" ")
    .map((w) => `<span class="split-word" style="display:inline-block;overflow:hidden;"><span style="display:inline-block;">${w}</span></span>`)
    .join(" ");
  return Array.from(el.querySelectorAll<HTMLElement>(".split-word > span"));
}