import {
  ImagesMessage,
  TextMessage,
} from '@/src/interfaces/chat/chat.interface';
import { Fragment } from 'react';
import { Image, View } from 'react-native';
import { MessageItem } from '../MessageItem';

export interface MessageItemImageProps {
  message: ImagesMessage;
  userColor: string;
}

const MessageItemImage = ({ message, userColor }: MessageItemImageProps) => {
  const isCurrentUser = message.sender === 'user';
  const isMultipleImages = message.images && message.images.length > 1;

  return (
    <Fragment>
      <View
        style={{
          marginVertical: 4,
          alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
          backgroundColor: 'transparent',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {message.images &&
            message.images.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={{
                  width: isMultipleImages ? 150 : 250,
                  height: isMultipleImages ? 150 : 200,
                  borderRadius: 12,
                }}
                resizeMode="cover"
              />
            ))}
        </View>
      </View>
      {message.text && (
        <MessageItem message={message as TextMessage} userColor={userColor} />
      )}
    </Fragment>
  );
};

export default MessageItemImage;
