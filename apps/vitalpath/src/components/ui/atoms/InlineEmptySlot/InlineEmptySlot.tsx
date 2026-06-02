import { StyleSheet, View, ViewProps } from 'react-native';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { useTheme } from '@/src/hooks/useTheme';

export interface InlineEmptySlotProps extends ViewProps {
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const InlineEmptySlot = ({
  text,
  actionLabel,
  onAction,
  style,
  ...props
}: InlineEmptySlotProps) => {
  const t = useTheme();
  return (
    <View style={[s.container, style]} {...props}>
      <TextField
        variant="caption"
        style={{ color: t.textSecondary, textAlign: 'center', fontSize: 12 }}
      >
        {text}
      </TextField>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="secondary"
          size="sm"
          style={s.action}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  action: {
    marginTop: 12,
  },
});

export default InlineEmptySlot;
