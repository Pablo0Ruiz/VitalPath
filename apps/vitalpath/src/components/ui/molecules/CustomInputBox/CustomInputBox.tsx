import Ionicons from '@expo/vector-icons/Ionicons';
import { ImagePickerAsset } from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Button, Input } from '@/src/components/ui/atoms';
import { getGalleryImages } from '@/src/core/actions/image-picker/get-gallery-images';
import { useTheme } from '@/src/hooks/useTheme';

export interface CustomInputBoxProps {
  onSendMessage: (message: string, attachments: ImagePickerAsset[]) => void;
}

const CustomInputBox = ({ onSendMessage }: CustomInputBoxProps) => {
  const isAndroid = Platform.OS === 'android';
  const t = useTheme();

  const [text, setText] = useState('');
  const [images, setImages] = useState<ImagePickerAsset[]>([]);

  const handleSendMessage = () => {
    if (!text.trim() && images.length === 0) return;
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
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[s.attachments, { borderTopColor: t.border }]}
          contentContainerStyle={s.attachmentsContent}
        >
          {images.map(image => (
            <Image
              key={image.uri}
              source={{ uri: image.uri }}
              style={s.attachmentImage}
            />
          ))}
        </ScrollView>
      )}
      <View
        style={[
          s.inputContainer,
          { borderTopColor: t.border, backgroundColor: t.background },
        ]}
      >
        <Input
          placeholder="Escribe un mensaje..."
          multiline
          numberOfLines={1}
          value={text}
          onChangeText={setText}
          leftIcon={
            <Button
              variant="ghost"
              onPress={handlePickImages}
              style={s.iconButton}
            >
              <Ionicons
                name="attach-outline"
                size={22}
                color={t.textSecondary}
              />
            </Button>
          }
          rightIcon={
            <Button
              variant="ghost"
              onPress={handleSendMessage}
              style={s.iconButton}
            >
              <Ionicons
                name="paper-plane-outline"
                size={22}
                color={text.trim() ? t.primary600 : t.textSecondary}
              />
            </Button>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  attachments: { paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1 },
  attachmentsContent: { gap: 8 },
  attachmentImage: { width: 48, height: 48, borderRadius: 8 },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: { padding: 0 },
});

export default CustomInputBox;
