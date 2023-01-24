import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [vue()],
	optimizeDeps: {
		exclude: ['@alchez/atable', '@alchez/aform', '@alchez/stonecrop'],
	},
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'docbuilder'),
		},
	},
	server: {
		fs: {
			allow: ['..'],
		},
	},
	build: {
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'docbuilder/index.ts'),
			name: '@alchez/examples',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
})
