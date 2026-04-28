import Ionicons from '@expo/vector-icons/Ionicons';
import { ImagePickerAsset } from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { getGalleryImages } from '@/src/core/actions/image-picker/get-gallery-images';
import { Input } from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ChatComposerProps {
  onSendMessage: (message: string, attachments: ImagePickerAsset[]) => void;
}

const ChatComposer = ({ onSendMessage }: ChatComposerProps) => {
  const isAndroid = Platform.OS === 'android';
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const [text, setText] = useState('');
  const [images, setImages] = useState<ImagePickerAsset[]>([]);

  const handleSend = () => {
    if (!text.trim() && images.length === 0) return;
    onSendMessage(text.trim(), images);
    setText('');
    setImages([]);
  };

  const handlePickImages = async () => {
    const selected = await getGalleryImages();
    if (selected.length === 0 || images.length >= 4) return;
    const slots = 4 - images.length;
    setImages([...images, ...selected.slice(0, slots)]);
  };

  const SEND_ACTIVE = t.primary600;
  const SEND_IDLE = t.neutral400;

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
          s.inputWrapper,
          { backgroundColor: t.background, paddingBottom: 12 + insets.bottom },
        ]}
      >
        <View
          style={[
            s.composer,
            { backgroundColor: t.surfaceElevated, shadowColor: '#000' },
          ]}
        >
          <Pressable
            onPress={handlePickImages}
            accessibilityLabel="Adjuntar imagen"
            style={({ pressed }) => [
              s.iconButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Ionicons name="attach-outline" size={22} color={SEND_IDLE} />
          </Pressable>

          <Input
            variant="bare"
            placeholder="Escribe un mensaje..."
            multiline
            numberOfLines={1}
            value={text}
            onChangeText={setText}
            style={s.input}
          />

          <Pressable
            onPress={handleSend}
            accessibilityLabel="Enviar mensaje"
            style={({ pressed }) => [
              s.iconButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Ionicons
              name="paper-plane-outline"
              size={22}
              color={text.trim() || images.length > 0 ? SEND_ACTIVE : SEND_IDLE}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  attachments: { paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1 },
  attachmentsContent: { gap: 8 },
  attachmentImage: { width: 48, height: 48, borderRadius: 8 },
  inputWrapper: { paddingHorizontal: 16, paddingTop: 12 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconButton: { padding: 4 },
  input: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 8,
    textAlignVertical: 'center',
  },
});

export default ChatComposer;
