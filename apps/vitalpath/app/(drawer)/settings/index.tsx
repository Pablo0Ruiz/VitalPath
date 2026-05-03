import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackButton,
  Card,
  ScreenHeader,
  TextField,
} from '@/src/components/ui/atoms';
import { useSeniorUIStore } from '@/src/stores/seniorUI.store';
import { useTheme } from '@/src/hooks/useTheme';

export default function SettingsScreen() {
  const t = useTheme();
  const { isSeniorUI, setIsSeniorUI } = useSeniorUIStore();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: t.background }}
      edges={['top']}
    >
      <BackButton />
      <ScreenHeader
        title="Configuración"
        subtitle="Preferencias y accesibilidad"
      />
      <ScrollView contentContainerStyle={s.content}>
        <Card>
          <View
            style={[
              s.row,
              { borderBottomWidth: 1, borderBottomColor: t.border },
            ]}
          >
            <View style={s.rowText}>
              <TextField variant="body" style={{ color: t.textPrimary }}>
                Modo accesible (Senior)
              </TextField>
              <TextField
                variant="caption"
                style={{ color: t.textSecondary, marginTop: 2 }}
              >
                Texto y botones más grandes
              </TextField>
            </View>
            <Switch
              value={isSeniorUI}
              onValueChange={setIsSeniorUI}
              trackColor={{ false: t.border, true: t.primary500 }}
            />
          </View>
          <View style={s.row}>
            <TextField variant="body" style={{ color: t.textPrimary }}>
              Versión
            </TextField>
            <TextField variant="caption" style={{ color: t.textSecondary }}>
              VitalPath v1.0.0
            </TextField>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: { flex: 1, marginRight: 12 },
});
