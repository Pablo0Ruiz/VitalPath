export const onboardingContentVariants = {
  container:
    'relative z-20 flex flex-col w-full bg-white dark:bg-[#0f1819] pt-8 pb-12 rounded-t-[2.5rem]',
  wrapper: 'px-8 flex flex-col items-center text-center',
  headlineWrapper: 'pt-0 pb-4',
  bodyWrapper: 'pb-10 max-w-md mx-auto',
  indicatorsWrapper: 'flex flex-row items-center justify-center gap-2 mb-10',
  buttonWrapper: 'w-full flex justify-center pb-4 px-4',
};

export type OnboardingContentVariants = typeof onboardingContentVariants;
