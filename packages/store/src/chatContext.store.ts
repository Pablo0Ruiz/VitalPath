import { create } from 'zustand';
import { Message } from '@repo/types';

export type ChatStreamFetcher = (
  prompt: string,
  attachments: any[],
  chatId: string,
  onUpdate: (text: string) => void,
) => Promise<void>;

export interface ChatContextState {
  geminiWriting: boolean;
  chatId: string;
  messages: Message[];
  addMessage: (
    prompt: string,
    attachments: any[],
    fetcher: ChatStreamFetcher,
  ) => Promise<void>;
  clearChat: () => void;
}

const createMessage = (
  text: string,
  sender: 'user' | 'gemini',
  attachments: any[] = [],
): Message => {
  if (attachments && attachments.length > 0) {
    return {
      id: crypto.randomUUID(),
      text: text,
      createdAt: new Date(),
      sender: sender,
      type: 'image',
      images: attachments.map(img => img.uri || img.url || img),
    };
  }
  return {
    id: crypto.randomUUID(),
    text: text,
    createdAt: new Date(),
    sender: sender,
    type: 'text',
  };
};

export const useChatContextStore = create<ChatContextState>()((set, get) => ({
  geminiWriting: false,
  chatId: crypto.randomUUID(),
  messages: [],

  addMessage: async (
    prompt: string,
    attachments: any[],
    fetcher: ChatStreamFetcher,
  ) => {
    const userMessage = createMessage(prompt, 'user', attachments);
    const geminiMessage = createMessage('Generando respuesta...', 'gemini');
    const chatId = get().chatId;

    set((state: ChatContextState) => ({
      geminiWriting: true,
      messages: [geminiMessage, userMessage, ...state.messages],
    }));

    try {
      await fetcher(prompt, attachments, chatId, (text: string) => {
        set((state: ChatContextState) => ({
          messages: state.messages.map((msg: Message) =>
            msg.id === geminiMessage.id ? { ...msg, text } : msg,
          ),
        }));
      });
    } catch (error) {
      set((state: ChatContextState) => ({
        messages: state.messages.map((msg: Message) =>
          msg.id === geminiMessage.id
            ? { ...msg, text: 'Error al obtener respuesta. Intenta de nuevo.' }
            : msg,
        ),
      }));
    } finally {
      set({ geminiWriting: false });
    }
  },

  clearChat: () => {
    set({ messages: [], chatId: crypto.randomUUID() });
  },
}));
