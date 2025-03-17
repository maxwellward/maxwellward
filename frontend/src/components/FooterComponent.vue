<template>
	<div class="bg-primary text-type-secondary p-7 w-full sm:w-fit">
		<div class="flex items-center justify-between sm:items-start sm:flex-col sm:space-y-3 justify-center">
			<a href="https://github.com/maxwellward" target="_blank"
				class="hover:underline decoration-dotted">Github</a>
		</div>
		<router-link :to="{ name: 'admin' }"
			class="hover:cursor-default flex justify-center mt-3 text-sm font-semibold">
			© {{ date }} - Maxwell Ward
		</router-link>
	</div>
</template>

<script lang="ts" setup>
const date = new Date().getFullYear();
</script>
