<template>
	<a :href="link" target="_blank" rel="noreferrer"
		class="group hover:cursor-pointer bg-card border-2 border-cardborder rounded-xl flex w-1/4 min-w-[250px] p-3 transition-all duration-150 hover:scale-102 hover:shadow-lg hover:-rotate-2 relative">
		<CodeBracketSquareIcon class="size-8 mt-1.5 flex-shrink-0 text-type-primary" />
		<div class="ml-1">
			<h2 class="font-semibold text-type-primary text-xl mt-2">{{ title }}</h2>
			<p class="mt-1.5 text-type-secondary text-sm w-[85%]">{{ description }}</p>
		</div>
		<ArrowTopRightOnSquareIcon
			class="transition-all duration-150 opacity-0 group-hover:opacity-100 bottom-3 right-3 size-5 absolute text-type-secondary" />
	</a>
</template>

<script lang="ts" setup>
import { CodeBracketSquareIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

defineProps({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
});
</script>
