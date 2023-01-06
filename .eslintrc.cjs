module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-const-assign': 2,
    '@typescript-eslint/no-unused-vars': ['error'], // 定义或声明但没有使用
    'no-debugger': 'error',
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
}
