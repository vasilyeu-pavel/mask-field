const path = require("path");

module.exports = {
  "stories": [
      "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
      "storybook-css-modules-preset",
  ],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials"],
  "framework": "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    // get index of css rule
    const ruleCssIndex = config.module.rules.findIndex(
        (rule) => rule.test.toString() === "/\\.css$/"
    );

    // map over the 'use' array of the css rule and set the 'module' option to true
    config.module.rules[ruleCssIndex].use.map((item) => {
      if (item.loader && item.loader.includes("/css-loader/")) {
        item.options.modules = {
          mode: "local",
          localIdentName:
              configType === "PRODUCTION"
                  ? "[local]__[hash:base64:5]"
                  : "[name]__[local]__[hash:base64:5]",
        };
      }

      return item;
    });

    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../"),
    });

    return config;
  },
  core: {
    builder: "webpack5"
  }
};
