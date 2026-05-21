export function formatLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseLocalDateTime(fecha: string, hora: string): number | null {
  const ms = new Date(`${fecha}T${hora}`).getTime();
  return Number.isNaN(ms) ? null : ms;
}
