import React from 'react';
import { View, ViewProps } from 'react-native';
import { TextField } from '../TextFiled';
import { badgeVariants, badgeVariantsText } from './Badge.variants';
import { VariantProps } from 'class-variance-authority';

export interface BadgeProps
  extends ViewProps, VariantProps<typeof badgeVariants> {
  label: string;
}

const Badge = ({
  label,
  variant = 'primary',
  className,
  ...props
}: BadgeProps) => {
  return (
    <View
      className={`${badgeVariants({ variant })} ${className ?? ''}`}
      {...props}
    >
      <TextField
        variant="caption"
        className={`${badgeVariantsText({ variant })}`}
      >
        {label}
      </TextField>
    </View>
  );
};

export default Badge;
