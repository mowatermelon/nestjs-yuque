module.exports = {
  extends: [require.resolve('zao-lint/eslint')],
  parserOptions: {
    project: './tsconfig.json',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  // ignorePatterns: ['.eslintrc.js'],
}
