import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCitas, useMedicalResultsPaciente } from '@repo/api-client';
import { useAuthStore } from '@repo/store';
import type { IMedicalResults } from '@repo/types';

import { TextField } from '@/src/components/ui/atoms';
import { TrackingTimeline } from '@/src/components/ui/organism/TrackingTimeline';
import { SummaryBottomSheet } from '@/src/components/ui/molecules/SummaryBottomSheet';
import { usePdfData } from '@/src/hooks/usePdfData';
import { useTheme } from '@/src/hooks/useTheme';

const RESULT_STATES = ['resultados_listos', 'completada'];

export default function StudyDetailScreen() {
  const t = useTheme();
  const { user } = useAuthStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resultados } = useMedicalResultsPaciente();
  const { data: citas = [] } = useCitas(user?._id ?? '');

  const study = useMemo(() => {
    const realStudy = resultados?.find(s => s._id === id);
    if (realStudy) return realStudy;

    const cita = citas.find(c => c._id === id);
    if (cita) {
      return {
        _id: cita._id,
        cita_ID: {
          _id: cita._id,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado,
        },
        medico_ID: cita.medico_ID,
        paciente_ID: cita.paciente_ID,
        fileUrl: '',
        createdAt: cita.createdAt,
        updatedAt: cita.updatedAt,
      } as IMedicalResults;
    }

    return undefined;
  }, [resultados, citas, id]);

  const { fetchPdfData, pdfCache } = usePdfData();
  const [summaryVisible, setSummaryVisible] = useState(false);

  const handleVerPDF = async () => {
    const data = await fetchPdfData({ study });
    if (!data) return;
    try {
      await WebBrowser.openBrowserAsync(data.publicUrl);
    } catch {
      await Linking.openURL(data.publicUrl);
    }
  };

  const handleVerResumen = async () => {
    await fetchPdfData({ study });
    setSummaryVisible(true);
  };

  if (!study) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: t.background }]}>
        <View style={s.center}>
          <TextField variant="caption" style={{ color: t.textSecondary }}>
            Estudio no encontrado.
          </TextField>
        </View>
      </SafeAreaView>
    );
  }

  const showActions = RESULT_STATES.includes(study.cita_ID.estado);
  const cachedEntry = pdfCache[study.fileUrl];
  const pdfData =
    cachedEntry && cachedEntry !== 'loading' && cachedEntry !== 'error'
      ? cachedEntry
      : null;
  const isPdfLoading = cachedEntry === 'loading';

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['bottom']}
    >
      <ScrollView
        style={s.flex1}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.timelineWrapper}>
          <TrackingTimeline resultado={study} onPrivacyPress={() => {}} />
        </View>

        {showActions && (
          <View style={s.actionsWrapper}>
            <TextField
              variant="label"
              style={[s.actionsTitle, { color: t.textSecondary }]}
            >
              Resultados disponibles
            </TextField>

            <Pressable
              onPress={handleVerPDF}
              disabled={isPdfLoading}
              style={({ pressed }) => [
                s.button,
                {
                  backgroundColor: t.primary600,
                  opacity: pressed || isPdfLoading ? 0.8 : 1,
                },
              ]}
            >
              {isPdfLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <TextField variant="body" style={s.buttonTextWhite}>
                  Ver PDF
                </TextField>
              )}
            </Pressable>

            <Pressable
              onPress={handleVerResumen}
              disabled={isPdfLoading}
              style={({ pressed }) => [
                s.buttonOutline,
                {
                  borderColor: t.primary600,
                  opacity: pressed || isPdfLoading ? 0.7 : 1,
                },
              ]}
            >
              <TextField
                variant="body"
                style={[s.buttonTextOutline, { color: t.primary600 }]}
              >
                Ver resumen IA
              </TextField>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <SummaryBottomSheet
        isVisible={summaryVisible}
        onClose={() => setSummaryVisible(false)}
        resumenIA={pdfData?.resumen}
        resumenMedico={study.resumenMedico}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 60 },
  timelineWrapper: { paddingHorizontal: 20, paddingTop: 20 },
  actionsWrapper: { paddingHorizontal: 20, marginTop: 24, gap: 12 },
  actionsTitle: { fontWeight: '600', marginBottom: 4 },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextWhite: { color: 'white', fontWeight: '700' },
  buttonOutline: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonTextOutline: { fontWeight: '700' },
});
