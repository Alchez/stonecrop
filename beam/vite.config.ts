/// <reference types="vitest" />

import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [vue(), libInjectCss()],
	build: {
		emptyOutDir: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/beam',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				chunkFileNames: 'chunks/[name].[hash].js',
				assetFileNames: 'assets/[name].[ext]',
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json'], // required for Github Actions CI
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 70,
				branches: 70,
				functions: 70,
				statements: 70,
			},
			exclude: [
				...coverageConfigDefaults.exclude,
				'src/index.ts', // ignore the entry file
			],
		},
	},
})
