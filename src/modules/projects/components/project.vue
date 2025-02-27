<template>
	<component :is="!project.content ? 'a' : 'router-link'"
		v-bind="!project.content ? { href: project.link, target: '_blank', rel: 'noreferrer' } : { to: { name: 'project-details', params: { projectId: project.id } } }"
		class="group hover:cursor-pointer bg-card border-2 border-cardborder rounded-xl flex w-1/4 min-w-[250px] p-3 transition-all duration-150 hover:scale-102 hover:shadow-lg hover:-rotate-2 relative">
		<CodeBracketSquareIcon class="size-8 mt-1.5 shrink-0 text-type-primary" />
		<div class="ml-1">
			<h2 class="font-semibold text-type-primary text-xl mt-2.5">{{ project.name }}</h2>
			<p class="mt-1.5 text-type-secondary text-sm w-[85%]">{{ project.description }}</p>
		</div>
		<ArrowLongRightIcon v-if="project.content"
			class="transition-all duration-150 opacity-0 group-hover:opacity-100 bottom-3 right-3 size-5 absolute text-type-secondary" />
		<ArrowTopRightOnSquareIcon v-else
			class="transition-all duration-150 opacity-0 group-hover:opacity-100 bottom-3 right-3 size-5 absolute text-type-secondary" />
	</component>
</template>

<script lang="ts" setup>
import { CodeBracketSquareIcon, ArrowTopRightOnSquareIcon, ArrowLongRightIcon } from '@heroicons/vue/24/outline';
import { ProjectType } from '../store/projectStore';
import { onMounted } from 'vue';

interface Props {
	project: ProjectType;
}

const props = defineProps<Props>();

onMounted(() => {
	console.log(props.project.id);

});
</script>
