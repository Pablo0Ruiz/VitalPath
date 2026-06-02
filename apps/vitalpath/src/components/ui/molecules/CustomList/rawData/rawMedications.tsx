import { View } from 'react-native';
import { Medication } from '@repo/types';
import { MedicationRow } from '../../MedicationRow';
import { Divider } from '../../Divider';

interface RawMedicationsProps {
  data: Medication[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onTake: (item: Medication) => void;
}

export const RawMedications = ({
  data,
  onDelete,
  onEdit,
  onTake,
}: RawMedicationsProps) => (
  <>
    {data.map((item, index) => (
      <View key={item._id}>
        <MedicationRow
          name={item.name}
          description={item.description}
          time={item.startTime}
          isDone={(item.dosesTaken ?? 0) > 0}
          onDeletePress={() => onDelete(item._id)}
          onEditPress={() => onEdit(item._id)}
          onTakePress={() => onTake(item)}
        />
        {index < data.length - 1 && <Divider style={{ marginVertical: 8 }} />}
      </View>
    ))}
  </>
);
