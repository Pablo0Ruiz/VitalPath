import { StyleSheet, View, ViewProps } from 'react-native';
import { iconBoxSizeStyles, type IconBoxSize } from './IconBox.variants';

export interface IconBoxProps extends ViewProps {
  children: React.ReactNode;
  size?: IconBoxSize;
}

const IconBox = ({ children, size = 'md', style, ...props }: IconBoxProps) => {
  return (
    <View style={[s.base, iconBoxSizeStyles[size], style]} {...props}>
      {children}
    </View>
  );
};

const s = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
});

export default IconBox;
