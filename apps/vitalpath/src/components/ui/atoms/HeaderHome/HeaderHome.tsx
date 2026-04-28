import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { UserAvatar } from '../UserAvatar';
import { useTheme } from '@/src/hooks/useTheme';

export interface HeaderHomeProps {
  textLabel: string;
  onLogaut?: () => void;
  nameUser: string | undefined;
  style?: StyleProp<ViewStyle>;
}

const HeaderHome = ({
  textLabel = 'Welcome back',
  onLogaut,
  nameUser = 'User',
  style,
}: HeaderHomeProps) => {
  const t = useTheme();

  return (
    <Button variant="ghost" onLongPress={onLogaut} style={[s.container, style]}>
      <UserAvatar size="md" showStatus name={nameUser} />
      <View style={s.content}>
        <TextField
          variant="caption"
          style={[s.label, { color: t.textSecondary }]}
        >
          {textLabel}
        </TextField>
        <TextField variant="body" style={[s.name, { color: t.textPrimary }]}>
          {nameUser}
        </TextField>
      </View>
    </Button>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  content: { marginLeft: 12 },
  label: { textAlign: 'left', fontSize: 12 },
  name: { textAlign: 'left', fontSize: 15, fontWeight: '600' },
});

export default HeaderHome;
