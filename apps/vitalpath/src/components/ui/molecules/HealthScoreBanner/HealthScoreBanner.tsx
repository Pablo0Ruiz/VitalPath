import React from 'react';
import { View, ViewProps } from 'react-native';
import { RingProgress } from '../RingProgress';
import { TextField } from '../../atoms';

export interface HealthScoreBannerProps extends ViewProps {
  score: number;
  maxScore: number;
  status: string;
}

const HealthScoreBanner = ({
  score,
  maxScore = 100,
  status,
  className,
  ...props
}: HealthScoreBannerProps) => {
  const progressPercent = Math.round((score / maxScore) * 100);

  return (
    <View
      className={`bg-brand-violet-600 rounded-[20px] p-5 flex-row items-center mb-4 ${
        className ?? ''
      }`}
      {...props}
    >
      <View className="flex-1">
        <TextField
          variants="caption"
          className="text-white opacity-70 mb-1 text-left text-xs"
        >
          Tu puntaje de salud
        </TextField>
        <TextField
          variants="body"
          className="text-white font-extrabold text-[48px] leading-[52px] text-left"
        >
          {score}
        </TextField>
        <TextField
          variants="caption"
          className="text-white opacity-85 mb-2.5 text-left text-[13px]"
        >
          de {maxScore} · {status}
        </TextField>
        <View className="h-1.5 bg-white opacity-25 rounded-full overflow-hidden w-full">
          <View
            className="h-full bg-white opacity-100 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      <View className="ml-4">
        <RingProgress value={score} max={maxScore} label="Score" unit="pts" />
      </View>
    </View>
  );
};

export default HealthScoreBanner;
