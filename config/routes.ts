export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: '登录',
    layout: false,
    component: './Login',
  },
  {
    path: '/home',
    name: '首页',
    icon: 'home',
    access: 'canAdmin',
    component: './Home',
  },
  {
    path: '/list',
    name: '列表',
    icon: 'form',
    component: './List',
  },
  {
    component: './404',
  },
];
