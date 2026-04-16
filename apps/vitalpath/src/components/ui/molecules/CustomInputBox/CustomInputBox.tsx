import Ionicons from '@expo/vector-icons/Ionicons';
import { ImagePickerAsset } from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

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
    onSendMessage(text.trim(), images);
    setText('');
    setImages([]);
  };

  const handlePickImages = async () => {
    const selectedImages = await getGalleryImages();
    if (selectedImages.length === 0 || images.length >= 4) return;
    const availableSlots = 4 - images.length;
    setImages([...images, ...selectedImages.slice(0, availableSlots)]);
  };

  return (
    <KeyboardAvoidingView
      behavior={isAndroid ? 'height' : 'padding'}
      keyboardVerticalOffset={isAndroid ? 0 : 85}
    >
      {/* Image previews */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2 border-t border-brand-slate-100"
          contentContainerStyle={{ gap: 8 }}
        >
          {images.map(image => (
            <Image
              key={image.uri}
              source={{ uri: image.uri }}
              className="w-12 h-12 rounded-lg"
            />
          ))}
        </ScrollView>
      )}

      {/* Input bar */}
      <View className="border-t border-brand-slate-100 px-4 py-3 bg-white">
        <Input
          placeholder="Escribe un mensaje..."
          multiline
          numberOfLines={4}
          value={text}
          onChangeText={setText}
          leftIcon={
            <Button
              onPress={handlePickImages}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Ionicons name="attach-outline" size={22} color="#94a3b8" />
            </Button>
          }
          rightIcon={
            <Button
              onPress={handleSendMessage}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Ionicons
                name="paper-plane-outline"
                size={22}
                color={text.trim() ? '#7c3aed' : '#94a3b8'}
              />
            </Button>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CustomInputBox;
