import { Stonecrop } from '@stonecrop/stonecrop'
import { useRouter } from 'nuxt/app'

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(_nuxtApp => {
	const router = useRouter()
	const app = _nuxtApp.vueApp
	app.use(Stonecrop, { router })
})
