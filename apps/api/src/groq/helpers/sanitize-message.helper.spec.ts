import { sanitizeMessageForAiSdk } from './sanitize-message.helper';

describe('sanitizeMessageForAiSdk', () => {
  describe('empty / invalid input', () => {
    it('returns a safe default when called with null-like input', () => {
      const result = sanitizeMessageForAiSdk(
        null as unknown as Record<string, unknown>,
      );
      expect(result).toEqual({ role: 'user', content: '' });
    });

    it('returns a safe default when called with an empty object', () => {
      const result = sanitizeMessageForAiSdk({});
      expect((result as Record<string, unknown>).content).toBe('');
    });
  });

  describe('malformed role', () => {
    it('preserves an unrecognised role string without throwing', () => {
      const msg = { role: 'unknown_role', content: 'hello' };
      const result = sanitizeMessageForAiSdk(msg) as Record<string, unknown>;
      expect(result.role).toBe('unknown_role');
      expect(result.content).toBe('hello');
    });

    it('falls back to "user" when role is missing', () => {
      const msg = { content: 'text without role' };
      const result = sanitizeMessageForAiSdk(msg) as Record<string, unknown>;
      expect(result.role).toBe('user');
    });
  });

  describe('array content (multi-part messages)', () => {
    it('strips null providerOptions from content parts', () => {
      const msg = {
        role: 'assistant',
        content: [{ type: 'text', text: 'hi', providerOptions: null }],
      };
      const result = sanitizeMessageForAiSdk(msg) as Record<string, unknown>;
      const parts = result.content as Record<string, unknown>[];
      expect('providerOptions' in parts[0]).toBe(false);
    });

    it('normalises tool-result parts: sets result and removes null output', () => {
      const msg = {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: 'abc',
            toolName: 'search',
            output: null,
            result: undefined,
          },
        ],
      };
      const result = sanitizeMessageForAiSdk(msg) as Record<string, unknown>;
      const part = (result.content as Record<string, unknown>[])[0];
      expect(part.result).toEqual({});
      expect('output' in part).toBe(false);
    });

    it('normalises tool-call parts: sets args and removes null input/providerExecuted', () => {
      const msg = {
        role: 'assistant',
        content: [
          {
            type: 'tool-call',
            toolCallId: 'xyz',
            toolName: 'lookup',
            input: null,
            args: null,
            providerExecuted: null,
          },
        ],
      };
      const result = sanitizeMessageForAiSdk(msg) as Record<string, unknown>;
      const part = (result.content as Record<string, unknown>[])[0];
      expect(part.args).toEqual({});
      expect('input' in part).toBe(false);
      expect('providerExecuted' in part).toBe(false);
    });

    it('does NOT mutate the original input object', () => {
      const original = {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: 'abc',
            toolName: 'test',
            output: null,
            result: undefined,
          },
        ],
      };
      const copy = JSON.parse(JSON.stringify(original));
      sanitizeMessageForAiSdk(original);
      expect(original).toEqual(copy);
    });
  });

  describe('valid / passthrough input', () => {
    it('returns a string-content message unchanged', () => {
      const msg = { role: 'user', content: 'Hello, AI!' };
      const result = sanitizeMessageForAiSdk(msg) as Record<string, unknown>;
      expect(result.role).toBe('user');
      expect(result.content).toBe('Hello, AI!');
    });

    it('normalises top-level toolCalls array', () => {
      const msg = {
        role: 'assistant',
        content: '',
        toolCalls: [
          { toolCallId: 'tc1', toolName: 'fn', input: { q: 1 }, args: null },
        ],
      };
      const result = sanitizeMessageForAiSdk(msg) as Record<string, unknown>;
      const tc = (result.toolCalls as Record<string, unknown>[])[0];
      expect(tc.args).toEqual({ q: 1 });
    });
  });
});
