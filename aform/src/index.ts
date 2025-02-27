export type { CellContext, TableConfig, TableColumn, TableRow } from '@stonecrop/atable'
import type { App } from 'vue'

import ACheckbox from './components/form/ACheckbox.vue'
import AComboBox from './components/form/AComboBox.vue'
import ADate from './components/form/ADate.vue'
import ADropdown from './components/form/ADropdown.vue'
import ADatePicker from './components/form/ADatePicker.vue'
import AFieldset from './components/form/AFieldset.vue'
import AFileAttach from './components/form/AFileAttach.vue'
import AForm from './components/AForm.vue'
import ANumericInput from './components/form/ANumericInput.vue'
import ATextInput from './components/form/ATextInput.vue'
import Login from './components/utilities/Login.vue'
export type { BaseSchema, FieldsetSchema, FormSchema, SchemaTypes, TableSchema } from './types'

/**
 * Install all AForm components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.component('ACheckbox', ACheckbox)
	app.component('ACombobox', AComboBox)
	app.component('ADate', ADate)
	app.component('ADropdown', ADropdown)
	app.component('ADatePicker', ADatePicker)
	app.component('AFieldset', AFieldset)
	app.component('AFileAttach', AFileAttach)
	app.component('AForm', AForm)
	app.component('ANumericInput', ANumericInput)
	app.component('ATextInput', ATextInput)
}

export {
	ACheckbox,
	AComboBox,
	ADate,
	ADropdown,
	ADatePicker,
	AFieldset,
	AFileAttach,
	AForm,
	ANumericInput,
	ATextInput,
	Login,
	install,
}
