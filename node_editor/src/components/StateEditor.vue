<template>
	<div>
		<NodeEditor v-model="elements" :node-container-class="nodeContainerClass" />
	</div>
</template>

<script setup lang="ts">
import { type Node, Position } from '@vue-flow/core'
import { type HTMLAttributes, computed } from 'vue'

import NodeEditor from './NodeEditor.vue'
import type { EditorStates, FlowElement, FlowElements, Layout } from '../types'

const emit = defineEmits(['update:modelValue'])
const states = defineModel<EditorStates>()
const { layout, nodeContainerClass } = defineProps<{
	layout: Layout
	nodeContainerClass?: HTMLAttributes['class']
}>()

const elements = computed<FlowElements>({
	get: () => {
		const hasInputs = {}
		const stateElements: FlowElements = []
		const stateHash: Record<string, FlowElement> = {}

		let index = 0
		for (const [key, value] of Object.entries(states.value)) {
			const el: Node = {
				id: key,
				label: key,
				position: layout[key]?.position || { x: 200 * index, y: 100 },
				targetPosition: layout[key]?.targetPosition || Position.Left,
				sourcePosition: layout[key]?.sourcePosition || Position.Right,
			}

			if (value.type === 'final') {
				el.type = 'output'
				el.class = 'default-output-node'
			}

			stateHash[key] = el
		}

		for (const [key, value] of Object.entries(states.value)) {
			if (value.on) {
				for (const [edgeKey, edgeValue] of Object.entries(value.on)) {
					// If the proxy array 'value.on' has more than one edge, 'edgeValue' will contain a proxy object
					// where 'target' can be accessed. Otherwise, 'edgeValue' will be available directly.
					const target = edgeValue.target || edgeValue
					// TODO: handle typescript errors for both types of states
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
					stateElements.push({
						id: `${key}-${target}`,
						source: key,
						target: target,
						label: edgeKey,
						animated: true,
					})

					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					hasInputs[target] = true
				}
			}
			index++
		}

		for (const [key, value] of Object.entries(stateHash)) {
			if (!hasInputs[key]) {
				value['type'] = 'input'
				value['class'] = 'default-input-node'
			}
			stateElements.push(value)
		}

		return stateElements
	},

	set: newValue => {
		// update modelValue when elements change
		onElementsChange(newValue)

		// TODO: emit('update:modelValue', modelValue)
	},
})
const onElementsChange = (elements: FlowElements) => {
	const edges: Record<string, Record<string, any>> = {}
	const idToLabel: Record<string, string> = {}
	const states: EditorStates = {}

	for (const el of elements) {
		const label = el.label as string

		if (el.type === 'input') {
			// it's an input node
			states[label] = {
				on: {},
			}
		} else if (el.type === 'output') {
			// it's an output node
			states[label] = {
				type: 'final',
			}
		} else if (el.source && el.target) {
			// it's an edge
			edges[el.source] = edges[el.source] || {}
			edges[el.source][label] = {
				target: el.target,
			}
		} else {
			// it's a state
			states[label] = {
				on: {},
			}
		}
		idToLabel[el.id] = label
	}

	for (const [edgeKey, edgeValue] of Object.entries(edges)) {
		// add edges to states
		const label = idToLabel[edgeKey]
		for (const [key, value] of Object.entries(edgeValue)) {
			states[label].on[key] = value
		}
	}

	emit('update:modelValue', states)
}
</script>
