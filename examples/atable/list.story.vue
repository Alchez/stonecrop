<template>
	<Story title="list">
		<Variant title="row navigation">
			<ATable id="list" v-model="http_logs.rows" :columns="http_logs.columns" :config="{ view: 'list' }">
				<template #body="{ data }">
					<ARow
						v-for="(row, rowIndex) in data.rows"
						:key="row.id"
						:row="row"
						:rowIndex="rowIndex"
						:store="data"
						:tabIndex="0"
						:addNavigation="rowNav">
						<template #default>
							<ACell
								v-for="(col, colIndex) in data.columns"
								:key="col.name"
								:store="data"
								:col="col"
								spellcheck="false"
								:tabIndex="0"
								:addNavigation="rowNav"
								:contenteditable="false"
								:rowIndex="rowIndex"
								:colIndex="colIndex"
								:style="getRowCellStyle(col)" />
						</template>
					</ARow>
				</template>
			</ATable>
		</Variant>

		<Variant title="pinned columns">
			<ATable v-model="pinned_logs.rows" :columns="pinned_logs.columns" :config="{ view: 'list' }" />
		</Variant>

		<Variant title="expandable">
			<ATable id="list" v-model="http_logs.rows" :columns="http_logs.columns" :config="{ view: 'list-expansion' }">
				<template #body="{ data }">
					<AExpansionRow
						:data-id="row.id"
						v-for="(row, rowIndex) in data.rows"
						:key="row.id"
						:row="row"
						:rowIndex="rowIndex"
						:store="data"
						:tabIndex="0"
						:addNavigation="rowNav">
						<template #row>
							<ACell
								v-for="(col, colIndex) in data.columns"
								:key="col.name"
								:store="data"
								:col="col"
								spellcheck="false"
								:tabIndex="0"
								:addNavigation="rowNav"
								:contenteditable="false"
								:rowIndex="rowIndex"
								:colIndex="colIndex"
								:style="getRowCellStyle(col)" />
						</template>
						<template #content>
							<AForm class="aform-main aform" v-model="basic_form_schema" :data="data" />

							<ATable
								id="list"
								:columns="inbox.columns"
								:rows="chooseRandomData(inbox.rows)"
								:config="{ view: 'list-expansion' }">
								<template #body="{ data }">
									<AExpansionRow
										:data-id="row.id"
										v-for="(row, rowIndex) in data.rows"
										:key="row.id"
										:row="row"
										:rowIndex="rowIndex"
										:store="data"
										:tabIndex="0"
										:addNavigation="rowNav">
										<template #row>
											<ACell
												v-for="(col, colIndex) in data.columns"
												:key="col.name"
												:store="data"
												:col="col"
												spellcheck="false"
												:tabIndex="0"
												:addNavigation="rowNav"
												:contenteditable="false"
												:rowIndex="rowIndex"
												:colIndex="colIndex"
												:style="getRowCellStyle(col)" />
										</template>
										<template #content>
											<AForm class="aform-main aform" v-model="basic_form_schema" :data="data" />
										</template>
									</AExpansionRow>
								</template>
							</ATable>
						</template>
					</AExpansionRow>
				</template>
			</ATable>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { type TableColumn } from '@stonecrop/atable'
import { CSSProperties, ref } from 'vue'

import inbox_data from './sample_data/inbox.json'
import http_data from './sample_data/http_logs.json'

const basic_form_schema = ref([
	{
		fieldname: 'first_name',
		component: 'ATextInput',
		label: 'First Name',
	},
	{
		fieldname: 'middle_name',
		component: 'ATextInput',
		label: 'Middle Name',
	},
	{
		fieldname: 'last_name',
		component: 'ATextInput',
		label: 'Last Name',
	},
	{
		fieldname: 'age',
		component: 'ANumericInput',
		label: 'Age',
	},
	{
		fieldname: 'date',
		fieldtype: 'Date',
		component: 'ATextInput',
		label: 'Date',
	},
	{
		fieldname: 'card',
		fieldtype: 'Card',
		component: 'ATextInput',
		label: 'Card',
	},
	{
		fieldname: 'phone',
		fieldtype: 'Phone',
		component: 'ATextInput',
		label: 'Phone',
	},
	{
		fieldname: 'attach_file',
		component: 'AFileAttach',
		label: 'Attach Files',
	},
])

const http_logs = ref({
	rows: http_data,
	columns: [
		{
			label: 'Home Page',
			name: 'home_page',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
			format: (value: { title?: string; value?: any }) => {
				return value.title
			},
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
			format: (value: number) => new Date(value).toLocaleDateString('en-US'),
		},
	] as TableColumn[],
})

const pinned_logs = ref({
	rows: http_data,
	columns: [
		{
			label: 'Home Page',
			name: 'home_page',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '30ch',
			pinned: true,
			format: (value: { title?: string; value?: any }) => `${value.title}`,
		},
		{
			label: 'HTTP Method',
			name: 'http_method',
			type: 'Data',
			align: 'left',
			edit: true,
			width: '20ch',
			pinned: false,
		},
		{
			label: 'Report Date',
			name: 'report_date',
			type: 'component',
			align: 'center',
			edit: true,
			width: '25ch',
			pinned: false,
			modalComponent: 'DateInput',
			format: (value: string | number) => new Date(value).toLocaleDateString('en-US'),
		},
	],
})

const inbox = ref({
	rows: inbox_data,
	columns: [
		{
			label: 'ID',
			name: 'id',
			type: 'Data',
			align: 'left',
			edit: true,
			width: '20ch',
		},
		{
			label: 'Email',
			name: 'email',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
		},
		{
			label: 'Name',
			name: 'name',
			type: 'Data',
			align: 'left',
			edit: true,
			width: '35ch',
		},
	] as TableColumn[],
})

const chooseRandomData = (rows: any[]) => {
	return Array(3)
		.fill(0)
		.map(() => rows[Math.floor(Math.random() * rows.length)])
}

const getRowCellStyle = (column: TableColumn): CSSProperties => {
	return {
		minWidth: column?.width || '40ch',
		textAlign: column?.align || 'center',
	}
}

const rowNav = {
	'keydown.up': (event: KeyboardEvent) => {
		event.preventDefault()
		event.stopPropagation()

		const target =
			event.target instanceof HTMLTableCellElement ? event.target.parentElement : (event.target as HTMLTableRowElement)

		const $row = target.previousElementSibling
			? (target.previousElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)

		$row.focus()
		return true
	},
	'keydown.down': (event: KeyboardEvent) => {
		event.preventDefault()
		event.stopPropagation()

		const target =
			event.target instanceof HTMLTableCellElement ? event.target.parentElement : (event.target as HTMLTableRowElement)

		const $row = target.nextElementSibling
			? (target.nextElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)

		$row.focus()
		return true
	},
}

rowNav['keydown.alt.up'] = rowNav['keydown.up']
rowNav['keydown.alt.down'] = rowNav['keydown.down']
rowNav['keydown.shift.enter'] = rowNav['keydown.up']
rowNav['keydown.enter'] = rowNav['keydown.down']
</script>

<!-- enter documentation here -->
<docs lang="md"></docs>
