import { ImagesMessage, TextMessage } from '@repo/types';
import { Fragment } from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
        style={[
          s.container,
          { alignItems: isCurrentUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        <View style={s.imageGrid}>
          {message.images &&
            message.images.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={[
                  s.image,
                  {
                    width: isMultipleImages ? 140 : 240,
                    height: isMultipleImages ? 140 : 180,
                  },
                ]}
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

const s = StyleSheet.create({
  container: { marginVertical: 4, backgroundColor: 'transparent' },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  image: { borderRadius: 12 },
});

export default MessageItemImage;
