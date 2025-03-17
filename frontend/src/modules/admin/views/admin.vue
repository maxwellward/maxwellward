<template>
	<div class="w-full flex flex-col items-center mt-4">
		<p class="font-mono text-2xl text-white font-semibold mb-12">Admin Panel</p>

		<ul class="text-white font-mono space-y-2">
			<li class="flex items-center gap-1 hover:underline">
				<router-link :to="{ name: 'project-editor' }">Project Editor</router-link>
				<ArrowLongRightIcon class="size-6" />
			</li>
			<li class="flex items-center gap-1 hover:underline">
				<router-link :to="{ name: 'projects', query: { reordering: 'true' } }">Reorder Projects</router-link>
				<ArrowLongRightIcon class="size-6" />
			</li>
			<li class="flex items-center gap-1 hover:underline">
				<router-link :to="{ name: 'media' }">Media Management</router-link>
				<ArrowLongRightIcon class="size-6" />
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid';
</script>