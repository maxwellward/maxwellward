<template>
	<div class="w-full flex flex-col items-center relative mt-[3%]">
		<div class="h-fit w-5/6">
			<h1 class="text-type-primary font-bold text-4xl mb-5 xs:mb-10">My Projects</h1>
			<div v-if="loading"
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full justify-center xs:justify-normal py-8">
				<div v-for="i in 3" :key="i"
					class="group bg-card/80 border-2 border-cardborder/80 rounded-xl h-32 animate-pulse w-1/4 min-w-[250px] p-3" />
			</div>
			<draggable v-else :disabled="!canReorder" v-model="personal" @start="dragging = true" @end="endDrag()"
				item-key="id" ghost-class="blur-xs"
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full justify-center xs:justify-normal py-8">
				<template #item="{ element }">
					<Project :key="element.id" :project="element" />
				</template>
			</draggable>
		</div>
		<div class="h-fit w-5/6 mt-12">
			<h1 class="text-type-primary font-bold text-4xl mb-5 xs:mb-10">Open Source Contributions</h1>
			<div v-if="loading"
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full justify-center xs:justify-normal py-8">
				<div v-for="i in 3" :key="i"
					class="group bg-card/80 border-2 border-cardborder/80 rounded-xl h-32 animate-pulse w-1/4 min-w-[250px] p-3" />
			</div>
			<draggable v-else :disabled="!canReorder" v-model="openSource" @start="dragging = true" @end="endDrag()"
				item-key="id" ghost-class="blur-xs"
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full justify-center xs:justify-normal py-8">
				<template #item="{ element }">
					<Project :key="element.id" :project="element" />
				</template>
			</draggable>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Project from '@/modules/projects/components/project.vue';
import { onMounted, ref } from 'vue';
import { ProjectType, useProjectStore } from '../store/projectStore';
import router from '@/router';
import { db, firebase } from '@/main';
import { getAuth } from 'firebase/auth';
import draggable from 'vuedraggable'
import { doc, writeBatch } from 'firebase/firestore';

const projectStore = useProjectStore();

const openSource = ref<ProjectType[]>([]);
const personal = ref<ProjectType[]>([]);

const dragging = ref(false);
const canReorder = ref(false);
const loading = ref(true);

onMounted(async () => {
	if (router.currentRoute.value.query.reordering) {
		const auth = getAuth(firebase);
		await auth.authStateReady();

		const isAuthenticated = auth.currentUser;
		if (!isAuthenticated) {
			router.push({ name: 'auth' });
		} else {
			canReorder.value = true;
		}
	};

	if (!projectStore.getLoaded) {
		await projectStore.fetchProjects();
	}

	const projects = projectStore.getProjects;
	loading.value = false;

	personal.value = projects.filter((project) => project.type === 'own').sort((a, b) => a.order - b.order);
	openSource.value = projects.filter((project) => project.type === 'opensource').sort((a, b) => a.order - b.order);
});

window.addEventListener('beforeunload', function (e) {
	if (waitingToSync.value) e.preventDefault();
});

const endDrag = () => {
	dragging.value = false;
	let projects = [...personal.value, ...openSource.value];

	projects = projects.map((project, index) => {
		project.order = index;
		return project;
	});

	updateDocuments(projects);
};

let timeoutId: NodeJS.Timeout;
const waitingToSync = ref(false);
const updateDocuments = async (projects: ProjectType[]) => {
	clearTimeout(timeoutId);

	waitingToSync.value = true;
	timeoutId = setTimeout(async () => {
		const batch = writeBatch(db);

		projects.forEach(async (project) => {
			if (!project.id) return;
			const projectRef = doc(db, 'projects', project.id);
			batch.update(projectRef, { order: project.order });
		});

		// Commit the batch
		await batch.commit();

		await projectStore.fetchProjects();
		waitingToSync.value = false;
	}, 2500);
}

</script>

<style>
.dot-matrix {
	background-image: radial-gradient(#393639 1.6500000000000001px, #161618 1.6500000000000001px);
	background-size: 33px 33px;
}
</style>
