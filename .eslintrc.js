module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "simple-import-sort", "jsx-a11y"],
  "extends": ["./configs/.eslintrc-base.js", "eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:@typescript-eslint/recommended", "plugin:jsx-a11y/recommended", "plugin:storybook/recommended"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "no-console": "off",
    "react/no-unescaped-entities": "off",
    "no-use-before-define": "off",
    "react-hooks/exhaustive-deps": "error",
    "lines-between-class-members": ["error", "always", {
      "exceptAfterSingleLine": true
    }],
    "padding-line-between-statements": ["error", {
      blankLine: "always",
      prev: "*",
      next: ["class", "const", "let", "export"]
    }, {
      blankLine: "always",
      prev: ["class", "const", "let", "export"],
      next: "*"
    }, {
      blankLine: "any",
      prev: ["const", "let", "export"],
      next: ["const", "let", "export"]
    }, {
      blankLine: "always",
      prev: "*",
      next: ["multiline-const", "multiline-block-like", "multiline-expression"]
    }, {
      blankLine: "always",
      prev: ["multiline-const", "multiline-block-like", "multiline-expression"],
      next: "*"
    }, {
      blankLine: "any",
      prev: ["case", "default"],
      next: ["case", "default"]
    }, {
      blankLine: "always",
      prev: "*",
      next: "return"
    }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/naming-convention": ["error", {
      "selector": "interface",
      "format": ["PascalCase"],
      "prefix": ["I"]
    }, {
      "selector": "typeAlias",
      "format": ["PascalCase"],
      "prefix": ["T"]
    }, {
      "selector": "variable",
      "format": ["camelCase", "PascalCase", "UPPER_CASE"]
    }, {
      "selector": "variable",
      "types": ["boolean"],
      "format": ["PascalCase"],
      "prefix": ["is", "should", "has", "can", "did", "will", "with"]
    }],
    "simple-import-sort/imports": ["error", {
      "groups": [["^react", "^redux", "^lodash", "^logalize", "^enzyme", "^\\w", "^common", "^shared", "^slotv", "^app", "\\w"], ["^images"], ["^videos"], ["\\.s?css$"]]
    }],
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "comma",
        "requireLast": true
      },
      "singleline": {
        "delimiter": "comma",
        "requireLast": false
      },
      "overrides": {
        "interface": {
          "multiline": {
            "delimiter": "semi",
            "requireLast": true
          },
          "singleline": {
            "delimiter": "semi",
            "requireLast": false
          }
        }
      }
    }],
    "no-async-promise-executor": "off",
    "no-empty": "off",
    "@typescript-eslint/no-magic-numbers": ["error", {
      "ignore": [0, 1, -1],
      "ignoreDefaultValues": true,
      "ignoreEnums": true,
      "ignoreNumericLiteralTypes": true,
      "ignoreReadonlyClassProperties": true
    }]
  }
};