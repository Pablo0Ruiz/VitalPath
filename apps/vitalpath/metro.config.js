const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolve the @ alias the same way tsconfig.json does ("@/*": ["./*"])
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
};

module.exports = withNativeWind(config, { input: './global.css' });
