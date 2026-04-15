import { View, ViewProps } from 'react-native';

export interface ProgressBarProps extends ViewProps {
  progress: number;
}

const ProgressBar = ({ progress, className, ...props }: ProgressBarProps) => {
  return (
    <View
      className={`h-2 bg-slate-200 rounded-full w-full overflow-hidden ${className ?? ''}`}
      {...props}
    >
      <View
        className="h-full bg-blue-600 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </View>
  );
};

export default ProgressBar;
