export default {
  base: '/foo',
  publicPath: '',
  headScripts: ['console.log(111)'],
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
