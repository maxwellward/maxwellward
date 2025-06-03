import { db } from "@/main";
import { getDocs, collection, addDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { DocumentData, getCountFromServer, limit, orderBy, query, startAfter, Timestamp } from '@firebase/firestore';

export type PostType = {
	id?: string,
	rawDocument: DocumentData,
	title: string,
	description: string,
	content: string,
	date: Timestamp;
}

type PostPage = {
	posts: PostType[],
	currentPage: number,
}

export const usePostStore = defineStore('posts', () => {
	const posts = ref<PostPage[]>([]);
	const loaded = ref(false);

	const currentPage = ref(0);
	const totalDocuments = ref(0);

	const getPage = computed((): PostPage => posts.value[currentPage.value] || {});
	const getPost = (id: string): PostType | undefined => posts.value[currentPage.value].posts.find((post) => post.id === id);
	const getLoaded = computed(() => loaded.value);
	const getCurrentPage = computed((): number => currentPage.value);
	const getTotalDocuments = computed((): number => totalDocuments.value);

	async function setCurrentPage(page: number): Promise<void> {
		if (!posts.value[page]) {
			await fetchPosts(page);
		}

		currentPage.value = page;
	}

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
	async function fetchPosts(page: number = 0) {
		loaded.value = false;
		const coll = collection(db, "posts");
		const counterSnapshot = await getCountFromServer(coll);
		totalDocuments.value = counterSnapshot.data().count;

		let q;
		if (page === 0) {
			// If we're on the first page, fetch the first 10 posts
			q = query(collection(db, "posts"), orderBy("date", "desc"), limit(9));
		} else {
			// If we're on subsequent pages, fetch the next 10 posts after the last post of the current page
			const lastPost = posts.value[page - 1].posts.slice(-1)[0].rawDocument;

			q = query(
				collection(db, "posts"),
				orderBy("date", "desc"),
				startAfter(lastPost),
				limit(9));
		}

		const querySnapshot = await getDocs(q);

		const tempPosts = querySnapshot.docs.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				rawDocument: doc,
				title: data.title,
				description: data.description,
				content: data.content,
				date: data.date,
			}
		}).sort((a, b) => {
			// Sort by timestamp in descending order (newest first)
			return b.date.toMillis() - a.date.toMillis();
		});


		posts.value[page] = {
			posts: tempPosts,
			currentPage: page,
		}

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
			posts.value[currentPage.value].posts = [...posts.value[currentPage.value].posts, post];
		} else {
			await setDoc(doc(db, "posts", post.id), post);

			const index = posts.value[currentPage.value].posts.findIndex((p) => p.id === post.id);
			posts.value[currentPage.value].posts[index] = post;
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
		posts.value[currentPage.value].posts = posts.value[currentPage.value].posts.filter((post) => post.id !== id);
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

	return { posts, getPage, getPost, fetchPosts, fetchPost, savePost, deletePost, getLoaded, setCurrentPage, getCurrentPage, getTotalDocuments }
})