import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/login',
        name:'login',
        component: () =>  import('../views/Login.vue')
    },
    {
        path: '/',
        component: () => import('../views/Main.vue'),
        name: 'home1',
        /* children: [
            {
                path: '/',
                name: 'home',
                component: () => import('../views/Home/Home.vue'),
            },
            {
                path: '/user',
                name: 'user',
                component: () => import('../views/User/User.vue'),
            },
            {
                path: '/page1',
                name: 'page1',
                component: () => import('../views/Page1.vue'),
            },
            {
                path: '/page2',
                name: 'page2',
                component: () => import('../views/Page2.vue'),
            },
        ], */
        children:[]
    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router