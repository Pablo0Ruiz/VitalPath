import { FlatList, View } from 'react-native';
import {
  MessageItem,
  MessageItemImage,
  TextField,
} from '@/src/components/ui/atoms';

import { ImagesMessage, Message, TextMessage } from '@repo/types';
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
            paddingVertical: 8,
          }}
        >
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#f8fafc',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 16,
              borderBottomLeftRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#7c3aed',
                opacity: 0.5,
              }}
            />
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#7c3aed',
                opacity: 0.7,
              }}
            />
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#7c3aed',
              }}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
};
