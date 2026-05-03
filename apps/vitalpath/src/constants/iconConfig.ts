import { TimelineStatus } from '../components/ui/atoms/TimeLineIcon/TimeLineIcon';
import { ThemeTokens } from './tokens';

export interface IconConfigItem {
  icon: string;
  bg: string;
  iconColor: string;
  borderColor?: string;
}

export const getIconConfig = (
  t: ThemeTokens,
): Record<TimelineStatus, IconConfigItem> => ({
  completed: { icon: 'check', bg: t.info, iconColor: '#FFFFFF' },
  sample: { icon: 'activity', bg: t.info, iconColor: '#FFFFFF' },
  processing: {
    icon: 'refresh-cw',
    bg: t.surfaceElevated,
    borderColor: t.info,
    iconColor: t.info,
  },
  locked: {
    icon: 'lock',
    bg: t.surfaceElevated,
    borderColor: t.border,
    iconColor: t.textSecondary,
  },
});
