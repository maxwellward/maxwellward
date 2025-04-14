<template>

	<body id="app">
		<header>
			<HeaderComponent />
		</header>
		<router-view id="main" :key="router.currentRoute.value.path" />
		<footer>
			<FooterComponent />
		</footer>
	</body>
</template>

<script lang="ts" setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import router from './router';
</script>

<style>
body {
	display: flex;
	flex-direction: column;
}

#main {
	flex: 1;
}

body {
	min-height: 100vh;
	margin: 0;
}

footer {
	min-height: 50px;
}
</style>
