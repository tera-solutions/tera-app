const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Cần thiết nếu Trường dùng Expo Router
  isCSSEnabled: true,
});

const { transformer, resolver } = config;

// 1. Cấu hình Transformer cho SVG
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false, // Giúp bản Release của Tera-FNB mượt hơn
    },
  }),
};

// 2. Cấu hình Resolver cho SVG và Alias
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'tsx', 'ts', 'js', 'jsx', 'json', 'mjs', 'svg'],
};

module.exports = config;