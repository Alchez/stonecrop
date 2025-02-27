import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import ATable from '../src/components/ATable.vue'
import data from './data/http_logs.json'
import type { TableColumn, TableConfig } from '../src/types'

describe('table component', () => {
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

	const defaultProps = {
		columns,
		modelValue: data,
		config: { view: 'list' } as TableConfig,
	}

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('verify header row', async () => {
		const wrapper = mount(ATable, { props: defaultProps })
		expect(wrapper.vm).toBeTruthy()

		const headerCells = wrapper.findAll('th')
		expect(headerCells.length).toBe(columns.length + 1) // +1 for the row number column

		const homePageHeader = headerCells.at(1)
		expect(homePageHeader!.element.style.minWidth).toBe('35ch')
		expect(homePageHeader!.element.style.textAlign).toBe('left')
		expect(homePageHeader!.element.style.width).toBe('')

		const httpMethodHeader = headerCells.at(2)
		expect(httpMethodHeader!.element.style.minWidth).toBe('20ch')
		expect(httpMethodHeader!.element.style.textAlign).toBe('left')
		expect(httpMethodHeader!.element.style.width).toBe('')

		const reportDateHeader = headerCells.at(3)
		expect(reportDateHeader!.element.style.minWidth).toBe('25ch')
		expect(reportDateHeader!.element.style.textAlign).toBe('center')
		expect(reportDateHeader!.element.style.width).toBe('')
	})

	it('verify data rows (format function)', async () => {
		const wrapper = mount(ATable, { props: defaultProps })

		const dataCells = wrapper.findAll('td')
		expect(dataCells.length).toBe((columns.length + 1) * data.length) // +1 for the row number column

		const homePageCell = dataCells.at(1)
		expect(homePageCell!.text()).toBeTypeOf('string') // test string format

		const httpMethodCell = dataCells.at(2)
		expect(httpMethodCell!.text()).toBeTruthy()

		const reportDateCell = dataCells.at(3)
		expect(reportDateCell!.text()).toBeTruthy()
	})

	it('verify data rows (format string)', async () => {
		const columns: TableColumn[] = [
			{
				label: 'Home Page',
				name: 'home_page',
				type: 'Data',
				align: 'left',
				edit: false,
				width: '35ch',
				format: '(value) => {\n\t\t\t\treturn value.title\n\t\t\t}',
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

		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: data,
				config: { view: 'list' },
			},
		})

		const dataCells = wrapper.findAll('td')
		expect(dataCells.length).toBe((columns.length + 1) * data.length) // +1 for the row number column

		const homePageCell = dataCells.at(1)
		expect(homePageCell!.text()).toBeTypeOf('string') // test string format

		const httpMethodCell = dataCells.at(2)
		expect(httpMethodCell!.text()).toBeTruthy()

		const reportDateCell = dataCells.at(3)
		expect(reportDateCell!.text()).toBeTruthy()
	})

	it('verify data rows (no format)', async () => {
		const columns: TableColumn[] = [
			{
				label: 'Home Page',
				name: 'home_page',
				type: 'Data',
				align: 'left',
				edit: false,
				width: '35ch',
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

		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: data,
				config: { view: 'list' },
			},
		})

		const dataCells = wrapper.findAll('td')
		expect(dataCells.length).toBe((columns.length + 1) * data.length) // +1 for the row number column

		const homePageCell = dataCells.at(1)
		const text = JSON.parse(homePageCell!.text())
		expect(text).toBeTypeOf('object') // test no format

		const httpMethodCell = dataCells.at(2)
		expect(httpMethodCell!.text()).toBeTruthy()

		const reportDateCell = dataCells.at(3)
		expect(reportDateCell!.text()).toBeTruthy()
	})
})
