<template>
	<div>
		<input
			v-model="inputDate"
			ref="date"
			type="date"
			:id="uuid"
			:disabled="readonly"
			:required="required"
			@click="showPicker" />
		<label :for="uuid">{{ label }}</label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { ComponentProps } from '../../types'

const {
	schema, // don't remove to allow masking to work
	label = 'Date',
	required,
	readonly,
	uuid,
	validation = { errorMessage: '&nbsp;' },
} = defineProps<ComponentProps>()

const inputDate = defineModel<string | number | Date>({
	// format the date to be compatible with the native input datepicker
	set: value => new Date(value).toISOString().split('T')[0],
})
const dateRef = useTemplateRef<HTMLInputElement>('date')

const showPicker = () => {
	if (dateRef.value) {
		if ('showPicker' in HTMLInputElement.prototype) {
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/showPicker
			// TODO: re-check browser support and compatibility; figure out alternative ways
			// to spawn the native datepicker and eventually replace with ADatepicker
			dateRef.value.showPicker()
		}
	}
}
</script>

<style scoped>
div {
	min-width: 40ch;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	box-sizing: border-box;
	outline: 1px solid transparent;
	border: 1px solid var(--sc-input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
}

p,
label {
	color: var(--sc-input-label-color);
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
	box-sizing: border-box;
}

p {
	width: 100%;
	color: red;
	font-size: 85%;
	box-sizing: border-box;
}

label {
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
	box-sizing: border-box;
}

input:focus {
	border: 1px solid var(--sc-input-active-border-color);
}

input:focus + label {
	color: var(--sc-input-active-label-color);
}
</style>
