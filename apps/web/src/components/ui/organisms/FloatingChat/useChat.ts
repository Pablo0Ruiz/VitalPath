import { useState, useCallback } from 'react';
import { getCookie } from '@/lib/get-cookie';
import { ACCESS_TOKEN_KEY } from '@repo/api-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId] = useState(() => crypto.randomUUID());

  const addWelcomeMessage = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          content:
            '¡Hola! Soy tu asistente de VitalPath AI. ¿En qué puedo ayudarte hoy? Puedo ayudarte a gestionar tus citas, buscar médicos o centros de salud.',
        },
      ]);
      setIsLoading(false);
    }, 600);
  }, []);

  const sendMessage = useCallback(
    async (promptOverride?: string) => {
      const prompt = (promptOverride || input).trim();
      if (!prompt || isLoading) return;

      if (!promptOverride) setInput('');
      setMessages(prev => [...prev, { role: 'user', content: prompt }]);
      setIsLoading(true);

      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('chatId', chatId);

      const token = getCookie(ACCESS_TOKEN_KEY);

      try {
        const res = await fetch(`${API_URL}/api/gemini/chat-stream`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token ?? ''}` },
          body: formData,
        });

        if (!res.ok || !res.body) throw new Error('stream-error');

        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: '', streaming: true },
        ]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages(prev => {
            const next = [...prev];
            const lastIndex = next.length - 1;
            if (lastIndex >= 0 && next[lastIndex].role === 'assistant') {
              next[lastIndex] = {
                ...next[lastIndex],
                content: accumulated,
                streaming: true,
              };
            }
            return next;
          });
        }

        setMessages(prev => {
          const next = [...prev];
          const lastIndex = next.length - 1;
          if (lastIndex >= 0 && next[lastIndex].role === 'assistant') {
            next[lastIndex] = {
              ...next[lastIndex],
              content: accumulated,
              streaming: false,
            };
          }
          return next;
        });
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Hubo un error al conectar con el asistente. Intentá nuevamente.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, chatId],
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    addWelcomeMessage,
  };
};
