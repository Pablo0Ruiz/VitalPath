import React from 'react';
import { View, ViewProps } from 'react-native';
import { baseIconBox, iconBoxSizes } from './IconBox.variants';

export interface IconBoxProps extends ViewProps {
  children: React.ReactNode;
  size?: keyof typeof iconBoxSizes;
}

const IconBox = ({
  children,
  size = 'md',
  className,
  ...props
}: IconBoxProps) => {
  return (
    <View
      className={`${baseIconBox} ${iconBoxSizes[size]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
};

export default IconBox;
