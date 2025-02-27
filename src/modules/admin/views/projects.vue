<template>
	<div class="w-full flex flex-col items-center mt-4 font-mono">
		<p class="text-2xl text-white">Project Editor</p>
		<button @click="createNewProject()" class="my-2 text-white cursor-pointer font-bold flex items-center gap-0.5">
			<p>New Project</p>
			<PlusIcon class="size-4" />
		</button>
		<div class="border-b border-type-secondary w-36 mb-4" />
		<ul class="text-white h-36 overflow-scroll space-y-2">
			<li v-for="project in projects" :key="project.id">
				<button @click="activeProject = Object.assign({}, project)" class="cursor-pointer">{{ project.name
				}}</button>
			</li>
		</ul>
		<div v-if="activeProject" class="text-white font-sans space-y-2 w-3/4 sm:w-1/2">
			<div>
				<p class="font-semibold font-mono text-lg mb-1">Title</p>
				<input type="text" class="w-full border border-type-secondary py-1 px-2 rounded-md"
					v-model="activeProject.name">
			</div>
			<div>
				<p class="font-semibold font-mono text-lg mb-1">Description (in card)</p>
				<input type="text" class="w-full border border-type-secondary py-1 px-2 rounded-md"
					v-model="activeProject.description">
			</div>
			<div>
				<p class="font-semibold font-mono text-lg mb-1">Link</p>
				<input type="text" class="w-full border border-type-secondary py-1 px-2 rounded-md"
					v-model="activeProject.link">
			</div>
			<div>
				<p class="font-semibold font-mono text-lg mb-1">Type</p>
				<select v-model="activeProject.type" class="w-full border border-type-secondary py-1 px-2 rounded-md">
					<option value="own">Personal</option>
					<option value="opensource">Open Source</option>
				</select>
			</div>

			<div class="w-full">
				<p class="font-semibold font-mono text-lg mb-1">Writeup Content</p>
				<textarea name="markdown editor" id="markdown-editor"
					class="w-full border border-type-secondary py-1 px-2 rounded-md"
					v-model="activeProject.content"></textarea>
			</div>

			<div class="flex flex-col items-center space-y-6 w-full">
				<button @click="saveProject" :disabled="loading"
					:class="[loading ? 'text-type-secondary' : 'text-type-primary', 'border border-type-secondary rounded-md py-1 px-4 cursor-pointer w-fit']">
					<p class="font-mono font-bold">Save</p>
				</button>
				<button @click="deleteProject" :disabled="loading"
					:class="[loading ? 'text-type-secondary' : 'text-type-primary', 'border border-type-secondary rounded-md px-2 py-0.5 cursor-pointer w-fit']">
					<p class="font-mono text-xs font-bold text-red-400">Delete</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ProjectType, useProjectStore } from '@/modules/projects/store/projectStore';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/main';

const loading = ref(false);

const projectStore = useProjectStore();
const activeProject = ref<ProjectType>();

const projects = ref<ProjectType[]>();

onMounted(async () => {
	if (!projectStore.getLoaded) {
		await projectStore.fetchProjects();
	}

	projects.value = [...projectStore.getProjects];
})

const createNewProject = () => {
	activeProject.value = {
		name: '',
		description: '',
		link: '',
		type: 'own',
		content: ''
	}
}

const saveProject = async () => {
	if (!activeProject.value) return;
	loading.value = true;
	const p = { ...activeProject.value };

	if (!p.id) {
		await addDoc(collection(db, "projects"), {
			...p
		});
	} else {
		await setDoc(doc(db, "projects", p.id), {
			...p
		});
	}

	await projectStore.fetchProjects();
	projects.value = [...projectStore.getProjects];
	activeProject.value = undefined;
	loading.value = false;
}

const deleteProject = async () => {
	if (!activeProject.value?.id) return;

	loading.value = true;
	await deleteDoc(doc(db, "projects", activeProject.value.id));
	await projectStore.fetchProjects();
	projects.value = [...projectStore.getProjects];
	activeProject.value = undefined;
	loading.value = false;

}
</script>