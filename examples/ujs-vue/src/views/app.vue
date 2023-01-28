<template>
  <div style="width: 100vw; height: 100vh">
    <div class="home">首页</div>
    <ul>
      <li v-for="item in userModule" :key="item.path">
        <router-link :to="item.path"> {{ item.name }}</router-link>
      </li>
    </ul>
    <div class="child__content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
const userModule = [
  {
    name: '用户页面',
    path: 'user',
  },
  {
    name: '用户列表',
    path: 'list',
  },
  {
    name: '系统管理',
    path: 'system',
  },
]
</script>

<style>
.home {
  background: blueviolet;
  color: white;
}
.child__content {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
}
ul > li {
  width: 100px;
  height: 40px;
  background: beige;
  margin-top: 10px;
  text-align: center;
  line-height: 40px;
}
</style>
