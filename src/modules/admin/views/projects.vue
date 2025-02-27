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
		<div v-if="activeProject" class="text-white font-sans space-y-2 w-3/4">
			<div>
				<p>Title</p>
				<input type="text" class="w-full" v-model="activeProject.name">
			</div>
			<div>
				<p>Description (in card)</p>
				<input type="text" class="w-full" v-model="activeProject.description">
			</div>
			<div>
				<p>Link</p>
				<input type="text" class="w-full" v-model="activeProject.link">
			</div>
			<div>
				<p>Type</p>
				<select v-model="activeProject.type" class="w-full">
					<option value="own">Personal</option>
					<option value="opensource">Open Source</option>
				</select>
			</div>
			<div class="w-full">
				<p class="text-white">Writeup Content</p>
				<textarea name="markdown editor" id="markdown-editor" class="w-full"
					v-model="activeProject.content"></textarea>
			</div>
			<button @click="saveProject" :disabled="loading"
				:class="[loading ? 'text-type-secondary' : 'text-type-primary']">Save</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ProjectType, useProjectStore } from '@/modules/projects/store/projectStore';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
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
</script>