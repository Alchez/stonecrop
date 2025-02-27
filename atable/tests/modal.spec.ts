import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import ATable from '../src/components/ATable.vue'
import data from './data/http_logs.json'
import type { TableColumn, TableConfig } from '../src/types'

describe('table modal component', () => {
	const columns: TableColumn[] = [
		{
			label: 'Home Page',
			name: 'home_page',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
			format: (value: { title: string }) => value.title,
		},
		{
			label: 'HTTP Method',
			name: 'http_method',
			type: 'Data',
			align: 'left',
			edit: true,
			width: '20ch',
		},
		{
			label: 'Report Date',
			name: 'report_date',
			type: 'component',
			align: 'center',
			edit: true,
			width: '25ch',
			modalComponent: 'DateInput',
			format: (value: string | number) => new Date(value).toLocaleDateString('en-US'),
		},
	]

	const props = {
		columns,
		modelValue: data,
		config: { view: 'list' } as TableConfig,
	}

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('spawn modal component', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.store.modal.visible).toBe(true)
	})

	it('click inside to keep modal component alive', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		// click inside
		const $table = wrapper.find('.atable')
		$table.trigger('click')
		expect(wrapper.vm.store.modal.visible).toBe(true)
	})

	it('click outside to dismiss modal component', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		// click outside
		window.dispatchEvent(new MouseEvent('click'))
		expect(wrapper.vm.store.modal.visible).toBe(false)
	})

	it('press escape to dismiss modal component', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		// press escape
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		expect(wrapper.vm.store.modal.visible).toBe(false)
	})
})
