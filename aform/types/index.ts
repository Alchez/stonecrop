// TODO: (typing) figure out a way to import other monorepo package types
import { TableColumn, TableConfig, TableRow } from '@alchez/atable/types'

export type BasicSchema = {
	component: string
	fieldname: string
}

export type FormSchema = BasicSchema & {
	align: string
	edit: boolean
	fieldtype: string
	label: string
	name: string
	width: string
	mask?: string
}

export type TableSchema = BasicSchema & {
	columns: TableColumn[]
	config: TableConfig
	rows: TableRow[]
}

export type FieldsetSchema = BasicSchema & {
	label: string
	schema: (FormSchema | TableSchema)[]
	collapsible?: boolean
}

export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema
