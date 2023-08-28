import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store/index'
import './less/index.css'
import './api/mock'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import api from './api/api'

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

const app = createApp(App)
app.config.globalProperties.$api = api
// app.use(ElementPlus)

// 判断要跳转的页面路由中是否存在，若存在则跳转，若不存在，则跳转到home页面
function checkRouter(path) {
    let hasCheck = router.getRoutes().filter(route => route.path == path).length
    if (hasCheck) {
        return true
    } else {
        return false
    }
}

// 添加路由守卫，如果没有 token， 并且所在页面不是login，则跳转到登录页面进行登录获得token
router.beforeEach((to, from, next) => {
    store.commit('getToken')
    const token = store.state.token
    if (!token && to.name !== 'login') {
        next({ name: 'login' })
    } else if (!checkRouter(to.path)) {
        next({ name: 'home' })
    } else {
        next()
    }
})

store.commit('addMenu', router)
app.use(router)
app.use(store)

app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
