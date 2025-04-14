<template>
	<div class="w-4/5 pr-12 sm:pr-0 sm:w-1/2 2xl:w-1/3 my-24 sm:my-64 ml-16 sm:ml-32 2xl:ml-64">
		<h1 class="text-5xl sm:text-6xl font-bold text-type-primary">Maxwell Ward</h1>
		<div class="text-type-secondary font-bold mt-2 space-y-2">
			<div class="flex gap-1.5">
				<MapPinIcon class="size-6" />
				<p class="mt-0.5">Vancouver, BC</p>
			</div>
			<div class="flex gap-1.5">
				<CpuChipIcon class="size-6" />
				<p class="mt-0.5">Software Developer</p>
			</div>
		</div>
		<m-button text="my work" colourful route-name="projects"
			class="mt-6 transition-all duration-200 hover:scale-105 hover:-rotate-2" />
		<m-button text="I'm on a trip!" route-name="posts"
			class="mt-6 transition-all duration-200 hover:scale-105 hover:-rotate-2" />
	</div>
</template>

<script lang="ts" setup>
import MButton from '@/components/m-button.vue';
import { MapPinIcon, CpuChipIcon } from '@heroicons/vue/24/solid';
</script>
