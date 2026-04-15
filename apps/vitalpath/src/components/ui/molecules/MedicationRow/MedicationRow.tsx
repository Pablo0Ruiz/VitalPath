import { View, ViewProps } from 'react-native';
import { Button, TextField } from '../../atoms';

export interface MedicationRowProps extends ViewProps {
  name: string;
  time?: string;
  description?: string;
  isDone?: boolean;
  onTakePress?: () => void;
}

const MedicationRow = ({
  name,
  time,
  isDone,
  onTakePress,
  description,
  className,
  ...props
}: MedicationRowProps) => {
  return (
    <View
      className={`flex-row items-center py-1 ${className ?? ''}`}
      {...props}
    >
      <View
        className={`w-7 h-7 rounded-full items-center justify-center mr-3 ${
          isDone ? 'bg-green-500' : 'bg-brand-slate-200'
        }`}
      >
        {isDone && (
          <TextField
            variant="caption"
            className="text-white font-bold text-[10px]"
          >
            ✓
          </TextField>
        )}
      </View>

      <View className="flex-1">
        <TextField
          variant="body"
          className={`text-left font-semibold text-sm ${
            isDone
              ? 'text-brand-slate-400 line-through'
              : 'text-brand-slate-800'
          }`}
        >
          {name}
        </TextField>
        {time && (
          <TextField
            variant="caption"
            className="text-left text-brand-slate-400 text-xs mt-0.5"
          >
            {time}
          </TextField>
        )}
        {description && (
          <TextField
            variant="caption"
            className="text-left text-brand-slate-400 text-xs mt-0.5"
          >
            {description}
          </TextField>
        )}
      </View>

      {!isDone && onTakePress && (
        <Button
          onPress={onTakePress}
          className="bg-brand-violet-100 px-3.5 py-1.5 rounded-full"
        >
          <TextField
            variant="caption"
            className="text-brand-violet-600 font-semibold text-xs"
          >
            Tomar
          </TextField>
        </Button>
      )}
    </View>
  );
};

export default MedicationRow;
