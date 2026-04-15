import React from 'react';
import { Image, ImageSourcePropType, View, ViewProps } from 'react-native';
import { TextField } from '../TextFiled';
import { baseAvatar, avatarSizes } from './Avatar.variants';

export interface AvatarProps extends ViewProps {
  initials?: string;
  image?: ImageSourcePropType | undefined;
  size?: keyof typeof avatarSizes;
  textColor?: string;
}

const Avatar = ({
  initials,
  size = 'md',
  textColor,
  image,
  className,
  ...props
}: AvatarProps) => {
  const sizeStyles = avatarSizes[size];
  return (
    <View
      className={`${baseAvatar} ${sizeStyles.container} ${className ?? ''}`}
      {...props}
    >
      {image ? (
        <Image source={image} className="w-12 h-12" />
      ) : (
        <TextField
          variant="caption"
          className={`${sizeStyles.text} text-center`}
          style={textColor ? { color: textColor } : undefined}
        >
          {initials}
        </TextField>
      )}
    </View>
  );
};

export default Avatar;
