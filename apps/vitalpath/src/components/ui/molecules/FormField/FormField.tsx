import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { TextInputProps } from 'react-native';

import { Input } from '../../atoms';
import { TextField } from '../../atoms';

interface FormFieldProps extends TextInputProps {
  label: string;
  rightLabel?: string;
  rightLabelOnPress?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputVariant?: 'primary' | 'secondary';
  helperText?: string;
}

const FormField = ({
  label,
  helperText,
  rightLabel,
  rightLabelOnPress,
  leftIcon,
  rightIcon,
  inputVariant = 'primary',
  className,
  ...inputProps
}: FormFieldProps) => {
  return (
    <View className={`mb-4 ${className ?? ''}`}>
      <View className="flex-row justify-between items-center mb-1.5">
        <TextField
          variants="body"
          className="text-left text-sm text-brand-slate-700"
        >
          {label}
        </TextField>
        {rightLabel && (
          <TextField
            variants="caption"
            className="text-brand-violet-900"
            onPress={rightLabelOnPress}
          >
            {rightLabel}
          </TextField>
        )}
      </View>
      <Input
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        variant={inputVariant}
        {...inputProps}
      />
      {helperText && (
        <TextField
          variants="caption"
          className="text-left text-sm text-brand-slate-700"
        >
          {helperText}
        </TextField>
      )}
    </View>
  );
};

export default FormField;
