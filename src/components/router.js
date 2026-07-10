import { createRouter, createWebHistory } from 'vue-router'
import AboutView from './about.vue'

const routes = [
    {
        path: '/about',
        name: 'About',
        component: AboutView
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router