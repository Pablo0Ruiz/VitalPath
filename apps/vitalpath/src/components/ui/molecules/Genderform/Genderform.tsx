import { StyleSheet, View } from 'react-native';
import { Button, TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

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
  const t = useTheme();

  return (
    <View style={s.container}>
      <TextField variant="body" style={[s.label, { color: t.textPrimary }]}>
        {title}
      </TextField>
      <View style={s.row}>
        {list.map(g => {
          const isActive = value === g;
          return (
            <Button
              key={g}
              onPress={() => onChange(g)}
              variant={isActive ? 'primary' : 'outline'}
              style={[
                s.button,
                isActive
                  ? { backgroundColor: t.primary50, borderColor: t.primary600 }
                  : { backgroundColor: 'transparent', borderColor: t.border },
              ]}
            >
              <TextField
                variant="body"
                style={[
                  s.buttonText,
                  isActive
                    ? { color: t.primary700, fontWeight: '600' }
                    : { color: t.textSecondary },
                ]}
              >
                {g}
              </TextField>
            </Button>
          );
        })}
      </View>
      {errorMessage && (
        <TextField variant="caption" style={[s.error, { color: t.error }]}>
          {errorMessage}
        </TextField>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 32, marginTop: 8 },
  label: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  row: { flexDirection: 'row', gap: 10 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  buttonText: { fontSize: 14 },
  error: { fontSize: 12, marginTop: 4 },
});

GenderForm.displayName = 'GenderForm';
export default GenderForm;
