import { db } from "@/main";
import { getDocs, collection } from "firebase/firestore";
import { defineStore } from "pinia"
import { ref, computed } from "vue"

export type ProjectType = {
	id?: string,
	name: string,
	description: string,
	link: string,
	content: string,
	type: 'own' | 'opensource';
}

export const useProjectStore = defineStore('projects', () => {
	const projects = ref<ProjectType[]>([]);
	const loaded = ref(false);

	const getProjects = computed((): ProjectType[] => projects.value);
	const getLoaded = computed(() => loaded.value)

	async function fetchProjects() {
		const querySnapshot = await getDocs(collection(db, "projects"));
		projects.value = querySnapshot.docs.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				name: data.name,
				description: data.description,
				link: data.link,
				content: data.content,
				type: data.type,
			}
		})

		loaded.value = true;
	}

	return { projects, getProjects, fetchProjects, getLoaded }
})