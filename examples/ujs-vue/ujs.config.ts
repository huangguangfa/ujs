export default {
  base: '/foo',
  publicPath: '',
  headScripts: ['alert("headScripts")'],
  scripts: ['console.log("body-scripts")'],
  router: [
    {
      path: 'user',
      component: '@/user/index',
    },
    {
      path: 'list',
      component: '@/user/list',
    },
  ],
}
