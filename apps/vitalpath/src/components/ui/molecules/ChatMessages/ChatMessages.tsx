import { FlatList, View } from 'react-native';
import { MessageItem, MessageItemImage } from '@/src/components/ui/atoms';

import {
  ImagesMessage,
  Message,
  TextMessage,
} from '@/src/interfaces/chat/chat.interface';

interface Props {
  messages: Message[];
}

export const ChatMessages = ({ messages }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        inverted
        style={{ paddingHorizontal: 16 }}
        keyExtractor={(_, index) => index.toString()}
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
    </View>
  );
};
