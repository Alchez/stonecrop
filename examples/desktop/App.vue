<template>
	<ActionSet :elements="elements" />
	<router-view v-slot="{ Component, route }">
		<transition :name="route.meta.transition || 'slide-up'">
			<component :is="Component" />
		</transition>
	</router-view>
	<SheetNav />
</template>

<script setup lang="ts">
const elements = [
	{
		type: 'button',
		label: 'Show Alert',
		action: buttonClicked,
	},
	{
		type: 'dropdown',
		label: 'Action Menu',
		actions: [
			{
				label: 'Show Current Timestamp',
				action: showCurrentTime,
			},
			{
				label: 'Show Random Number',
				action: showRandomNumber,
			},
			{
				label: 'Show App Name',
				action: showAppName,
			},
			{
				label: 'Show Company Name',
				action: showCompanyName,
			},
		],
	},
	{
		type: 'dropdown',
		label: 'Link Menu',
		actions: [
			{
				label: 'Google',
				link: '/',
			},
			{
				label: 'Yahoo',
				link: '/',
			},
			{
				label: 'Bing',
				link: '/',
			},
		],
	},
]

function buttonClicked() {
	alert('Button clicked!')
}

function showCurrentTime() {
	alert(Date.now())
}

function showRandomNumber() {
	alert(Math.floor(Math.random() * 100))
}

function showAppName() {
	alert('Stonecrop')
}

function showCompanyName() {
	alert('Agritheory')
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
	margin: 0;
}

html,
body {
	height: 100%;
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
</style>
