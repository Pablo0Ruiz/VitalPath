import { View, ViewProps } from 'react-native';
import { pageIndicatorVariants } from './PageIndicator.variants';

export interface PageIndicatorProps extends ViewProps {
  isActive?: boolean;
}

const PageIndicator = ({
  isActive = false,
  className,
  ...props
}: PageIndicatorProps) => {
  const variant = isActive
    ? pageIndicatorVariants.active
    : pageIndicatorVariants.inactive;

  return <View className={`${variant.base} ${className || ''}`} {...props} />;
};

export default PageIndicator;
