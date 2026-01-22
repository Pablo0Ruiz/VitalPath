export const inputVariants = {
  container: 'w-full mb-2',
  label: 'text-[#0f1819] text-base font-medium mb-2',
  inputWrapper: 'relative',
  base: 'w-full border border-gray-200 rounded-2xl px-4 py-4 text-base bg-white',
  iconLeft: 'absolute left-4 top-1/2 -translate-y-1/2 z-10',
  iconRight: 'absolute right-4 top-1/2 -translate-y-1/2 z-10',
  error: 'text-red-500 text-sm mt-1',
  success: 'border-green-500',
};

export type InputVariants = keyof typeof inputVariants;
