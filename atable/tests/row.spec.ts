import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import ATable from '../src/components/ATable.vue'
import listData from './data/http_logs.json'
import type { TableColumn } from '../src/types'

describe('table row component', () => {
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

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('verify no expand symbol on list table config', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: listData,
				config: { view: 'list' },
			},
		})

		const rowWrapper = wrapper.findComponent({ name: 'ARow' })
		expect(rowWrapper.exists()).toBe(true)

		const listColumns = rowWrapper.findAll('.list-index')
		const treeColumns = rowWrapper.findAll('.tree-index')
		expect(listColumns.length).toBe(1) // since only one instance of a row is retrieved
		expect(treeColumns.length).toBe(0)
	})

	it('verify expand symbol on tree table config', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: listData,
				config: { view: 'tree' },
			},
		})

		const rowWrapper = wrapper.findComponent({ name: 'ARow' })
		expect(rowWrapper.exists()).toBe(true)

		const listColumns = rowWrapper.findAll('.list-index')
		const treeColumns = rowWrapper.findAll('.tree-index')
		expect(listColumns.length).toBe(0)
		expect(treeColumns.length).toBe(1) // since only one instance of a row is retrieved
	})
})
