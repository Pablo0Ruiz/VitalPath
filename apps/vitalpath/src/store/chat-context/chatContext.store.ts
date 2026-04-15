import uuid from 'react-native-uuid';
import { create } from 'zustand';

import { getChatStream } from '@/src/core/actions/chat-stream.actions';
import { Message } from '@/src/interfaces/chat/chat.interface';

interface ChatContextState {
  geminiWriting: boolean;
  chatId: string;
  messages: Message[];
  addMessage: (text: string, attachments: any[]) => void;
  clearChat: () => void;
}

const createMessage = (
  text: string,
  sender: 'user' | 'gemini',
  attachments: any[] = [],
): Message => {
  if (attachments) {
    return {
      id: uuid.v4(),
      text: text,
      createdAt: new Date(),
      sender: sender,
      type: 'image',
      images: attachments.map(img => img.uri),
    };
  }
  return {
    id: uuid.v4(),
    text: text,
    createdAt: new Date(),
    sender: sender,
    type: 'text',
  };
};

export const useChatContextStore = create<ChatContextState>()((set, get) => ({
  geminiWriting: false,
  chatId: uuid.v4(),
  messages: [],

  addMessage: async (prompt: string, attachments: any[]) => {
    const userMessage = createMessage(prompt, 'user', attachments);
    const geminiMessage = createMessage('Generando respuesta...', 'gemini');
    const chatId = get().chatId;

    set(state => ({
      messages: [geminiMessage, userMessage, ...state.messages],
    }));

    try {
      await getChatStream(prompt, attachments, chatId, text => {
        set(state => ({
          messages: state.messages.map(msg =>
            msg.id === geminiMessage.id ? { ...msg, text } : msg,
          ),
        }));
      });
    } catch (error) {
      set(state => ({
        messages: state.messages.map(msg =>
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
    set({ messages: [], chatId: uuid.v4() });
  },
}));
