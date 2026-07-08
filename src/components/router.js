import { createRouter, createWebHistory } from 'vue-router'
import InfosView from './infos.vue'

const routes = [
    {
        path: '/infos',
        name: 'Infos',
        component: InfosView
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router