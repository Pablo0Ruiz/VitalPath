import { describe, it, expect, vi } from 'vitest';
import { handleApiError } from './error-handler';
import type { ApiError } from './error-handler';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeAxiosError(data: unknown, status = 400) {
  return { response: { status, data } };
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('handleApiError', () => {
  it('extracts message from Axios error with response.data.message', () => {
    const captured: ApiError[] = [];
    handleApiError(makeAxiosError({ message: 'Not found' }, 404), e =>
      captured.push(e),
    );

    expect(captured).toHaveLength(1);
    expect(captured[0].message).toBe('Not found');
    expect(captured[0].statusCode).toBe(404);
  });

  it('handles Axios error where response.data is a plain string', () => {
    const captured: ApiError[] = [];
    handleApiError(makeAxiosError('Bad request', 400), e => captured.push(e));

    expect(captured[0].message).toBe('Bad request');
    expect(captured[0].statusCode).toBe(400);
  });

  it('uses error.message for a plain Error instance', () => {
    const captured: ApiError[] = [];
    handleApiError(new Error('Something went wrong'), e => captured.push(e));

    expect(captured[0].message).toBe('Something went wrong');
    expect(captured[0].statusCode).toBeUndefined();
  });

  it('calls the onError callback when provided', () => {
    const onError = vi.fn();
    handleApiError(new Error('oops'), onError);

    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'oops' }),
    );
  });

  it('does not throw when onError is not provided', () => {
    expect(() => {
      handleApiError(new Error('no callback'));
    }).not.toThrow();
  });

  it('falls back to "Unexpected error" for unknown error shapes', () => {
    const captured: ApiError[] = [];
    handleApiError({ weird: true }, e => captured.push(e));

    expect(captured[0].message).toBe('Unexpected error');
  });

  it('falls back to "Unexpected error" for null', () => {
    const captured: ApiError[] = [];
    handleApiError(null, e => captured.push(e));

    expect(captured[0].message).toBe('Unexpected error');
  });
});
