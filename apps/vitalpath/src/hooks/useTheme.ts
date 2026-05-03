import { useColorScheme } from 'react-native';
import { tokens, seniorTokens, type ThemeTokens } from '../constants/tokens';
import { useSeniorUIStore } from '../stores/seniorUI.store';

export const useTheme = (): ThemeTokens => {
  const colorScheme = useColorScheme();
  const { isSeniorUI, _hasHydrated } = useSeniorUIStore();
  const base = tokens[colorScheme === 'dark' ? 'dark' : 'light'];
  if (!_hasHydrated || !isSeniorUI) return base;
  return { ...base, ...seniorTokens } as ThemeTokens;
};
