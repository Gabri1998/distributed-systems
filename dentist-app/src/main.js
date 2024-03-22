import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import Vue3Toasity from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import store from './vuex'

const app = createApp(App)

app.use(store)
app.use(BootstrapVue3)
app.use(router)
app.use(Vue3Toasity, {
    autoClose: 3000
  })
app.mount('#app')
