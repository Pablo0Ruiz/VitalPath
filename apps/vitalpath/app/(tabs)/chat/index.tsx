import { Octicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { TextField } from '@/src/components/ui/atoms';
import { ChatMessages } from '@/src/components/ui/molecules/ChatMessages/ChatMessages';
import { CustomInputBox } from '@/src/components/ui/molecules';
import { useChatContextStore } from '@repo/store';
import { getChatStream } from '@/src/core/actions/chat-stream.actions';
import { appointmentKeys } from '@repo/api-client';

const Chat = () => {
  const queryClient = useQueryClient();
  const messages = useChatContextStore(state => state.messages);
  const addMessage = useChatContextStore(state => state.addMessage);
  const geminiWriting = useChatContextStore(state => state.geminiWriting);

  const handleSendMessage = async (prompt: string, attachments: any[]) => {
    await addMessage(prompt, attachments, getChatStream);
    queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center px-5 py-3 border-b border-brand-slate-100">
        <View className="w-8 h-8 rounded-full bg-brand-violet-600 items-center justify-center mr-3">
          <Octicons name="dependabot" size={15} color="white" />
        </View>
        <View>
          <TextField
            variant="body"
            className="text-brand-slate-900 font-semibold text-[15px] text-left"
          >
            VitalPath AI
          </TextField>
          <View className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-success mr-1" />
            <TextField
              variant="caption"
              className="text-brand-slate-400 text-xs text-left"
            >
              En línea
            </TextField>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-white">
        <ChatMessages messages={messages} isGeminiWriting={geminiWriting} />
      </View>
      <CustomInputBox onSendMessage={handleSendMessage} />
    </SafeAreaView>
  );
};

export default Chat;
