import type { ModelMessage } from 'ai';

export function sanitizeMessageForAiSdk(
  msg: Record<string, unknown>,
): ModelMessage {
  if (!msg || typeof msg !== 'object') {
    return { role: 'user', content: '' } as unknown as ModelMessage;
  }

  const role = (msg.role as string) ?? 'user';
  const sanitized: Record<string, unknown> = { role };

  if (Array.isArray(msg.content)) {
    sanitized.content = (msg.content as Record<string, unknown>[]).map(part => {
      const newPart = { ...part };

      if (newPart.providerOptions === null) delete newPart.providerOptions;

      if (newPart.type === 'tool-result') {
        newPart.result = newPart.result ?? newPart.output ?? {};
        if (newPart.output === null) delete newPart.output;
      }

      if (newPart.type === 'tool-call') {
        newPart.args = newPart.args ?? newPart.input ?? {};
        if (newPart.input === null) delete newPart.input;
        if (newPart.providerExecuted === null) delete newPart.providerExecuted;
        if (newPart.args === null) newPart.args = {};
      }

      return newPart;
    });
  } else {
    sanitized.content = msg.content || '';
  }

  if (msg.toolCalls && Array.isArray(msg.toolCalls)) {
    sanitized.toolCalls = (msg.toolCalls as Record<string, unknown>[]).map(
      tc => ({
        ...tc,
        args: tc.args ?? (tc.input as object) ?? {},
      }),
    );
  }

  return sanitized as unknown as ModelMessage;
}
