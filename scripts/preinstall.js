if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn(`此存储库需要使用pnpm作为包管理器，脚本才能正常工作`);
  process.exit(1);
}
