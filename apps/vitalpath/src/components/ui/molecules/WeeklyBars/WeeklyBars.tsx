import React from 'react';
import { View, ViewProps } from 'react-native';
import { TextField } from '../../atoms';

export interface WeeklyBarsProps extends ViewProps {
  data: number[];
  title: string;
  subtitle: string;
  todayLabel: string;
  goalLabel: string;
  goalPercentage: string;
}

const WeeklyBars = ({
  data,
  title,
  subtitle,
  todayLabel,
  goalLabel,
  goalPercentage,
  className,
  ...props
}: WeeklyBarsProps) => {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const max = Math.max(...data);
  const barW = 22;
  const chartH = 60;

  return (
    <View
      className={`bg-white rounded-[16px] p-4 border border-brand-slate-200 mb-3 ${className ?? ''}`}
      {...props}
    >
      <View className="flex-row justify-between items-start mb-3.5">
        <View>
          <TextField
            variants="body"
            className="text-left font-bold text-brand-slate-800 text-[15px]"
          >
            {title}
          </TextField>
          <TextField
            variants="caption"
            className="text-left text-brand-slate-400 text-xs mt-0.5"
          >
            {subtitle}
          </TextField>
        </View>
        <View className="bg-brand-violet-100 px-2.5 py-1 rounded-full">
          <TextField
            variants="caption"
            className="text-brand-violet-600 font-bold text-xs"
          >
            {todayLabel}
          </TextField>
        </View>
      </View>

      <View className="flex-row items-end gap-1.5 justify-between">
        {data.map((val, i) => {
          const barH = Math.max(4, (val / max) * chartH);
          const isToday = i === 4; // Assuming Friday is today in the original mockup logic
          return (
            <View key={i} className="items-center gap-1">
              <View
                style={{ height: barH, width: barW }}
                className={`rounded-[6px] ${isToday ? 'bg-brand-violet-600' : 'bg-brand-violet-100'}`}
              />
              <TextField
                variants="caption"
                className={`text-[10px] ${isToday ? 'text-brand-violet-600 font-extrabold' : 'text-brand-slate-400'}`}
              >
                {days[i]}
              </TextField>
            </View>
          );
        })}
      </View>

      <View className="flex-row justify-between mt-2.5">
        <TextField variants="caption" className="text-brand-slate-400 text-xs">
          {goalLabel}
        </TextField>
        <TextField
          variants="caption"
          className="text-brand-violet-600 font-bold text-xs"
        >
          {goalPercentage}
        </TextField>
      </View>
    </View>
  );
};

export default WeeklyBars;
