import { View } from 'react-native';
import { Medication } from '@/src/interfaces/medication/medication.interface';
import { MedicationRow } from '../../MedicationRow';
import { Divider } from '../../Divider';
import { useState } from 'react';
import { Button } from '../../../atoms';
import CustomUpdateModal from '../../CustomUpdateModal/CustomUpdateModal';

interface RawMedicationsProps {
  data: Medication[];
  onClick: (id: string) => void;
}

export const RawMedications = ({ data, onClick }: RawMedicationsProps) => {
  const [completedMedications, setCompletedMedications] = useState<string[]>(
    [],
  );
  const [selectedMedicationId, setSelectedMedicationId] = useState<
    string | null
  >(null);

  const handleTakePress = (id: string) => {
    setCompletedMedications(prev => [...prev, id]);
  };

  const handleOpenModal = (id: string) => {
    setSelectedMedicationId(id);
  };

  const handleCloseModal = () => {
    setSelectedMedicationId(null);
  };

  return (
    <>
      {data.map((item, index) => (
        <View key={item._id}>
          <MedicationRow
            name={item.name}
            onDeletePress={() => onClick(item._id)}
            description={item.description}
            onTakePress={() => handleTakePress(item._id)}
            onEditPress={() => handleOpenModal(item._id)}
            isDone={completedMedications.includes(item._id)}
          />
          {index < data.length - 1 && <Divider className="my-2" />}
        </View>
      ))}

      {selectedMedicationId && (
        <CustomUpdateModal
          visible={!!selectedMedicationId}
          onClose={handleCloseModal}
          id={selectedMedicationId}
        />
      )}
    </>
  );
};
