export default {
  base: '/root',
  publicPath: '',
  headScripts: ['console.log(111)'],
  router: [
    {
      path: 'user',
      component: '@/user/index',
    },
  ],
}
