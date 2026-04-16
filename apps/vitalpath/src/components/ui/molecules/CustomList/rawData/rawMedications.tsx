import { View } from 'react-native';
import { Medication } from '@/src/interfaces/medication/medication.interface';
import { MedicationRow } from '../../MedicationRow';
import { Divider } from '../../Divider';

interface RawMedicationsProps {
  data: Medication[];
}

export const RawMedications = ({ data }: RawMedicationsProps) => (
  <>
    {data.map((item, index) => (
      <View key={item._id}>
        <MedicationRow
          name={item.name}
          description={item.description}
          onTakePress={() => {}}
        />
        {index < data.length - 1 && <Divider className="my-2" />}
      </View>
    ))}
  </>
);
