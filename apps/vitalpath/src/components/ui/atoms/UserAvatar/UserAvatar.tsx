import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { TextField } from '../TextField';
import {
  userAvatarContainerStyles,
  userAvatarTextStyles,
  userAvatarStatusDotStyles,
  type UserAvatarVariants,
} from './UserAvatar.variants';
import { useTheme } from '@/src/hooks/useTheme';

export interface UserAvatarProps extends ViewProps, UserAvatarVariants {
  name?: string;
  image?: ImageSourcePropType;
  showStatus?: boolean;
}

const UserAvatar = ({
  name,
  image,
  showStatus = false,
  size = 'md',
  style,
  ...props
}: UserAvatarProps) => {
  const t = useTheme();

  const initials = (name ?? '')
    .trim()
    .split(/\s+/)
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[s.outer, style]} {...props}>
      <View
        style={[
          s.inner,
          userAvatarContainerStyles[size],
          { backgroundColor: t.primary600 },
        ]}
      >
        {image ? (
          <Image source={image} style={s.image} resizeMode="cover" />
        ) : (
          <TextField
            variant="caption"
            style={[userAvatarTextStyles[size], s.initialsText]}
          >
            {initials}
          </TextField>
        )}
      </View>
      {showStatus && (
        <View
          style={[
            s.statusDot,
            userAvatarStatusDotStyles[size],
            { backgroundColor: t.online, borderColor: t.background },
          ]}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  outer: { position: 'relative' },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  initialsText: { textAlign: 'center' },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 9999,
    borderWidth: 2,
  },
});

export default UserAvatar;
