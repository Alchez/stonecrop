import { install as AForm } from '@stonecrop/aform'
import { install as ATable } from '@stonecrop/atable'
import { Stonecrop } from '@stonecrop/stonecrop'
import { createPinia } from 'pinia'
import { useRouter } from 'nuxt/app'

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(_nuxtApp => {
	const pinia = createPinia()
	const router = useRouter()

	const app = _nuxtApp.vueApp
	app.use(pinia)
	app.use(AForm)
	app.use(ATable)
	app.use(Stonecrop, { router })
})
