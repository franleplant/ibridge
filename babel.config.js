const isJest = process.env.NODE_ENV === "test";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: isJest
          ? {
              node: true,
            }
          : undefined,
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: ["@babel/plugin-proposal-class-properties"],
};
