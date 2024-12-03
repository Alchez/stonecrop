import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	modules: ['../src/module'],
	stonecrop: {},
	devtools: { enabled: true },
	compatibilityDate: '2024-12-03',
})
