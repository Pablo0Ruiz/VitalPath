import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock ./client before importing refresh so getTokenAdapter is injectable
vi.mock('./client', () => ({
  apiClient: {
    post: vi.fn(),
  },
  getTokenAdapter: vi.fn(),
}));

import { refreshTokens, SessionExpiredError } from './refresh';
import { apiClient, getTokenAdapter } from './client';

const mockPost = vi.mocked(apiClient.post);
const mockGetAdapter = vi.mocked(getTokenAdapter);

// ─── Helpers ────────────────────────────────────────────────────────────────

type AdapterOverrides = {
  getToken?: ReturnType<typeof vi.fn>;
  setToken?: ReturnType<typeof vi.fn>;
  getRefreshToken?: ReturnType<typeof vi.fn>;
  setRefreshToken?: ReturnType<typeof vi.fn>;
  deleteToken?: ReturnType<typeof vi.fn>;
  deleteRefreshToken?: ReturnType<typeof vi.fn>;
  navigate?: ReturnType<typeof vi.fn>;
};

function makeAdapter(overrides?: AdapterOverrides) {
  return {
    getToken: vi.fn().mockResolvedValue('access-tok'),
    setToken: vi.fn().mockResolvedValue(undefined),
    getRefreshToken: vi.fn().mockResolvedValue('refresh-tok'),
    setRefreshToken: vi.fn().mockResolvedValue(undefined),
    deleteToken: vi.fn().mockResolvedValue(undefined),
    deleteRefreshToken: vi.fn().mockResolvedValue(undefined),
    navigate: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── SessionExpiredError ─────────────────────────────────────────────────────

describe('SessionExpiredError', () => {
  it('has name "SessionExpiredError"', () => {
    const err = new SessionExpiredError();
    expect(err.name).toBe('SessionExpiredError');
  });

  it('is an instance of Error', () => {
    expect(new SessionExpiredError()).toBeInstanceOf(Error);
  });

  it('uses the default message when none is provided', () => {
    const err = new SessionExpiredError();
    expect(err.message).toBe('Session expired');
  });

  it('accepts a custom message', () => {
    const err = new SessionExpiredError('Custom message');
    expect(err.message).toBe('Custom message');
  });
});

// ─── refreshTokens ───────────────────────────────────────────────────────────

describe('refreshTokens', () => {
  it('throws SessionExpiredError when no adapter is registered', async () => {
    mockGetAdapter.mockReturnValue(null);

    await expect(refreshTokens()).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it('throws SessionExpiredError when adapter has no refresh token', async () => {
    const adapter = makeAdapter({
      getRefreshToken: vi.fn().mockResolvedValue(null),
    });
    mockGetAdapter.mockReturnValue(adapter);

    await expect(refreshTokens()).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it('POSTs to /api/auth/refresh-mobile with the refresh token', async () => {
    const adapter = makeAdapter();
    mockGetAdapter.mockReturnValue(adapter);
    mockPost.mockResolvedValue({
      data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
    });

    await refreshTokens();

    expect(mockPost).toHaveBeenCalledWith('/api/auth/refresh-mobile', {
      refreshToken: 'refresh-tok',
    });
  });

  it('writes both new tokens via the adapter and returns the access token', async () => {
    const adapter = makeAdapter();
    mockGetAdapter.mockReturnValue(adapter);
    mockPost.mockResolvedValue({
      data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
    });

    const result = await refreshTokens();

    expect(adapter.setToken).toHaveBeenCalledWith('new-access');
    expect(adapter.setRefreshToken).toHaveBeenCalledWith('new-refresh');
    expect(result).toBe('new-access');
  });

  it('throws when the server POST rejects', async () => {
    const adapter = makeAdapter();
    mockGetAdapter.mockReturnValue(adapter);
    mockPost.mockRejectedValue(new Error('network error'));

    await expect(refreshTokens()).rejects.toThrow('network error');
  });
});
