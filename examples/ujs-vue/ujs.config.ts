export default {
  base: '/',
  publicPath: '',
  headScripts: [],
  bodyScripts: [
    'console.log("body-scripts")',
    '<script>console.log("add body <script>")</script>',
  ],
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
