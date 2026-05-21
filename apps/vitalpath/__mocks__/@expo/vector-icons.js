// Mock for @expo/vector-icons and its sub-packages (Ionicons, Feather, Octicons, etc.)
const React = require('react');
const { Text } = require('react-native');

const iconComponent = ({ name, size, color, testID }) =>
  React.createElement(Text, { testID: testID || `icon-${name}` }, name);

const handler = {
  get: function (target, prop) {
    if (prop === '__esModule') return false;
    if (prop === 'default') return iconComponent;
    // Allow .glyphMap access for type inference
    if (prop === 'glyphMap') return {};
    return iconComponent;
  },
};

module.exports = new Proxy({}, handler);
