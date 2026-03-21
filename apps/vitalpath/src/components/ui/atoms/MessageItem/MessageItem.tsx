import { TextMessage } from '@/src/interfaces/chat/chat.interface';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

export interface MessageItemProps {
  message: TextMessage;
  userColor: string;
}

const MessageItem = ({ message, userColor }: MessageItemProps) => {
  const isCurrentUser = message.sender === 'user';
  const markdownStyles = isCurrentUser
    ? {
        body: { color: 'white' },
        paragraph: { color: 'white' },
        text: { color: 'white' },
      }
    : {
        body: { color: 'black' },
        paragraph: { color: 'black' },
        text: { color: 'black' },
      };

  return (
    <View
      style={{
        marginVertical: 4,
        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        backgroundColor: isCurrentUser ? userColor : '#EBEBEB',
        padding: 10,
        borderRadius: 16,
        borderBottomLeftRadius: isCurrentUser ? 0 : 16,
        borderBottomRightRadius: isCurrentUser ? 16 : 0,
        maxWidth: '80%',
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
      }}
    >
      <Text style={{ color: isCurrentUser ? 'white' : 'black' }}>
        <Markdown style={markdownStyles}>{message.text}</Markdown>
      </Text>
    </View>
  );
};

export default MessageItem;
