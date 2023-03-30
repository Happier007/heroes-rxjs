module.exports = {
  root: true,
  // ignorePatterns: ['projects/**/*'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts'],
      env: {
        browser: true,
        es6: true,
        node: true,
      },
      parserOptions: {
        sourceType: 'module',
      },
      extends: ['plugin:@angular-eslint/recommended'],
      rules: {
        'max-len': ['error', 100, 2, { ignoreUrls: true }],
        'no-console': 'error',
        'no-alert': 'error',
      },
    },
    {
      files: ['*.component.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        'max-len': ['error', { code: 140 }],
      },
    },
  ],
};
