import { Text, View, ViewProps } from 'react-native';
import {
  TextField,
  Tabs,
  ProgressBar,
  Avatar,
} from '@/src/components/ui/atoms';

export type CardStatus = 'completed' | 'sample' | 'processing' | 'locked';

export interface TimelineCardProps extends ViewProps {
  status: CardStatus;
  title: string;
  time?: string;
  date?: string;
  doctorName?: string;
  doctorImage?: any;
  samples?: string;
  progressLabel?: string;
  progressValue?: number;
  pendingNote?: string;
  estimatedTime?: string;
  isActive?: boolean;
  isLocked?: boolean;
}

const TimelineCard = ({
  status,
  title,
  time,
  date,
  doctorName,
  doctorImage,
  samples,
  progressLabel,
  progressValue,
  pendingNote,
  estimatedTime,
  isLocked,
  className,
  ...props
}: TimelineCardProps) => {
  const cardStyle = isLocked
    ? 'bg-white border border-slate-200 opacity-70'
    : 'bg-white border border-slate-100 shadow-sm shadow-slate-200';

  return (
    <View
      className={`rounded-2xl p-4 ${cardStyle} ${className ?? ''}`}
      {...props}
    >
      <View className="flex-row items-start justify-between mb-2">
        <TextField
          variants="body"
          className={`font-bold text-base flex-1 mr-2 ${
            status === 'processing' ? 'text-blue-600' : 'text-slate-800'
          }`}
        >
          {title}
        </TextField>
        {date && <Tabs label={date} variant={isLocked ? 'pending' : 'date'} />}
      </View>

      {time && (
        <View className="flex-row items-center mb-2 gap-1">
          <TextField variants="caption" className="text-slate-500">
            🕐 {time}
          </TextField>
        </View>
      )}

      {doctorName && (
        <View className="flex-row items-center gap-2 mt-1">
          <Avatar image={doctorImage} size="sm" />
          <TextField variants="caption" className="text-slate-600 font-medium">
            {doctorName}
          </TextField>
        </View>
      )}

      {samples && (
        <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mt-2">
          <TextField variants="caption" className="text-slate-600">
            Muestras procesadas:{' '}
            <Text className="font-bold text-slate-800">{samples}</Text>
          </TextField>
        </View>
      )}

      {progressLabel !== undefined && progressValue !== undefined && (
        <View className="mt-3">
          <ProgressBar progress={progressValue} className="mb-2" />
          <TextField variants="label" className="text-blue-600">
            {progressLabel}{' '}
            <Text className="font-extrabold">{progressValue}% COMPLETADO</Text>
          </TextField>
        </View>
      )}

      {pendingNote && (
        <TextField variants="caption" className="text-slate-400 mt-1">
          {pendingNote}
        </TextField>
      )}
      {estimatedTime && (
        <View className="flex-row items-center gap-1 mt-1">
          <TextField variants="caption" className="text-slate-400 italic">
            ℹ Tiempo estimado: {estimatedTime}
          </TextField>
        </View>
      )}
    </View>
  );
};

export default TimelineCard;
