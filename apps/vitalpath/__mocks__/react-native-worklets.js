// Mock for react-native-worklets (native module required by react-native-reanimated)
module.exports = {
  initialize: jest.fn(),
  isConfigured: jest.fn(() => false),
  WorkletsModule: {},
};
