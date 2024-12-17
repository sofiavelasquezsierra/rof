/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint",
    "drizzle"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ]
  }
}
module.exports = {
  extends: ["next", "next/core-web-vitals", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Turn off specific warnings
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/consistent-indexed-object-style": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@next/next/no-img-element": "off",

    // Disable all warnings
    "no-warning-comments": "off", // Turns off TODO/FIXME warnings
  },
};