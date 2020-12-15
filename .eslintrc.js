module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.ts"],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [
          "front/tsconfig.json"
        ],
        createDefaultProgram: true
      },
      plugins: ["prefer-arrow"],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@angular-eslint/recommended',
        'airbnb-typescript/base',
        'prettier',
        'prettier/@typescript-eslint',
        ],
      rules: {
        '@angular-eslint/component-class-suffix': 'error',
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/contextual-lifecycle': 'error',
        '@angular-eslint/directive-class-suffix': 'error',
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/no-conflicting-lifecycle': 'error',
        '@angular-eslint/no-host-metadata-property': 'error',
        '@angular-eslint/no-input-rename': 'error',
        '@angular-eslint/no-inputs-metadata-property': 'error',
        '@angular-eslint/no-output-native': 'error',
        '@angular-eslint/no-output-on-prefix': 'error',
        '@angular-eslint/no-output-rename': 'error',
        '@angular-eslint/no-outputs-metadata-property': 'error',
        '@angular-eslint/template/banana-in-box': 'off',
        '@angular-eslint/template/no-negated-async': 'off',
        '@angular-eslint/use-lifecycle-interface': 'error',
        '@angular-eslint/use-pipe-transform-interface': 'error',
        "@typescript-eslint/naming-convention": [
          "error",
          {
            "selector": "variable",
            "format": ["camelCase", "UPPER_CASE"]
          }
        ],
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              Object: {
                message: 'Avoid using the `Object` type. Did you mean `object`?',
              },
              Function: {
                message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
              },
              Boolean: {
                message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
              },
              Number: {
                message: 'Avoid using the `Number` type. Did you mean `number`?',
              },
              String: {
                message: 'Avoid using the `String` type. Did you mean `string`?',
              },
              Symbol: {
                message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
              },
            },
          },
        ],
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit',
          },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/member-delimiter-style': [
          'off',
          {
            multiline: {
              delimiter: 'none',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/semi': ['off', null],
        '@typescript-eslint/triple-slash-reference': [
          'error',
          {
            path: 'always',
            types: 'prefer-import',
            lib: 'always',
          },
        ],
        '@typescript-eslint/type-annotation-spacing': 'off',
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': 'error',
        'arrow-parens': ['off', 'always'],
        'brace-style': ['off', 'off'],
        'comma-dangle': ['error', 'always-multiline'],
        complexity: 'off',
        'constructor-super': 'error',
        curly: 'error',
        eqeqeq: ['error', 'smart'],
        'guard-for-in': 'error',
        'id-blacklist': 'off',
        'id-match': 'off',
        'max-classes-per-file': 'off',
        'max-depth': ['error', 5],
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': [
          'error',
          {
            allow: [
              'log',
              'warn',
              'dir',
              'timeLog',
              'assert',
              'clear',
              'count',
              'countReset',
              'group',
              'groupEnd',
              'table',
              'dirxml',
              'error',
              'groupCollapsed',
              'Console',
              'profile',
              'profileEnd',
              'timeStamp',
              'context',
            ],
          },
        ],
        'no-debugger': 'error',
        'no-empty': 'off',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'no-invalid-this': 'off',
        'no-irregular-whitespace': 'off',
        'no-new-wrappers': 'error',
        'no-restricted-imports': ['error', 'rxjs/Rx'],
        'no-restricted-globals': ['error', 'event'],
        'no-shadow': [
          'error',
          {
            hoist: 'all',
          },
        ],
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'error',
        'no-unused-labels': 'error',
        'object-shorthand': 'error',
        'one-var': ['error', 'never'],
        'prefer-arrow/prefer-arrow-functions': 'error',
        radix: 'error',
        'space-in-parens': ['off', 'never'],
        'spaced-comment': [
          'error',
          'always',
          {
            markers: ['/'],
          },
        ],
        'use-isnan': 'error',
        'valid-typeof': 'off',
        'import/no-deprecated': 'warn',
        'import/order': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/prefer-default-export': 'off'
      }
    },
    {
      files: ["*.component.html"],
      parser: "@angular-eslint/template-parser",
      plugins: ["@angular-eslint/template"],
      rules: {
        "@angular-eslint/template/banana-in-box": "error",
        "@angular-eslint/template/cyclomatic-complexity": "off",
        "@angular-eslint/template/no-call-expression": "off",
        "@angular-eslint/template/no-negated-async": "error"
      }
    },
    {
      files: ["*.component.ts"],
      extends: ["plugin:@angular-eslint/template/process-inline-templates"]
    }
  ]
}