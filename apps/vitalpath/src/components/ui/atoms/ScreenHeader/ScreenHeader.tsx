import { StyleSheet, View, ViewProps } from 'react-native';
import { TextField } from '../TextField';
import { useTheme } from '@/src/hooks/useTheme';

export interface ScreenHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
}

const ScreenHeader = ({
  title,
  subtitle,
  style,
  ...props
}: ScreenHeaderProps) => {
  const t = useTheme();

  return (
    <View style={[s.container, style]} {...props}>
      <TextField
        variant="title"
        style={{
          color: t.textPrimary,
          fontSize: 30,
          fontWeight: '700',
          lineHeight: 36,
        }}
      >
        {title}
      </TextField>
      {subtitle && (
        <TextField
          variant="caption"
          style={{ color: t.textSecondary, fontSize: 14, marginTop: 4 }}
        >
          {subtitle}
        </TextField>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
});

export default ScreenHeader;
