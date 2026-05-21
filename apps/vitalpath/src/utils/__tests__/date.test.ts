import { parseLocalDateTime } from '../date';

describe('parseLocalDateTime', () => {
  it('returns a Date instance', () => {
    const result = parseLocalDateTime('2025-01-15', '10:30');
    expect(result).toBeInstanceOf(Date);
  });

  it('sets the correct local year', () => {
    const result = parseLocalDateTime('2025-01-15', '10:30');
    expect(result.getFullYear()).toBe(2025);
  });

  it('sets the correct local month (0-indexed: January = 0)', () => {
    const result = parseLocalDateTime('2025-01-15', '10:30');
    expect(result.getMonth()).toBe(0);
  });

  it('sets the correct local day', () => {
    const result = parseLocalDateTime('2025-01-15', '10:30');
    expect(result.getDate()).toBe(15);
  });

  it('sets the correct local hours', () => {
    const result = parseLocalDateTime('2025-01-15', '10:30');
    expect(result.getHours()).toBe(10);
  });

  it('sets the correct local minutes', () => {
    const result = parseLocalDateTime('2025-01-15', '10:30');
    expect(result.getMinutes()).toBe(30);
  });

  it('handles midnight correctly (00:00)', () => {
    const result = parseLocalDateTime('2025-12-31', '00:00');
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getDate()).toBe(31);
    expect(result.getMonth()).toBe(11);
  });

  it('handles end-of-day time (23:59)', () => {
    const result = parseLocalDateTime('2025-06-15', '23:59');
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
  });

  it('does not produce NaN', () => {
    const result = parseLocalDateTime('2025-01-15', '10:30');
    expect(isNaN(result.getTime())).toBe(false);
  });
});
