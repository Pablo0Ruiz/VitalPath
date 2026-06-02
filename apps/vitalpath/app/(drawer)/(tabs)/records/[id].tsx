import { useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCitas, useMedicalResultsPaciente } from '@repo/api-client';
import { useAuthStore } from '@/src/stores/auth';
import type { IMedicalResults } from '@repo/types';

import { Button, LoadingScreen, TextField } from '@/src/components/ui/atoms';
import { TrackingTimeline } from '@/src/components/ui/organisms/TrackingTimeline';
import { SummaryBottomSheet } from '@/src/components/ui/molecules/SummaryBottomSheet';
import { ScreenLayout } from '@/src/components/ui/organisms';
import { usePdfData } from '@/src/hooks/usePdfData';
import { useTheme } from '@/src/hooks/useTheme';

const RESULT_STATES = ['resultados_listos', 'completada'];

export default function StudyDetailScreen() {
  const t = useTheme();
  const { user } = useAuthStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resultados, isLoading: isLoadingResultados } =
    useMedicalResultsPaciente();
  const { data: citas = [], isLoading: isLoadingCitas } = useCitas(
    user?._id ?? '',
  );
  const { fetchPdfData, pdfCache } = usePdfData();
  const [summaryVisible, setSummaryVisible] = useState(false);

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

  const isLoading =
    (isLoadingResultados && !resultados) ||
    (isLoadingCitas && citas.length === 0);

  if (isLoading) {
    return <LoadingScreen size="large" />;
  }

  if (!study) {
    return (
      <ScreenLayout edges={['bottom']}>
        <View style={s.center}>
          <TextField variant="caption" style={{ color: t.textSecondary }}>
            Estudio no encontrado.
          </TextField>
        </View>
      </ScreenLayout>
    );
  }

  const handleVerPDF = async () => {
    const data = await fetchPdfData({ study });
    if (!data) return;
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(data.publicUrl)}&embedded=true`;
    try {
      await WebBrowser.openBrowserAsync(viewerUrl);
    } catch {
      await Linking.openURL(data.publicUrl);
    }
  };

  const handleVerResumen = async () => {
    await fetchPdfData({ study });
    setSummaryVisible(true);
  };

  const showActions = RESULT_STATES.includes(
    study.cita_ID?.estado || 'completada',
  );
  const cachedEntry = pdfCache[study.fileUrl];
  const pdfData =
    cachedEntry && cachedEntry !== 'loading' && cachedEntry !== 'error'
      ? cachedEntry
      : null;
  const isPdfLoading = cachedEntry === 'loading';

  return (
    <ScreenLayout scrollable={false} edges={['bottom']}>
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
              RESULTADOS DISPONIBLES
            </TextField>

            <Button
              title="Ver resumen IA"
              onPress={handleVerResumen}
              variant="ai"
              disabled={isPdfLoading}
            />

            <Button
              title="Ver PDF"
              onPress={handleVerPDF}
              variant="outline"
              loading={isPdfLoading}
              disabled={isPdfLoading}
            />
          </View>
        )}
      </ScrollView>

      <SummaryBottomSheet
        isVisible={summaryVisible}
        onClose={() => setSummaryVisible(false)}
        resumenIA={pdfData?.resumen}
        notasMedico={study.notasMedico}
      />
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  flex1: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 60 },
  timelineWrapper: { paddingHorizontal: 20, paddingTop: 20 },
  actionsWrapper: { paddingHorizontal: 20, marginTop: 24, gap: 12 },
  actionsTitle: { fontWeight: '600', marginBottom: 4 },
});
