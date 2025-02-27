import { db } from "@/main";
import { getDocs, collection, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
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

	/**
	 * Fetches project documents from Firestore database and updates the local projects state.
	 * Each project document is transformed into a project object containing id, name,
	 * description, link, content, and type properties.
	 * 
	 * @async
	 * @function fetchProjects
	 * @returns {Promise<void>} - Promise that resolves when projects are fetched and state is updated
	 * @throws {FirebaseError} - If there's an error accessing Firestore
	 */
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

	/**
	 * Saves a project to the Firestore database and updates the local projects state.
	 * If the project doesn't have an ID, it creates a new document.
	 * If the project has an ID, it updates the existing document.
	 * 
	 * @param project - The project object to be saved
	 * @throws {FirebaseError} If the database operation fails
	 * @returns {Promise<void>}
	 */
	async function saveProject(project: ProjectType) {
		console.log(project);

		if (!project.id) {
			await addDoc(collection(db, "projects"), {
				...project
			});
			projects.value = [...projects.value, project];
		} else {
			await setDoc(doc(db, "projects", project.id), {
				...project
			});

			const index = projects.value.findIndex((p) => p.id === project.id);
			projects.value[index] = project;
		}
	};

	/**
	 * Deletes a project from both Firestore and local state.
	 * @param id - The unique identifier of the project to delete
	 * @throws {FirebaseError} If the deletion operation in Firestore fails
	 * @returns {Promise<void>} A promise that resolves when the project is deleted
	 */
	async function deleteProject(id: string) {
		await deleteDoc(doc(db, "projects", id));
		projects.value = projects.value.filter((project) => project.id !== id);
	}

	return { projects, getProjects, fetchProjects, saveProject, deleteProject, getLoaded }
})