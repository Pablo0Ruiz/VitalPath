import { View, ViewProps } from 'react-native';
import { TextField } from '../TextFiled';
import { tabsVariants, textStyles } from './Tabs.variants';

export interface TabsProps extends ViewProps {
  label: string;
  variant?: 'date' | 'active' | 'pending';
}

const Tabs = ({ label, variant = 'date', className, ...props }: TabsProps) => {
  return (
    <View
      className={`px-3 py-1 rounded-xl ${tabsVariants({ variant })} ${className ?? ''}`}
      {...props}
    >
      <TextField
        variant="caption"
        className={`font-bold ${textStyles({ variant })}`}
      >
        {label}
      </TextField>
    </View>
  );
};

export default Tabs;
