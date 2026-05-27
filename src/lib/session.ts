const KEY = "sk_session_id";
const COUNT_KEY = "sk_checks_count";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function getChecksCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(COUNT_KEY) ?? "0", 10) || 0;
}

export function incrementChecksCount(): number {
  const n = getChecksCount() + 1;
  if (typeof window !== "undefined") localStorage.setItem(COUNT_KEY, String(n));
  return n;
}
