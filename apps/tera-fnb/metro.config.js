const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// 1. Xác định các đường dẫn trong Monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot, {
  isCSSEnabled: true,
});

// 2. Cấu hình WatchFolders (Để Metro thấy được packages/shared như tera-dls)
config.watchFolders = [workspaceRoot];

// 3. Cấu hình Resolver & Transformer
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true, // Senior Tip: Bật true giúp khởi động App F&B nhanh hơn
    },
  }),
};

config.resolver = {
  ...resolver,
  // SVG Configuration
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'tsx', 'ts', 'js', 'jsx', 'json', 'mjs', 'svg'],

  // FIX LỖI "useMemoCache of null" & "Invalid Hook Call"
  // Ép Metro luôn dùng React từ node_modules của App hiện tại
  disableHierarchicalLookup: true, 
  extraNodeModules: {
    'react': path.resolve(projectRoot, 'node_modules/react'),
    'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  },
  
  // Thứ tự tìm kiếm ưu tiên (Pnpm Symlinks)
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
};

module.exports = config;