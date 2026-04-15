import { View } from 'react-native';
import { Button, TextField } from '../../atoms';

export interface GenderFormProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  list: string[];
  title?: string;
}

const GenderForm = ({
  value,
  onChange,
  errorMessage,
  list,
  title = 'Género',
}: GenderFormProps) => {
  return (
    <View className="mb-8 mt-2">
      <TextField
        variant="body"
        className="text-left text-sm text-brand-slate-700 mb-2"
      >
        {title}
      </TextField>
      <View className="flex-row gap-2">
        {list.map(g => (
          <Button
            key={g}
            onPress={() => onChange(g)}
            className={`flex-1 py-3 items-center rounded-xl border ${
              value === g
                ? 'bg-brand-violet-50 border-brand-violet-600'
                : 'bg-transparent border-slate-200'
            }`}
          >
            <TextField
              variant="body"
              className={
                value === g
                  ? 'text-brand-violet-700 font-semibold'
                  : 'text-slate-600'
              }
            >
              {g}
            </TextField>
          </Button>
        ))}
      </View>
      {errorMessage && (
        <TextField variant="caption" className="text-red-500 text-sm mt-1">
          {errorMessage}
        </TextField>
      )}
    </View>
  );
};

GenderForm.displayName = 'GenderForm';
export default GenderForm;
