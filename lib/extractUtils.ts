export function isSafeUrl(url: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const h = url.hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]") return false;
  const ipv4 = h.match(/^(\d+)\.(\d+)\./);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    if (a === 10) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 169 && b === 254) return false;
  }
  return true;
}

export function inferFromTitle(title: string): { company: string | null; role: string | null } {
  if (!title) return { company: null, role: null };
  const atMatch = title.match(/^(.+?)\s+at\s+(.+?)(?:\s*[\|–\-].*)?$/i);
  if (atMatch) return { role: atMatch[1].trim(), company: atMatch[2].trim() };
  const sepMatch = title.match(/^(.+?)\s*[\|–\-]\s*(.+?)(?:\s*[\|–\-].*)?$/);
  if (sepMatch) return { role: sepMatch[1].trim(), company: sepMatch[2].trim() };
  return { company: null, role: title.trim() };
}
