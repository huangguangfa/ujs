export default {
  // npmClient: "pnpm",
  // vite: {},
  // https: {},
  // plugin:[]
  // headScripts: [],
  // scripts: [],
  routes: [
    {
      path: "/",
      component: "index",
    },
    {
      path: "/user",
      component: "index",
    },
    {
      // 404
      path: "/:pathMatch(.*)*",
      component: "@/components/404",
    },
  ],
};
