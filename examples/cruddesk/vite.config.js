import vue from '@vitejs/plugin-vue'

module.exports = {
	plugins: [vue()],
	optimizeDeps: {
		exclude: ['@alchez/atable', '@alchez/aform', '@alchez/stonecrop'],
	},
}
