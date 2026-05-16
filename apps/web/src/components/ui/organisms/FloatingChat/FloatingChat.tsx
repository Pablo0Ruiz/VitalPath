'use client';

import { useState, useRef, useEffect } from 'react';

import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import ChatTrigger from '@/components/ui/atoms/ChatTrigger/ChatTrigger';
import ChatHeader from '@/components/ui/molecules/ChatHeader/ChatHeader';
import ChatMessage from '@/components/ui/molecules/ChatMessage/ChatMessage';
import ChatInput from '@/components/ui/molecules/ChatInput/ChatInput';
import { useChat } from './useChat';
import { floatingChatVariants } from './FloatingChat.variants';

const suggestions = [
  '¿Qué citas tengo hoy?',
  'Buscar cardiólogos cerca',
  '¿Cómo va mi último estudio?',
];

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    addWelcomeMessage,
  } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lastMessageContent = messages[messages.length - 1]?.content;
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, lastMessageContent]);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleOpen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (!nextState) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }

    if (nextState && !hasOpened && messages.length === 0) {
      setHasOpened(true);
      addWelcomeMessage();
    }
  };

  return (
    <>
      <ChatTrigger isOpen={isOpen} onClick={toggleOpen} ref={triggerRef} />

      <div className={floatingChatVariants({ isOpen })}>
        <ChatHeader />

        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4 scrollbar-hide">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-primary-600/10 ring-8 ring-brand-primary-600/5">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={32}
                  className="text-brand-primary-600"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-bold text-brand-text-primary">
                  ¿Cómo puedo ayudarte?
                </p>
                <p className="text-sm text-brand-text-secondary leading-relaxed">
                  Estoy aquí para gestionar tus citas médicas y resolver dudas
                  administrativas de forma rápida.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full mt-2">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs text-left px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-primary-50 hover:border-brand-primary-200 transition-all text-brand-text-primary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-white border border-brand-border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-primary-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-primary-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-primary-400 animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-2" />
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          isLoading={isLoading}
          isOpen={isOpen}
          ref={inputRef}
        />
      </div>
    </>
  );
};

export default FloatingChat;
