import { defineNuxtModule, addPlugin, createResolver, extendPages } from '@nuxt/kit'
import { existsSync, readdirSync } from 'node:fs'
import { extname } from 'node:path'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
	meta: {
		name: '@stonecrop/nuxt',
		configKey: 'stonecrop',
	},

	setup(_options, _nuxt) {
		const rootDir = _nuxt.options.srcDir
		const doctypesDir = resolve(rootDir, 'doctypes')
		if (existsSync(doctypesDir)) {
			const schemas = readdirSync(doctypesDir).filter(file => extname(file) === '.json')

			for (const schema of schemas) {
				const schemaName = schema.replace('.json', '')
				const schemaPath = resolve(doctypesDir, schema)
				extendPages(pages => {
					pages.unshift({
						name: `stonecrop-${schemaName}`,
						path: `/${schemaName}`,
						file: 'AForm',
					})
				})
			}
		}

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		addPlugin(resolve('./runtime/plugin'))
	},
})
