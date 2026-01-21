import {
  BodyText,
  HeadlineText,
  PageIndicator,
  ButtonAuth,
} from '@/components/ui/atoms';
import { View, ViewProps } from 'react-native';
import { onboardingContentVariants } from './OnboardingContent.variants';

export interface OnboardingContentProps extends ViewProps {
  headline: string;
  highlightedText?: string;
  bodyText: string;
  currentPage?: number;
  totalPages?: number;
  buttonTitle: string;
  buttonIcon?: React.ReactNode;
  onButtonPress: () => void;
}

const OnboardingContent = ({
  headline,
  highlightedText,
  bodyText,
  currentPage = 1,
  totalPages = 3,
  buttonTitle,
  buttonIcon,
  onButtonPress,
  className,
  ...props
}: OnboardingContentProps) => {
  return (
    <View
      className={`${onboardingContentVariants.container} ${className || ''}`}
      {...props}
    >
      <View className={onboardingContentVariants.wrapper}>
        <View className={onboardingContentVariants.headlineWrapper}>
          <HeadlineText text={headline} highlightedText={highlightedText} />
        </View>

        <View className={onboardingContentVariants.bodyWrapper}>
          <BodyText text={bodyText} />
        </View>

        <View className={onboardingContentVariants.indicatorsWrapper}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PageIndicator key={index} isActive={index + 1 === currentPage} />
          ))}
        </View>

        <View className={onboardingContentVariants.buttonWrapper}>
          <ButtonAuth
            title={buttonTitle}
            onPress={onButtonPress}
            icon={buttonIcon}
          />
        </View>
      </View>
    </View>
  );
};

export default OnboardingContent;
