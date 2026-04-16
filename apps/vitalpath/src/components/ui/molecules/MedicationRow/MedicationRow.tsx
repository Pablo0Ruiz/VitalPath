import { Octicons } from '@expo/vector-icons';
import { Pressable, View, ViewProps } from 'react-native';
import { Button, TextField } from '../../atoms';

export interface MedicationRowProps extends ViewProps {
  name: string;
  time?: string;
  description?: string;
  isDone?: boolean;
  onTakePress?: () => void;
  onDeletePress?: () => void;
  onEditPress?: () => void;
}

const MedicationRow = ({
  name,
  time,
  isDone,
  onTakePress,
  description,
  onDeletePress,
  onEditPress,
  className,
  ...props
}: MedicationRowProps) => {
  return (
    <View
      className={`flex-row items-center py-2.5 ${className ?? ''}`}
      {...props}
    >
      <Pressable
        onPress={!isDone ? onTakePress : undefined}
        className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
          isDone
            ? 'bg-success'
            : 'border-2 border-brand-violet-300 bg-brand-violet-50'
        }`}
      >
        {isDone && <Octicons name="check" size={14} color="white" />}
      </Pressable>

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
          <View className="flex-row items-center mt-0.5">
            <Octicons name="clock" size={10} color="#94a3b8" />
            <TextField
              variant="caption"
              className="text-left text-brand-slate-400 text-xs ml-1"
            >
              {time}
            </TextField>
          </View>
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

      <View className="flex-row items-center gap-1.5">
        {!isDone && onTakePress && (
          <Button
            onPress={onTakePress}
            size="sm"
            className="bg-brand-violet-100 rounded-full px-3 py-1.5"
          >
            <TextField
              variant="caption"
              className="text-brand-violet-700 font-semibold text-xs"
            >
              Tomar
            </TextField>
          </Button>
        )}

        {onEditPress && (
          <Pressable
            onPress={onEditPress}
            className="w-7 h-7 rounded-full bg-brand-slate-100 items-center justify-center"
          >
            <Octicons name="pencil" size={12} color="#64748b" />
          </Pressable>
        )}

        {onDeletePress && (
          <Pressable
            onPress={onDeletePress}
            className="w-7 h-7 rounded-full bg-red-50 items-center justify-center"
          >
            <Octicons name="trash" size={12} color="#ef4444" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default MedicationRow;
