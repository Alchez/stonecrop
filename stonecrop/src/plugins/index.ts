import { App, type Plugin } from 'vue'

import Registry from '../registry'
import { pinia } from '../stores'
import type { InstallOptions } from '../types'

const plugin: Plugin = {
	install: (app: App, options?: InstallOptions) => {
		// check if the router is already installed via another plugin
		const existingRouter = app.config.globalProperties.$router
		const appRouter = existingRouter || options?.router
		const registry = new Registry(appRouter, options?.getMeta)

		if (!existingRouter && appRouter) {
			app.use(appRouter)
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
