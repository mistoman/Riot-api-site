import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserAuthView from '../views/auth/UserAuthView.vue'
import UserView from '../views/UserView.vue'
import store from '../modules/main.js'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: () => {
       if (store.getters.userId === null || store.getters.userId === '') {
        return '/auth';
      } 
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: UserAuthView
  },
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
    beforeEnter: (to) => {
      if (store.getters.userId !== to.params.id) {
        return '/auth';
      }
    }
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
