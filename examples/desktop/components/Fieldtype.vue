<template>
	<pre>{{ registeredComponents }}</pre>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const app = getCurrentInstance()

const registeredComponents = computed(() => {
	let components = []
	for (const [name, obj] of Object.entries(app.appContext.components)) {
		if ((obj as any).props?.register) {
			// may be appropriate to pass more than just the instance name here
			components.push(name)
		}
	}
	return components
})
</script>
