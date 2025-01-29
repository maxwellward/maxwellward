<template>
	<div id="app">
		<body>
			<div class="-z-[9999] fixed size-full pattern invisible lg:visible" />
			<header>
				<HeaderComponent />
			</header>
			<router-view id="main" />
			<footer class="sm:fixed bottom-0 left-0">
				<FooterComponent class="z-[999]" />
			</footer>
		</body>
	</div>
</template>

<script lang="ts" setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
</script>

<style>
.pattern {
	background-image: linear-gradient(to right, #1f1d29, #1f1d29 1px, #13111c 1px, #13111c);
	background-size: 12vw;
}

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
