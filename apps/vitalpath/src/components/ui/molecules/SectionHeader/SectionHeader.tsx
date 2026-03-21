import React from 'react';
import { View, TouchableOpacity, ViewProps } from 'react-native';
import { TextField } from '../../atoms';

export interface SectionHeaderProps extends ViewProps {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
}

const SectionHeader = ({
  title,
  linkLabel,
  onLinkPress,
  className,
  ...props
}: SectionHeaderProps) => {
  return (
    <View
      className={`flex-row items-center justify-between mb-2.5 mt-1 ${className ?? ''}`}
      {...props}
    >
      <TextField
        variants="body"
        className="text-brand-slate-800 text-[17px] font-bold text-left"
      >
        {title}
      </TextField>
      {linkLabel && onLinkPress && (
        <TouchableOpacity onPress={onLinkPress}>
          <TextField
            variants="caption"
            className="text-brand-violet-600 font-semibold text-[13px]"
          >
            {linkLabel}
          </TextField>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
