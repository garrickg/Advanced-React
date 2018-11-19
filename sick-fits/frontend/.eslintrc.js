module.exports = {
  extends: "airbnb",
  parser: "babel-eslint",
  settings: {
    "import/parser": "babel-eslint"
  },
  env: {
    "browser": true,
    "node": true
  },
  rules: {
    "linebreak-style": 0,
    "react/prop-types": 0,
    "react/jsx-one-expression-per-line": 0,
    "no-alert": 0,
    "no-restricted-globals": 0,
    "react/forbid-prop-types": 0,
    "react/no-array-index-key": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never"
      }
    ],
    "unicorn/catch-error-name": [
      "error",
      {
        name: "error"
      }
    ],
    "unicorn/explicit-length-check": "error",
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase"
      }
    ],
    "unicorn/no-abusive-eslint-disable": "error",
    "unicorn/no-process-exit": "error",
    "unicorn/throw-new-error": "error",
    "unicorn/number-literal-case": "error",
    "unicorn/escape-case": "error",
    "unicorn/no-array-instanceof": "error",
    "unicorn/no-new-buffer": "error",
    "unicorn/no-hex-escape": "error",
    "unicorn/custom-error-definition": "off",
    "unicorn/prefer-starts-ends-with": "error",
    "unicorn/prefer-type-error": "error",
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/import-index": "error",
    "unicorn/new-for-builtins": "error",
    "unicorn/regex-shorthand": "error",
    "unicorn/prefer-spread": "error",
    "unicorn/error-message": "error",
    "unicorn/no-unsafe-regex": "off",
    "unicorn/prefer-add-event-listener": "error"
  },
  plugins: ["graphql", "unicorn"]
};
