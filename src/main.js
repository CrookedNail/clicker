import { createApp } from 'vue'
import 'vuetify/styles'
import App from './App.vue'
import store from './store'
import api from '@/api/api'
import router from '@/router'
import axios from 'axios'
import VueCryptojs from 'vue-cryptojs'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'animate.css'

const vuetify = createVuetify({
    components,
    directives
})

const token = localStorage.getItem('jwt')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)

app.use(store).use(vuetify).use(VueCryptojs).use(api).use(router).mount('#app')
