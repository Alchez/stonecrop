import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

module.exports = {
	build: {
		lib: {
			entry: resolve(__dirname, '../src/index.js'),
			name: '@alchez/stonecrop',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
		outDir: '../dist/',
	},
	plugins: [vue()],
	optimizeDeps: { exclude: ['@alchez/atable', '@alchez/aform'] },
}
