import { App, type Plugin } from 'vue'

import Registry from '../registry'
import { pinia } from '../stores'
import type { InstallOptions } from '../types'

const plugin: Plugin = {
	install: (app: App, options?: InstallOptions) => {
		const registry = new Registry(options?.router, options?.getMeta)

		if (options?.router) {
			app.use(options.router)
		}

		app.use(pinia)
		app.provide('$registry', registry)

		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}
	},
}

export default plugin
