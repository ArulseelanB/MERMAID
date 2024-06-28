module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
    node: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2022,
    allowAutomaticSingleRunInference: true,
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:json/recommended',
    'plugin:markdown/recommended-legacy',
    'plugin:@cspell/recommended',
    'biome',
  ],
  plugins: [
    '@typescript-eslint',
    'no-only-tests',
    'html',
    'jest',
    'jsdoc',
    'json',
    '@cspell',
    'lodash',
    'unicorn',
  ],
  ignorePatterns: [
    // this file is automatically generated by `pnpm run --filter mermaid types:build-config`
    'packages/mermaid/src/config.type.ts',
  ],
  rules: {
    curly: 'error',
    'no-console': 'error',
    'no-prototype-builtins': 'off',
    'no-unused-vars': 'off',
    'cypress/no-async-tests': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': 'allow-with-description',
        minimumDescriptionLength: 10,
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],
    'json/*': ['error', 'allowComments'],
    '@cspell/spellchecker': [
      'error',
      {
        checkIdentifiers: true,
        checkStrings: true,
        checkStringTemplates: true,
      },
    ],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-only-tests/no-only-tests': 'error',
    'lodash/import-scope': ['error', 'method'],
    'unicorn/better-regex': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/no-array-push-push': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-typeof-undefined': 'error',
    'unicorn/no-unnecessary-await': 'error',
    'unicorn/no-unsafe-regex': 'warn',
    'unicorn/no-useless-promise-resolve-reject': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-default-parameters': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-negative-index': 'error',
    'unicorn/prefer-object-from-entries': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-trim-start-end': 'error',
    'unicorn/string-content': 'error',
    'unicorn/prefer-spread': 'error',
    'unicorn/no-lonely-if': 'error',
  },
  overrides: [
    {
      files: ['cypress/**', 'demos/**'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['*.{js,jsx,mjs,cjs}'],
      extends: ['plugin:jsdoc/recommended'],
      rules: {
        'jsdoc/check-indentation': 'off',
        'jsdoc/check-alignment': 'off',
        'jsdoc/check-line-alignment': 'off',
        'jsdoc/multiline-blocks': 'off',
        'jsdoc/newline-after-description': 'off',
        'jsdoc/tag-lines': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-returns': 'off',
        'jsdoc/require-returns-description': 'off',
      },
    },
    {
      files: ['*.{ts,tsx}'],
      plugins: ['tsdoc'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'TSEnumDeclaration',
            message:
              'Prefer using TypeScript union types over TypeScript enum, since TypeScript enums have a bunch of issues, see https://dev.to/dvddpl/whats-the-problem-with-typescript-enums-2okj',
          },
        ],
        'tsdoc/syntax': 'error',
      },
    },
    {
      files: ['*.spec.{ts,js}', 'cypress/**', 'demos/**', '**/docs/**'],
      rules: {
        'jsdoc/require-jsdoc': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['*.spec.{ts,js}', 'tests/**', 'cypress/**/*.js'],
      rules: {
        '@cspell/spellchecker': [
          'error',
          {
            checkIdentifiers: false,
            checkStrings: false,
            checkStringTemplates: false,
          },
        ],
      },
    },
    {
      files: ['*.html', '*.md', '**/*.md/*'],
      rules: {
        'no-var': 'error',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
      },
      parserOptions: {
        project: null,
      },
    },
  ],
};
