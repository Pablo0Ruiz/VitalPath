import { HugeiconsIcon } from '@hugeicons/react';
import { SentIcon, Loading02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

import {
  chatInputContainerVariants,
  chatInputWrapperVariants,
  chatInputTextareaVariants,
  chatInputButtonVariants,
} from './ChatInput.variants';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isOpen: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

const ChatInput = ({
  input,
  setInput,
  onSend,
  isLoading,
  isOpen: _isOpen,
  ref,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={chatInputContainerVariants()}>
      <div className={chatInputWrapperVariants({ isLoading })}>
        <textarea
          ref={ref}
          rows={1}
          placeholder="Escribí tu mensaje aquí..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={chatInputTextareaVariants()}
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className={chatInputButtonVariants()}
        >
          <HugeiconsIcon
            icon={isLoading ? Loading02Icon : SentIcon}
            size={18}
            className={cn('text-white', isLoading && 'animate-spin')}
          />
        </button>
      </div>
      <p className="mt-3 text-center text-[10px] font-medium text-brand-text-secondary uppercase tracking-tight opacity-60">
        VitalPath AI · Gestión Administrativa Inteligente
      </p>
    </div>
  );
};

export default ChatInput;
