/**
 * VitalPath AI - Design System
 * Punto de entrada central para usar en componentes
 */

const { colors } = require('./colors');
const { fontSize, fontWeight, letterSpacing } = require('./typography');
const { spacing, borderRadius } = require('./spacing');

// ============================================
// THEME TOKENS
// ============================================

const lightTheme = {
  background: {
    primary: colors.neutral[0],
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
    accent: colors.accent.light,
  },
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[500],
    tertiary: colors.neutral[400],
    link: colors.primary[400],
  },
  border: {
    light: colors.neutral[200],
    DEFAULT: colors.neutral[300],
    focus: colors.primary[400],
  },
};

const darkTheme = {
  background: {
    primary: colors.neutral[900],
    secondary: colors.neutral[800],
    tertiary: colors.neutral[700],
    accent: colors.accent.dark,
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[400],
    tertiary: colors.neutral[500],
    link: colors.primary[400],
  },
  border: {
    light: colors.neutral[700],
    DEFAULT: colors.neutral[600],
    focus: colors.primary[400],
  },
};

// ============================================
// EXPORTS
// ============================================

export {
  // Tokens base
  colors,
  fontSize,
  fontWeight,
  letterSpacing,
  spacing,
  borderRadius,

  // Themes
  lightTheme,
  darkTheme,
};
