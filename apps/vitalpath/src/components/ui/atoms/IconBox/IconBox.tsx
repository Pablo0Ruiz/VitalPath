import React from 'react';
import { View, ViewProps } from 'react-native';
import { iconBoxVariants } from './IconBox.variants';
import { VariantProps } from 'class-variance-authority';

export interface IconBoxProps
  extends ViewProps, VariantProps<typeof iconBoxVariants> {
  children: React.ReactNode;
}

const IconBox = ({
  children,
  size = 'md',
  className,
  ...props
}: IconBoxProps) => {
  return (
    <View
      className={`${iconBoxVariants({ size })} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
};

export default IconBox;
