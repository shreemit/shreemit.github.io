const revealProgress = new Map<HTMLElement, number>();

/** ScrollTrigger callbacks write reveal progress (0–1) per container. */
export function setImageRevealProgress(el: HTMLElement, t: number): void {
  revealProgress.set(el, t);
}

export function getImageRevealProgress(el: HTMLElement): number {
  return revealProgress.get(el) ?? 1;
}
