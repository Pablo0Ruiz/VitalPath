import React from 'react';
import { View, ViewProps } from 'react-native';
import { TextField } from '../TextFiled';
import { baseBadge, badgeVariants } from './Badge.variants';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: keyof typeof badgeVariants;
}

const Badge = ({
  label,
  variant = 'primary',
  className,
  ...props
}: BadgeProps) => {
  const styles = badgeVariants[variant];
  return (
    <View
      className={`${baseBadge} ${styles.container} ${className ?? ''}`}
      {...props}
    >
      <TextField variants="caption" className={`${styles.text}`}>
        {label}
      </TextField>
    </View>
  );
};

export default Badge;
