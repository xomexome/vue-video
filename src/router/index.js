import Vue from 'vue';
import Router from 'vue-router';
import home from '../components/home.vue';
import secrch from  "../components/secrch.vue";
import Detail from '../components/Detail.vue';
import More from '../components/More.vue';
import Me from '../components/Me.vue';
import Login from '../components/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {
        index: 1
      }
    },{
      path: '/secrch',
      name: 'secrch',
      component: secrch,
      meta: {
        index: 2
      }
    },{
      path: '/video/:id',
      name: 'video',
      component: Detail,
      meta: {
        index: 3
      }
    },{
      path: '/all',
      name: 'all',
      component: More,
      meta: {
        index: 2
      },
    },{
      path: '/movie',
      name: 'movie',
      component: More,
      meta: {
        index: 2
      },
    },{
      path: '/tv',
      name: 'tv',
      component: More,
      meta: {
        index: 2
      },
    },{
      path: '/zy',
      name: 'zy',
      component: More,
      meta: {
        index: 2
      },
    },{
      path: '/me',
      name: 'me',
      component: Me,
      meta: {
        index: 2
      },
    },{
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        index: 4
      }
    }
  ]
})
