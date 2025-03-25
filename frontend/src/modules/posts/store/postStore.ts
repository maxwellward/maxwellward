import { db } from "@/main";
import { getDocs, collection, addDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { defineStore } from "pinia"
import { ref, computed } from "vue"

export type PostType = {
	id?: string,
	title: string,
	description: string,
	content: string,
	date: Date;
}

export const usePostStore = defineStore('posts', () => {
	const posts = ref<PostType[]>([]);
	const loaded = ref(false);

	const getPosts = computed((): PostType[] => posts.value);
	const getPost = (id: string): PostType | undefined => posts.value.find((post) => post.id === id);
	const getLoaded = computed(() => loaded.value)

	/**
	 * Fetches post documents from Firestore database and updates the local posts state.
	 * Each post document is transformed into a post object containing id, title,
	 * description, content, and date properties.
	 * 
	 * @async
	 * @function fetchPosts
	 * @returns {Promise<void>} - Promise that resolves when posts are fetched and state is updated
	 * @throws {FirebaseError} - If there's an error accessing Firestore
	 */
	async function fetchPosts() {
		const querySnapshot = await getDocs(collection(db, "posts"));
		posts.value = querySnapshot.docs.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				title: data.title,
				description: data.description,
				content: data.content,
				date: data.date,
			}
		})

		loaded.value = true;
	}

	/**
	 * Saves a post to the Firestore database and updates the local posts state.
	 * If the post doesn't have an ID, it creates a new document.
	 * If the post has an ID, it updates the existing document.
	 * 
	 * @param post - The post object to be saved
	 * @throws {FirebaseError} If the database operation fails
	 * @returns {Promise<void>}
	 */
	async function savePost(post: PostType) {
		if (!post.id) {
			await addDoc(collection(db, "posts"), post);
			posts.value = [...posts.value, post];
		} else {
			await setDoc(doc(db, "posts", post.id), post);

			const index = posts.value.findIndex((p) => p.id === post.id);
			posts.value[index] = post;
		}

		await fetchPosts();
	};

	/**
	 * Deletes a post from both Firestore and local state.
	 * @param id - The unique identifier of the post to delete
	 * @throws {FirebaseError} If the deletion operation in Firestore fails
	 * @returns {Promise<void>} A promise that resolves when the post is deleted
	 */
	async function deletePost(id: string) {
		await deleteDoc(doc(db, "posts", id));
		posts.value = posts.value.filter((post) => post.id !== id);
	}


	/**
	 * Fetches a post from Firestore by its ID.
	 * 
	 * @param id - The unique identifier of the post to fetch
	 * @returns A Promise that resolves to a post object with id, title, description, content, and date
	 * @throws Error if the post with the given ID does not exist in the database
	 */
	async function fetchPost(id: string) {
		const postRef = doc(db, "posts", id);
		const postSnap = await getDoc(postRef);

		if (postSnap.exists()) {
			const data = postSnap.data();
			return {
				id: postSnap.id,
				title: data.title,
				description: data.description,
				content: data.content,
				date: data.date,
			}
		} else {
			throw new Error("Post not found");
		}
	}

	return { posts, getPosts, getPost, fetchPosts, fetchPost, savePost, deletePost, getLoaded }
})