import { resolve, basename } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const projectRootDir = basename(resolve(__dirname))

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
		},
	},
	build: {
		minify: false,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@agritheory/stonecrop',
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
