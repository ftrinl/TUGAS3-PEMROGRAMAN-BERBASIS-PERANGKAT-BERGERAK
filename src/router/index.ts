import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import RankPage from '@/views/RankPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/rank'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/rank',
    name: 'RankPage',
    component: RankPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
