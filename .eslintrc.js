module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    node: true,
    jest: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
  ],

  rules: {
    "@typescript-eslint/triple-slash-reference": 0,

    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: true,
        },
      },
    ],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: false, variables: false },
    ],
    // note you must disable the base rule as it can report incorrect errors
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },

  overrides: [
    {
      files: ["*.test.ts"],
      rules: {
        // there is a lot of faking in tests so any becomes a necessity,
        // so that we are able to fake stuff without faking EVERYTHING
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
