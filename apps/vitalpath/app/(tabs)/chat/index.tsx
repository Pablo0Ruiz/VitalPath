import { ChatMessages } from '@/src/components/ui/molecules/ChatMessages/ChatMessages';
import { CustomInputBox } from '@/src/components/ui/molecules';
import { View } from 'react-native';
import { useChatContextStore } from '@/src/store/chat-context/chatContext.store';

const Chat = () => {
  const messages = useChatContextStore(state => state.messages);
  const addMessage = useChatContextStore(state => state.addMessage);
  const geminiWriting = useChatContextStore(state => state.geminiWriting);

  return (
    <View style={{ flex: 1 }}>
      <ChatMessages messages={messages} />

      <CustomInputBox onSendMessage={addMessage} />
    </View>
  );
};

export default Chat;
