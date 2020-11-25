module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    node: true,
    mocha: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
  ],

  rules: {
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/interface-name-prefix": [2, "always"],
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/camelcase": [
      2,
      { properties: "never", ignoreDestructuring: true },
    ],
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: false, variables: false },
    ],
    // note you must disable the base rule as it can report incorrect errors
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^__",
        argsIgnorePattern: "^__",
        ignoreRestSiblings: true,
      },
    ],
  },
  overrides: [
    {
      files: ["*.tsx?"],
      rules: {
        "@typescript-eslint/no-var-requires": "error",
      },
    },
  ],
};
