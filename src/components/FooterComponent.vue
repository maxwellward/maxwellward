<template>
	<div class="bg-primary text-type-secondary p-7 w-full sm:w-fit">
		<div class="flex items-center justify-between sm:items-start sm:flex-col sm:space-y-3">
			<!-- <p>Privacy Policy</p> -->
			<a href="https://github.com/maxwellward" target="_blank" class="hover:underline decoration-dotted">Github</a>
			<!-- <p>Discord</p> -->
		</div>
		<p class="flex justify-center mt-3 text-sm font-semibold">© {{ date }} - Maxwell Ward</p>
	</div>
</template>

<script lang="ts" setup>
const date = new Date().getFullYear();
</script>
