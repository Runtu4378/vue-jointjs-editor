import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Viewer from './views/Viewer.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/view',
      name: 'View',
      component: Viewer
    }
  ]
})
