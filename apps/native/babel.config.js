module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [
      [
        'react-native-reanimated/plugin',
        {
          globals: ['__reanimatedLoggerConfig'],
        },
      ],
    ],
    env: {
      production: {
        plugins: ['react-native-reanimated/plugin'],
      },
    },
  };
};
