import { defineNuxtModule, addPlugin, createResolver, extendPages } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
	meta: {
		name: '@stonecrop/nuxt',
		configKey: 'stonecrop',
	},

	setup(_options, _nuxt) {
		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		addPlugin(resolve('./runtime/plugin'))

		extendPages(pages => {
			console.log('pages', pages)
		})
	},
})
