const baseConfig = require('@repo/eslint-config');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...(Array.isArray(baseConfig) ? baseConfig : [baseConfig]),
];
