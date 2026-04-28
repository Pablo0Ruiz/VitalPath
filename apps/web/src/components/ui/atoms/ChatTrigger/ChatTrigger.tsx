import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { chatTriggerVariants } from './ChatTrigger.variants';

interface ChatTriggerProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatTrigger = ({ isOpen, onClick }: ChatTriggerProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar asistente IA' : 'Abrir asistente IA'}
      className={chatTriggerVariants({ isOpen })}
    >
      <HugeiconsIcon
        icon={isOpen ? Cancel01Icon : SparklesIcon}
        size={24}
        className="text-white"
      />
    </button>
  );
};

export default ChatTrigger;
