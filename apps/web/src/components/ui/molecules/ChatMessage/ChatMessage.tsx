import { cn } from '@/lib/utils';
import {
  chatMessageVariants,
  messageContainerVariants,
} from './ChatMessage.variants';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

const ChatMessage = ({ role, content, streaming }: ChatMessageProps) => {
  return (
    <div className={messageContainerVariants({ role })}>
      <div className={chatMessageVariants({ role })}>
        {content ||
          (streaming && (
            <span className="flex gap-1 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-text-secondary animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-text-secondary animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-text-secondary animate-bounce"></span>
            </span>
          ))}
        {streaming && content && (
          <span className="ml-1 inline-block h-3 w-1 animate-pulse rounded-full bg-current align-middle" />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
