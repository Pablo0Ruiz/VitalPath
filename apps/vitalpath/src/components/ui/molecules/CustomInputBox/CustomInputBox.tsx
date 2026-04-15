import Ionicons from '@expo/vector-icons/Ionicons';
import { ImagePickerAsset } from 'expo-image-picker';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';

import { Button, Input } from '@/src/components/ui/atoms';
import { getGalleryImages } from '@/src/core/actions/image-picker/get-gallery-images';

export interface CustomInputBoxProps {
  onSendMessage: (message: string, attachments: ImagePickerAsset[]) => void;
}

const CustomInputBox = ({ onSendMessage }: CustomInputBoxProps) => {
  const isAndroid = Platform.OS === 'android';

  const [text, setText] = useState('');
  const [images, setImages] = useState<ImagePickerAsset[]>([]);

  const handleSendMessage = () => {
    console.log('datos a enviar', text.trim(), images);
    onSendMessage(text.trim(), images);
    setText('');
    setImages([]);
  };

  const handlePickImages = async () => {
    console.log('datos a enviar con imagen', text.trim(), images);
    const selectedImages = await getGalleryImages();

    if (selectedImages.length === 0 || images.length >= 4) return;

    const availableSlots = 4 - images.length;
    const imagesToAdd = selectedImages.slice(0, availableSlots);

    if (imagesToAdd.length > 0) {
      setImages([...images, ...imagesToAdd]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={isAndroid ? 'height' : 'padding'}
      keyboardVerticalOffset={isAndroid ? 0 : 85}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        {images.map(image => (
          <Image
            key={image.uri}
            source={{ uri: image.uri }}
            style={{ width: 50, height: 50, marginTop: 5, borderRadius: 5 }}
          />
        ))}
      </View>

      <View
        style={{
          paddingHorizontal: 12,
          paddingBottom: isAndroid ? 10 : 20,
        }}
      >
        <Input
          placeholder="Escribe tu mensaje"
          multiline
          numberOfLines={4}
          value={text}
          onChangeText={setText}
          leftIcon={
            <Button
              onPress={handlePickImages}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Ionicons name="attach-outline" size={22} color={'black'} />
            </Button>
          }
          rightIcon={
            <Button
              onPress={handleSendMessage}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Ionicons name="paper-plane-outline" size={22} color={'black'} />
            </Button>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CustomInputBox;
