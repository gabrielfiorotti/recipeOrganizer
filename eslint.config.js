const recommended = require("eslint/conf/eslint-recommended");

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },
    rules: {
      ...recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
