// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// config.resolver.sourceExts.push("cjs");

// // This is the new line you should add in, after the previous lines
// config.resolver.unstable_enablePackageExports = false;
// module.exports = config;
// // module.exports = withNativeWind(config, { input: "./app/global.css" });
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

// Add support for .cjs files
config.resolver.sourceExts.push("cjs");

// Disable unstable package exports to prevent resolution issues
config.resolver.unstable_enablePackageExports = false;

// Wrap the config with NativeWind support
config = withNativeWind(config);

module.exports = config;
