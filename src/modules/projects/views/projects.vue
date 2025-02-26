<template>
	<div class="w-full flex flex-col items-center relative mt-[3%]">
		<router-view />
		<div class="h-fit w-5/6">
			<h1 class="text-type-primary font-bold text-4xl mb-5 xs:mb-10">My Projects</h1>
			<div
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-8 xs:gap-16 w-full justify-center xs:justify-normal py-8">
				<Project v-for="project in personal" :key="project.id" :title="project.name"
					:description="project.description" :link="project.link" :content="project.content" />
			</div>
		</div>
		<div class="h-fit w-5/6 mt-12">
			<h1 class="text-type-primary font-bold text-4xl mb-5 xs:mb-10">Open Source Contributions</h1>
			<div
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-8 xs:gap-16 w-full justify-center xs:justify-normal py-8">
				<Project v-for="project in openSource" :key="project.id" :title="project.name"
					:description="project.description" :link="project.link" :content="project.content" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Project from '@/modules/projects/components/project.vue';
import { onMounted, ref } from 'vue';
import { ProjectType, useProjectStore } from '../store/projectStore';

const projectStore = useProjectStore();

const openSource = ref<ProjectType[]>();
const personal = ref<ProjectType[]>();

onMounted(async () => {
	if (!projectStore.getLoaded) {
		await projectStore.fetchProjects();
	}

	openSource.value = projectStore.getOpenSourceProjects;
	personal.value = projectStore.getPersonalProjects;
})

</script>

<style>
.dot-matrix {
	background-image: radial-gradient(#393639 1.6500000000000001px, #161618 1.6500000000000001px);
	background-size: 33px 33px;
}
</style>
