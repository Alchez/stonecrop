<template>
	<div>Stonecrop Page</div>
	<!-- <AForm v-model="schema" :data="[]" /> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const schema = ref(route.meta.schema)
</script>
