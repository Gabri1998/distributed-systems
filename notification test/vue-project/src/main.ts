import './assets/main.css'



import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {initializeToken} from "./fireBase"
import App from './App.vue'
import router from './router'
import "./ws"
//Vue.prototype.$messaging = firebseMessaging
const app = createApp(App)
app.provide('fbInitialize',initializeToken)
app.use(createPinia())
app.use(router)

app.mount('#app')
