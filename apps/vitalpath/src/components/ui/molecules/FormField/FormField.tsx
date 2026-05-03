import {
  StyleSheet,
  View,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';

import { Input } from '../../atoms';
import { TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: boolean;
  rightLabel?: string;
  rightLabelOnPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
}

const FormField = ({
  label,
  error,
  helperText,
  rightLabel,
  rightLabelOnPress,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  ...inputProps
}: FormFieldProps) => {
  const t = useTheme();
  const inputVariant = error ? 'error' : 'default';

  return (
    <View style={[s.container, style]}>
      <View style={s.header}>
        <TextField
          variant="body"
          style={[s.label, { color: error ? t.error : t.textPrimary }]}
        >
          {label}
        </TextField>
        {rightLabel && (
          <TextField
            variant="caption"
            style={[s.rightLabel, { color: t.primary700 }]}
            onPress={rightLabelOnPress}
          >
            {rightLabel}
          </TextField>
        )}
      </View>
      <Input
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        variant={inputVariant}
        style={inputStyle}
        {...inputProps}
      />
      {helperText && (
        <TextField
          variant="caption"
          style={[s.helperText, { color: error ? t.error : t.textSecondary }]}
        >
          {helperText}
        </TextField>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: { textAlign: 'left', fontSize: 14, fontWeight: '500' },
  rightLabel: { fontSize: 12 },
  helperText: { textAlign: 'left', fontSize: 12, marginTop: 4 },
});

export default FormField;
