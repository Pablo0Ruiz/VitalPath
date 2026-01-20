const baseConfig = require('@repo/eslint-config');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  ...(Array.isArray(baseConfig) ? baseConfig : [baseConfig]),
];
