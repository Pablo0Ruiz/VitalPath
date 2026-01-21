export const onboardingHeroVariants = {
  container:
    '@container w-full relative z-10 flex flex-col items-center justify-start pt-8',
  wrapper: 'w-full px-8 h-[50vh] flex flex-col justify-center',
  imageContainer:
    'relative w-full h-full rounded-[2rem] overflow-visible bg-transparent flex items-center justify-center',
  overlay:
    'absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent',
  bgGradient:
    'absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#f0f9fa] via-[#fafbfc] to-white dark:from-[#1a3238] dark:via-transparent dark:to-transparent pointer-events-none z-0',
  bgBlur:
    'absolute top-[20%] left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-400/15 rounded-full blur-[100px] pointer-events-none z-0',
};

export type OnboardingHeroVariants = typeof onboardingHeroVariants;
