/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@expo/vector-icons.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@ui-kitten/components|react-native-reanimated|react-native-safe-area-context))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@expo/vector-icons$': '<rootDir>/__mocks__/@expo/vector-icons.js',
    '^@expo/vector-icons/(.*)$': '<rootDir>/__mocks__/@expo/vector-icons.js',
    '^react-native-worklets$': '<rootDir>/__mocks__/react-native-worklets.js',
    '^expo-notifications$': '<rootDir>/__mocks__/expo-notifications.js',
    '^@react-native-community/datetimepicker$': '<rootDir>/__mocks__/empty.js',
  },
};
