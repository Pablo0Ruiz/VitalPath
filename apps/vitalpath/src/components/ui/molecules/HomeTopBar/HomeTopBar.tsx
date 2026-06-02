import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Button, HeaderHome, TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface HomeTopBarProps extends ViewProps {
  userName?: string;
  onNotificationsPress?: () => void;
  pendingMeds?: number | null;
  nextCita?: string | null;
}

export const HomeTopBar = ({
  userName,
  onNotificationsPress,
  pendingMeds,
  nextCita,
  style,
  ...props
}: HomeTopBarProps) => {
  const t = useTheme();
  const navigation = useNavigation();

  const summaryItems: { text: string; done: boolean }[] = [];
  if (pendingMeds != null) {
    if (pendingMeds === 0) {
      summaryItems.push({ text: 'Medicamentos al día', done: true });
    } else {
      summaryItems.push({
        text: `${pendingMeds} medicamento${pendingMeds !== 1 ? 's' : ''} pendiente${pendingMeds !== 1 ? 's' : ''}`,
        done: false,
      });
    }
  }
  if (nextCita != null) {
    summaryItems.push({ text: `Próxima cita: ${nextCita}`, done: false });
  }

  return (
    <View style={[s.container, style]} {...props}>
      <View style={s.topRow}>
        <HeaderHome
          textLabel="Buenos días"
          nameUser={userName}
          style={s.flex1}
        />
        <View style={s.actions}>
          <Button
            variant="ghost"
            size="sm"
            style={[s.iconButton, { backgroundColor: t.glassBorder }]}
            onPress={onNotificationsPress ?? (() => {})}
            accessibilityLabel="Notificaciones"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={22} color={t.white} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            style={[s.iconButton, { backgroundColor: t.glassBorder }]}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            accessibilityLabel="Abrir menú"
            accessibilityRole="button"
          >
            <Ionicons name="menu-outline" size={24} color={t.white} />
          </Button>
        </View>
      </View>

      {summaryItems.length > 0 && (
        <View style={s.summary}>
          {summaryItems.map((item, i) => (
            <TextField
              key={i}
              variant="caption"
              style={[
                s.summaryText,
                {
                  color: 'rgba(255,255,255,0.90)',
                  fontSize: t.fontSizeCaption,
                },
              ]}
            >
              {item.done ? '✓' : '·'} {item.text}
            </TextField>
          ))}
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: { flex: 1 },
  summary: {
    marginTop: 10,
    gap: 4,
  },
  summaryText: {
    fontWeight: '500',
  },
});

export default HomeTopBar;
