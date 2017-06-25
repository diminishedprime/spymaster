module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:redux-saga/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
    },
    "sourceType": "module",
  },
  "plugins": [
    "react",
    "redux-saga",
    "import",
  ],
  "rules": {
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "VariableDeclarator": {
        "var": 2,
        "let": 2,
        "const": 3,
      }}],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "array-callback-return": ["error"],
    "block-scoped-var": ["error"],
    "consistent-return": ["error"],
    "eqeqeq": ["error"],
    "no-eval": ["error"],
    "no-implicit-globals": ["error"],
    "no-multi-spaces": ["error"],
    "no-new": ["error"],
    "no-new-func": ["error"],
    "no-new-wrappers": ["error"],
    "no-return-assign": ["error"],
    "no-sequences": ["error"],
    "no-unmodified-loop-condition": ["error"],
    "no-warning-comments": ["error"],
    "no-use-before-define": ["error"],
    "brace-style": ["error"],
    "camelcase": ["error"],
    "comma-dangle": ["error", "always-multiline"],
    "comma-style": ["error", "last"],
    "func-style": ["error", "expression", {"allowArrowFunctions": true}],
    "newline-per-chained-call": ["error"],
    "no-trailing-spaces": ["error"],
    "arrow-parens": ["error"],
    "arrow-spacing": ["error"],
    "generator-star-spacing": ["error", {"before": false, "after": true}],
    "no-var": ["error"],
    "prefer-const": ["error"],
    "prefer-arrow-callback": ["error"],
    "prefer-rest-params": ["error"],
    "prefer-spread": ["error"],
    "no-unused-vars": ["error", {"argsIgnorePattern": "^_$"}],
    "react/prop-types": "off",
    "redux-saga/no-unhandled-errors": "off",

    "import/order": ["error", {"newlines-between": "always"}],
    "import/namespace": ["error"],
  }
}
