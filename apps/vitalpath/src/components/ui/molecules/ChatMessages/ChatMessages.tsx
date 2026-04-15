import { FlatList, View } from 'react-native';
import {
  MessageItem,
  MessageItemImage,
  TextField,
} from '@/src/components/ui/atoms';

import {
  ImagesMessage,
  Message,
  TextMessage,
} from '@/src/interfaces/chat/chat.interface';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  messages: Message[];
  isGeminiWriting: boolean;
}

export const ChatMessages = ({ messages, isGeminiWriting }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        inverted
        style={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          if (item.type === 'text') {
            return (
              <MessageItem message={item as TextMessage} userColor="blue" />
            );
          }

          return (
            <MessageItemImage message={item as ImagesMessage} userColor="red" />
          );
        }}
      />
      {isGeminiWriting && (
        <Animated.View
          entering={FadeInDown}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: 'red',
          }}
        >
          <TextField>Gemini esta escribiendo...</TextField>
        </Animated.View>
      )}
    </View>
  );
};
