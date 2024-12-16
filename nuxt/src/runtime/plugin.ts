import { AForm } from '@stonecrop/aform'
import { Stonecrop } from '@stonecrop/stonecrop'
import { useRouter } from 'nuxt/app'

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(_nuxtApp => {
	const app = _nuxtApp.vueApp
	app.component('AForm', AForm)
	app.use(Stonecrop)
})
