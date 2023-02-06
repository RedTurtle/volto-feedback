module.exports = function (api) {
  api.cache(true);
  const presets = ['razzle/babel'];
  const plugins = [
    [
      'react-intl', // React Intl extractor, required for the whole i18n infrastructure to work
      {
        messagesDir: './build/messages/',
      },
    ],
    '@babel/plugin-proposal-export-default-from',
  ];

  return {
    plugins,
    presets,
  };
};
