import { vars } from 'nativewind';
import { lightTheme } from './themes/light';
import { darkTheme } from './themes/dark';

export const themes = {
  light: vars(lightTheme),
  dark: vars(darkTheme),
};

export { lightTheme, darkTheme };

export type ThemeKey = 'light' | 'dark';
