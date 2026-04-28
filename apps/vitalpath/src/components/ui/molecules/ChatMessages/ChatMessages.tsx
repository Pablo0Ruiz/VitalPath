import { FlatList, StyleSheet, View } from 'react-native';
import { MessageItem, MessageItemImage } from '@/src/components/ui/atoms';

import { ImagesMessage, Message, TextMessage } from '@repo/types';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/src/hooks/useTheme';

interface Props {
  messages: Message[];
  isGeminiWriting: boolean;
}

export const ChatMessages = ({ messages, isGeminiWriting }: Props) => {
  const t = useTheme();

  return (
    <View style={s.container}>
      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id}
        style={s.list}
        renderItem={({ item }) => {
          if (item.type === 'text') {
            return <MessageItem message={item as TextMessage} />;
          }

          return (
            <MessageItemImage
              message={item as ImagesMessage}
              userColor="primary"
            />
          );
        }}
      />
      {isGeminiWriting && (
        <Animated.View entering={FadeInDown} style={s.writingContainer}>
          <View
            style={[
              s.dotsContainer,
              {
                backgroundColor: t.surfaceElevated,
                borderColor: t.border,
              },
            ]}
          >
            <View
              style={[s.dot, { backgroundColor: t.primary600, opacity: 0.5 }]}
            />
            <View
              style={[s.dot, { backgroundColor: t.primary600, opacity: 0.7 }]}
            />
            <View style={[s.dot, { backgroundColor: t.primary600 }]} />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 16 },
  writingContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  dotsContainer: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
