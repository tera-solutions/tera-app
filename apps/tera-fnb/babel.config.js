module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@app': './src/app',
            '@common': './src/_common',
            '@components': './src/components',
            '@types': './src/types',
            '@constants': './src/_common/constants',
            '@hooks': './src/_common/hooks',
            '@layouts': './src/_common/layouts',
            '@utils': './src/_common/utils',
            '@provider': './src/_common/provider',
            '@assets': './src/assets',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@stores': './src/stores',
            '@services': './src/services',
            '@databases': './src/databases',
            '@styles': './src/styles',
            '@modules': './src/modules',
            '@ecommerce': './src/modules/ecommerce',
            '@finance': './src/modules/finance',
            '@setting': './src/modules/setting',
            '@logistic': './src/modules/logistic',
            '@marketing': './src/modules/marketing',
            '@operation': './src/modules/operation',
            '@purchase': './src/modules/purchase',
            '@sale': './src/modules/sale',
            '@warehouse': './src/modules/warehouse',
          },
        },
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'react-native-reanimated/plugin',
    ],
  };
};
