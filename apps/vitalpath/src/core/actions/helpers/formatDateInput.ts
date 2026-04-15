export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);

  let result = '';
  if (digits.length <= 2) {
    result = digits;
  } else if (digits.length <= 4) {
    result = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } else {
    result = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }
  return result;
}
