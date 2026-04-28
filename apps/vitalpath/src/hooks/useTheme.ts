import { useColorScheme } from 'react-native';
import { tokens, type ThemeTokens } from '../constants/tokens';

export const useTheme = (): ThemeTokens => {
  const colorScheme = useColorScheme();
  return tokens[colorScheme === 'dark' ? 'dark' : 'light'];
};
