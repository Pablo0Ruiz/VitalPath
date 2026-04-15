import React from 'react';
import { Image, ImageSourcePropType, View, ViewProps } from 'react-native';
import { TextField } from '../TextFiled';
import { avatarSizes, avatarText } from './Avatar.variants';
import { VariantProps } from 'class-variance-authority';

export interface AvatarProps
  extends ViewProps, VariantProps<typeof avatarSizes> {
  initials?: string;
  image?: ImageSourcePropType | undefined;
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
  return (
    <View className={`${avatarSizes({ size })} ${className ?? ''}`} {...props}>
      {image ? (
        <Image source={image} className="w-12 h-12" />
      ) : (
        <TextField
          variant="caption"
          className={`${avatarText({ size })} text-center`}
          style={textColor ? { color: textColor } : undefined}
        >
          {initials}
        </TextField>
      )}
    </View>
  );
};

export default Avatar;
