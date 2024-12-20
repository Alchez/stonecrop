<template>
	<div>Stonecrop Page</div>
	<AForm v-model="schema" />
</template>

<script setup lang="ts">
import type { SchemaTypes } from '@stonecrop/aform'
import { useRoute } from 'nuxt/app'
import { onMounted, ref } from 'vue'

const route = useRoute()
const schema = ref<SchemaTypes[]>([])

onMounted(() => {
	// wait for the route-based schema to be resolved
	schema.value = route.meta.schema as SchemaTypes[]
})
</script>
