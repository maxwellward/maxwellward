<template>
	<div class="w-full flex justify-center">
		<div class="w-[80%] md:w-[60%] lg:w-1/2 mt-12" v-if="projectData">
			<router-link :to="{ name: 'projects' }"
				class="text-gray-500 hover:text-gray-100 transition flex items-center gap-1">
				<ArrowLongLeftIcon class="size-6" />
				<p class="text-sm">Back</p>
			</router-link>
			<h1 class="text-white font-bold text-3xl">{{ projectData.name }}</h1>
			<a :href="projectData.link" target="_blank" rel="noreferrer"
				class="flex items-center gap-1 text-[#d1d1d1] hover:text-white transition">
				<div class="size-4">
					<svg class="w-full h-full fill-current" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
					</svg>
				</div>
				<p class="text-sm font-semibold mt-0.5">View on Github</p>
			</a>
			<div class="text-white mt-6">
				<div v-html="detailsHtml" class="flex flex-col space-y-3 markdown-body" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked';
import { ProjectType, useProjectStore } from '../store/projectStore';
import { imagerowExtension } from '@/markdown/imagerow';

interface Props {
	projectId: string;
}

const props = defineProps<Props>();
const projectStore = useProjectStore();

const projectData = ref<ProjectType>();
const detailsHtml = ref('');

// TODO: Fix this
// @ts-ignore
marked.use(imagerowExtension, {
	breaks: true,
	gfm: true
});

onMounted(async () => {
	if (!projectStore.getLoaded) {
		await projectStore.fetchProjects();
	}

	const projects = projectStore.getProjects;
	const index = projects.findIndex((project) => project.id === props.projectId);
	projectData.value = projects[index];

	const detailsStringWithNewlines = projectData.value?.content.replace(/\\n/g, '\n') || '';

	detailsHtml.value = await marked.parse(detailsStringWithNewlines || '');
})
</script>