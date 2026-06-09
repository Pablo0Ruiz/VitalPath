import { useColorScheme } from 'react-native';
import { tokens, seniorThemes, type ThemeTokens } from '../constants/tokens';
import { useSeniorUIStore } from '../stores/seniorUI.store';

export const useTheme = (): ThemeTokens => {
  const colorScheme = useColorScheme();
  const isSeniorUI = useSeniorUIStore(s => s.isSeniorUI);
  const hasHydrated = useSeniorUIStore(s => s._hasHydrated);

  const mode = colorScheme === 'dark' ? 'dark' : 'light';

  if (!hasHydrated || !isSeniorUI) return tokens[mode];
  return seniorThemes[mode];
};
