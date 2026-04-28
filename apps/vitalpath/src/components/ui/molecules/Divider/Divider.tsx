import { StyleSheet, View, ViewProps } from 'react-native';
import { TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

interface DividerProps extends ViewProps {
  text?: string;
}

const Divider = ({ text, style, ...props }: DividerProps) => {
  const t = useTheme();

  if (!text) {
    return (
      <View {...props} style={[s.line, { backgroundColor: t.border }, style]} />
    );
  }

  return (
    <View {...props} style={[s.textContainer, style]}>
      <View style={[s.divider, { backgroundColor: t.border }]} />
      <TextField variant="caption" style={[s.text, { color: t.textSecondary }]}>
        {text}
      </TextField>
      <View style={[s.divider, { backgroundColor: t.border }]} />
    </View>
  );
};

const s = StyleSheet.create({
  line: { height: 1, width: '100%' },
  textContainer: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  divider: { flex: 1, height: 1 },
  text: { marginHorizontal: 12, fontSize: 12 },
});

export default Divider;
