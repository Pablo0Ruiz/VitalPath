import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TextField } from '../TextField';
import { UserAvatar } from '../UserAvatar';
import { useTheme } from '@/src/hooks/useTheme';

export interface HeaderHomeProps {
  textLabel: string;
  nameUser: string | undefined;
  style?: StyleProp<ViewStyle>;
}

const HeaderHome = ({
  textLabel = 'Welcome back',
  nameUser = 'User',
  style,
}: HeaderHomeProps) => {
  const t = useTheme();

  return (
    <View style={[s.container, style]}>
      <View style={s.leftBlock}>
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
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  content: { marginLeft: 12 },
  label: { textAlign: 'left', fontSize: 12 },
  name: { textAlign: 'left', fontSize: 15, fontWeight: '600' },
});

export default HeaderHome;
