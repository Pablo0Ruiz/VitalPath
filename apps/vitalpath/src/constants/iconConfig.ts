import { TimelineStatus } from '../components/ui/atoms/TimeLineIcon/TimeLineIcon';

export const iconConfig: Record<
  TimelineStatus,
  { icon: string; bg: string; iconColor: string }
> = {
  completed: { icon: 'check', bg: 'bg-blue-600', iconColor: '#fff' },
  sample: { icon: 'activity', bg: 'bg-blue-600', iconColor: '#fff' },
  processing: {
    icon: 'refresh-cw',
    bg: 'bg-white border border-blue-600',
    iconColor: '#2563eb',
  },
  locked: {
    icon: 'lock',
    bg: 'bg-white border border-slate-300',
    iconColor: '#94a3b8',
  },
};
