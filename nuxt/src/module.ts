import { defineNuxtModule, addPlugin, createResolver, extendPages, addLayout } from '@nuxt/kit'
import { existsSync, readdirSync } from 'node:fs'
import { extname } from 'node:path'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
	meta: {
		name: '@stonecrop/nuxt',
		configKey: 'stonecrop',
	},

	setup(_options, _nuxt) {
		// add the base Stonecrop layout from the module
		const layoutsDir = resolve('runtime/layouts')
		const homeLayoutPath = resolve(layoutsDir, 'StonecropHome.vue')
		addLayout(homeLayoutPath, 'home')

		// find doctype schemas in the nuxt application and add them as pages
		const rootDir = _nuxt.options.srcDir
		const doctypesDir = resolve(rootDir, 'doctypes')
		if (existsSync(doctypesDir)) {
			const schemas = readdirSync(doctypesDir).filter(file => extname(file) === '.json')
			const pagesDir = resolve('runtime/pages')
			const homePagePath = resolve(pagesDir, 'StonecropPage.vue')

			extendPages(pages => {
				for (const schema of schemas) {
					const schemaName = schema.replace('.json', '')
					const schemaPath = resolve(doctypesDir, schema)
					const jsonData = require(schemaPath)
					if (jsonData.schema) {
						pages.unshift({
							name: `stonecrop-${schemaName}`,
							path: `/${schemaName}`,
							file: homePagePath,
							meta: {
								schema: jsonData.schema,
							},
						})
					}
				}

				pages.unshift({
					name: 'stonecrop-home',
					path: '/',
					file: homeLayoutPath,
				})
			})
		}

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		addPlugin(resolve('./runtime/plugin'))
	},
})
