import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon } from '@hugeicons/core-free-icons';

import {
  chatHeaderVariants,
  chatHeaderIconContainerVariants,
  chatHeaderIconBoxVariants,
  chatHeaderStatusIndicatorVariants,
} from './ChatHeader.variants';

const ChatHeader = () => {
  return (
    <div className={chatHeaderVariants()}>
      <div className={chatHeaderIconContainerVariants()}>
        <div className={chatHeaderIconBoxVariants()}>
          <HugeiconsIcon icon={SparklesIcon} size={20} className="text-white" />
        </div>
        <div className={chatHeaderStatusIndicatorVariants()} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-brand-text-primary tracking-tight">
          VitalPath Assistant
        </p>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-state-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-state-success" />
          </span>
          <p className="text-[11px] font-medium text-brand-text-secondary uppercase tracking-wider">
            Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
