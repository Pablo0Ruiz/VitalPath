import { TextMessage } from '@repo/types';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { TextField } from '../TextFiled';

export interface MessageItemProps {
  message: TextMessage;
  userColor?: string;
}

const userMarkdown = {
  body: { color: '#ffffff' },
  paragraph: { color: '#ffffff', marginBottom: 0 },
  text: { color: '#ffffff' },
};

const aiMarkdown = {
  body: { color: '#1e293b' },
  paragraph: { color: '#1e293b', marginBottom: 0 },
  text: { color: '#1e293b' },
};

const MessageItem = ({ message }: MessageItemProps) => {
  const isCurrentUser = message.sender === 'user';

  return (
    <View
      style={{
        marginVertical: 3,
        maxWidth: '80%',
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
        backgroundColor: isCurrentUser ? '#7c3aed' : '#f8fafc',
        borderWidth: isCurrentUser ? 0 : 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderBottomRightRadius: isCurrentUser ? 4 : 16,
        borderBottomLeftRadius: isCurrentUser ? 16 : 4,
      }}
    >
      <TextField style={{ color: isCurrentUser ? '#ffffff' : '#1e293b' }}>
        <Markdown style={isCurrentUser ? userMarkdown : aiMarkdown}>
          {message.text}
        </Markdown>
      </TextField>
    </View>
  );
};

export default MessageItem;
