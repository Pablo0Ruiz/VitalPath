import * as ImagePicker from 'expo-image-picker';

export const getGalleryImages = async (): Promise<
  ImagePicker.ImagePickerAsset[]
> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    aspect: [4, 3],
    allowsMultipleSelection: true,
    quality: 0.7,
    selectionLimit: 4,
  });
  if (result.canceled) return [];
  return result.assets;
};
