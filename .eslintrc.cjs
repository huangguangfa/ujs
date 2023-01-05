module.exports = {
  root: true,
  rules: {
    "arrow-parens": [2, "as-needed"],
    eqeqeq: [2, "allow-null"],
    "no-const-assign": 2,
    "@typescript-eslint/no-unused-vars": ["warn"], // 定义或声明但没有使用
  },
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
};
