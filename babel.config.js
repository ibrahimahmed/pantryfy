module.exports = function (api) {
  const platform = api.caller((caller) => caller?.platform);
  api.cache.using(() => platform ?? "default");

  const isWeb = platform === "web";

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Transform import.meta → {} on web to fix "Cannot use import.meta outside a module"
      // Zustand 5.x uses import.meta.env which Metro doesn't support in non-module scripts
      ...(isWeb
        ? [
            function ({ types: t }) {
              return {
                visitor: {
                  MetaProperty(path) {
                    path.replaceWith(t.objectExpression([]));
                  },
                },
              };
            },
          ]
        : []),
      "react-native-reanimated/plugin",
    ],
  };
};
