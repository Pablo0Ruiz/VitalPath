import { nextMonday } from './date.helpers';

describe('nextMonday', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('Sunday → immediately following Monday', () => {
    // 2026-05-10 is a Sunday
    jest.useFakeTimers({ now: new Date('2026-05-10T15:00:00.000Z') });
    const result = nextMonday();
    expect(result.toISOString()).toBe('2026-05-11T00:00:00.000Z');
  });

  it('Monday 09:00 UTC → +7 days (following Monday)', () => {
    // 2026-05-11 is a Monday
    const from = new Date('2026-05-11T09:00:00.000Z');
    const result = nextMonday(from);
    expect(result.toISOString()).toBe('2026-05-18T00:00:00.000Z');
  });

  it('Monday exactly at 00:00:00.000 UTC → +7 days (not same day)', () => {
    const from = new Date('2026-05-11T00:00:00.000Z');
    const result = nextMonday(from);
    expect(result.toISOString()).toBe('2026-05-18T00:00:00.000Z');
  });

  it('Saturday → +2 days (Monday)', () => {
    // 2026-05-09 is a Saturday
    const from = new Date('2026-05-09T20:00:00.000Z');
    const result = nextMonday(from);
    expect(result.toISOString()).toBe('2026-05-11T00:00:00.000Z');
  });

  it('Tuesday crossing month boundary (Jan 28 → Feb 2)', () => {
    // 2025-01-28 is a Tuesday
    const from = new Date('2025-01-28T12:00:00.000Z');
    const result = nextMonday(from);
    expect(result.toISOString()).toBe('2025-02-03T00:00:00.000Z');
  });

  it('Monday Dec 29 2025 → Monday Jan 5 2026 (year + month boundary)', () => {
    // Dec 29 2025 is a Monday; nextMonday must skip to the following Monday in January
    const from = new Date('2025-12-29T00:00:00.000Z');
    const result = nextMonday(from);
    expect(result.toISOString()).toBe('2026-01-05T00:00:00.000Z');
  });
});
