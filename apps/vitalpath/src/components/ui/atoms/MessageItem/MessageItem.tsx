import { StyleSheet, View, useColorScheme } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { TextMessage } from '@repo/types';
import { useTheme } from '@/src/hooks/useTheme';

export interface MessageItemProps {
  message: TextMessage;
  userColor?: string;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const isCurrentUser = message.sender === 'user';
  const t = useTheme();
  const colorScheme = useColorScheme();

  const aiTextColor = colorScheme === 'dark' ? '#FFFFFF' : t.textPrimary;

  const userMarkdown = {
    body: { color: '#ffffff' },
    paragraph: { color: '#ffffff', marginBottom: 0 },
    text: { color: '#ffffff' },
  };
  const aiMarkdown = {
    body: { color: aiTextColor },
    paragraph: { color: aiTextColor, marginBottom: 0 },
    text: { color: aiTextColor },
  };

  return (
    <View
      style={[
        s.base,
        isCurrentUser
          ? { ...s.user, backgroundColor: t.primary600 }
          : {
              ...s.ai,
              backgroundColor: t.surfaceElevated,
              borderColor: t.border,
            },
      ]}
    >
      <Markdown style={isCurrentUser ? userMarkdown : aiMarkdown}>
        {message.text}
      </Markdown>
    </View>
  );
};

const s = StyleSheet.create({
  base: {
    marginVertical: 4,
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  user: { alignSelf: 'flex-end', borderRadius: 16, borderBottomRightRadius: 4 },
  ai: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
});

export default MessageItem;
