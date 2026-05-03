import { Ionicons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import { TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

interface HeaderProps {
  view: 'active' | 'history';
  onBack: () => void;
}

const ChatHeader = ({ view, onBack }: HeaderProps) => {
  const t = useTheme();
  return (
    <View
      style={[
        s.header,
        { backgroundColor: t.background, justifyContent: 'center' },
      ]}
    >
      <Pressable
        onPress={onBack}
        style={{
          position: 'absolute',
          left: 20,
          zIndex: 20,
        }}
      >
        <Ionicons name="arrow-back-outline" size={24} color={t.textPrimary} />
      </Pressable>
      {view === 'active' && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LinearGradient
            colors={[t.primary600, t.primary700]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[s.avatar, s.shadow]}
          >
            <Octicons name="dependabot" size={20} color="white" />
          </LinearGradient>
          <View>
            <TextField
              variant="body"
              style={[s.title, { color: t.textPrimary }]}
            >
              VitalPath AI
            </TextField>
            <View style={s.statusRow}>
              <View style={[s.onlineDot, { backgroundColor: t.success }]} />
              <TextField
                variant="caption"
                style={[s.statusText, { color: t.textSecondary }]}
              >
                En línea
              </TextField>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatHeader;

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 16,
    zIndex: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontWeight: '700', fontSize: 16, textAlign: 'left' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 12, textAlign: 'left' },
});
