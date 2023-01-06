module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "arrow-parens": [2, "as-needed"],
    eqeqeq: [2, "allow-null"],
    "no-const-assign": 2,
    "@typescript-eslint/no-unused-vars": ["error"], // 定义或声明但没有使用
    "no-debugger": "error",
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
};
