export const METRIKA_ID = 114183420

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void
  }
}

/** Отправляет цель в Яндекс.Метрику, если счётчик загружен */
export function reachGoal(goal: string) {
  if (typeof window === "undefined") return
  if (typeof window.ym === "function") {
    window.ym(METRIKA_ID, "reachGoal", goal)
  }
}