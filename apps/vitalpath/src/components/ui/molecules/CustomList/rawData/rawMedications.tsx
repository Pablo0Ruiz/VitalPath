import { View } from 'react-native';
import { Medication } from '@repo/types';
import { MedicationRow } from '../../MedicationRow';
import { Divider } from '../../Divider';

interface RawMedicationsProps {
  data: Medication[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onTake: (id: string) => void;
  completedIds: string[];
}

export const RawMedications = ({
  data,
  onDelete,
  onEdit,
  onTake,
  completedIds,
}: RawMedicationsProps) => (
  <>
    {data.map((item, index) => (
      <View key={item._id}>
        <MedicationRow
          name={item.name}
          description={item.description}
          isDone={completedIds.includes(item._id)}
          onDeletePress={() => onDelete(item._id)}
          onEditPress={() => onEdit(item._id)}
          onTakePress={() => onTake(item._id)}
        />
        {index < data.length - 1 && <Divider style={{ marginVertical: 8 }} />}
      </View>
    ))}
  </>
);
