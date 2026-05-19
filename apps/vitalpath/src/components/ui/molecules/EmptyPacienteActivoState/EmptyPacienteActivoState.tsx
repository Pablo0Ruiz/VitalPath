import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { EmptyState } from '@/src/components/ui/atoms';

export function EmptyPacienteActivoState(): JSX.Element {
  const navigation = useNavigation();

  return (
    <EmptyState
      icon="user-plus"
      title="Seleccioná un paciente"
      subtitle="Elegí desde el menú a quién querés acompañar para ver sus datos."
      action={{
        label: 'Abrir menú',
        onPress: () => navigation.dispatch(DrawerActions.openDrawer()),
      }}
    />
  );
}
