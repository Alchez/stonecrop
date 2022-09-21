import { createApp } from 'vue'
import Dev from './Dev.vue'
import atable from '@alchez/atable'
import aform from '@alchez/aform'
import stonecrop from './../src/'

let app = createApp(Dev)

app.use(atable)
app.use(aform)
app.use(stonecrop)

app.mount('#app')
