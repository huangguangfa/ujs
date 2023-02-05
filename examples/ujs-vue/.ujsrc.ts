export default {
  headScripts: [],
  bodyScripts: [
    'console.log("body-scripts")',
    '<script>console.log("add body <script>")</script>',
  ],
  routes: [
    {
      path: '/',
      component: '@/app',
      routes: [
        {
          path: 'user',
          component: '@/user/index',
        },
        {
          path: 'list',
          component: '@/user/list',
        },
      ],
    },
    {
      path: '/system',
      component: '@/system/index',
    },
  ],
}
