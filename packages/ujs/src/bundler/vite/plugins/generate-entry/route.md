## 案例

```js
export default {
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', component: './user/login' },
      ],
    },
  ],
}
```
