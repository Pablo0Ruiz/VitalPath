import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { TextField } from '../TextField';
import {
  avatarSizeStyles,
  avatarTextStyles,
  type AvatarSize,
} from './Avatar.variants';

export interface AvatarProps extends ViewProps {
  size?: AvatarSize;
  initials?: string;
  image?: ImageSourcePropType;
  textColor?: string;
}

const Avatar = ({
  initials,
  size = 'md',
  textColor,
  image,
  style,
  ...props
}: AvatarProps) => {
  return (
    <View style={[s.base, avatarSizeStyles[size], style]} {...props}>
      {image ? (
        <Image source={image} style={s.image} />
      ) : (
        <TextField
          variant="caption"
          style={[
            avatarTextStyles[size],
            s.text,
            textColor ? { color: textColor } : undefined,
          ]}
        >
          {initials}
        </TextField>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: 9999 },
  image: { width: 48, height: 48 },
  text: { textAlign: 'center' },
});

export default Avatar;
