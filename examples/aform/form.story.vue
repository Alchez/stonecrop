<template>
	<Story>
		<Variant title="Form" :setup-app="formSetup">
			<AForm class="aform-main" v-model="form_schema" :data="data" :key="formKey" />

			<template #controls>
				<HstRadio
					v-model="locale"
					title="Locale"
					:options="[
						{
							label: 'United States',
							value: 'en-US',
						},
						{
							label: 'India',
							value: 'en-IN',
						},
					]" />
			</template>
		</Variant>
		<Variant title="Form (Read-Only)">
			<AForm class="aform-main" v-model="basic_form_schema" :data="data" :readonly="true" />
		</Variant>
		<Variant title="Table">
			<AForm class="aform-main" v-model="table_schema" :data="data" />
		</Variant>
		<Variant title="Fieldset">
			<AForm class="aform-main" v-model="fieldset_schema" :data="data" />
		</Variant>
		<Variant title="Fieldset with Table">
			<AForm class="aform-main" v-model="fieldset_table_schema_ref" :data="data" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { App, ref, watch } from 'vue'

import basic_form_schema from './assets/basic_form_schema.json'
import basic_fieldset_schema from './assets/basic_fieldset_schema.json'
import basic_table_schema from './assets/basic_table_schema.json'
import fieldset_table_schema from './assets/fieldset_table_schema.json'

const form_schema = ref(basic_form_schema)
const fieldset_schema = ref(basic_fieldset_schema)
const table_schema = ref(basic_table_schema)
const fieldset_table_schema_ref = ref(fieldset_table_schema)

const data = ref([])
const locale = ref('en-US')
const formKey = ref(0)
watch(locale, () => {
	// re-render form when locale is changed
	formKey.value++
})

const formSetup = ({ app }: { app: App }) => {
	app.provide('locale', locale)
}
</script>
