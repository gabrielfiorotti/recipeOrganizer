module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        // Add any other global variables your app relies on.
      },
    },
    extends: ["eslint:recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
