import { db } from "@/main";
import { getDocs, collection, addDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { DocumentData, getCountFromServer, limit, orderBy, query, startAfter, Timestamp, where } from '@firebase/firestore';

export type PostType = {
	id?: string,
	rawDocument?: DocumentData,
	title: string,
	description: string,
	content: string,
	date: Timestamp;
	tags?: string[];
}

type PostPage = {
	posts: PostType[],
	currentPage: number,
}

export const ITEMS_PER_PAGE = 9;

export const usePostStore = defineStore('posts', () => {
	const posts = ref<PostPage[]>([{
		posts: [],
		currentPage: 0,
	}]);
	const loaded = ref(false);

	const currentPage = ref(0);
	const totalDocuments = ref(0);

	const includeTripPosts = ref<boolean>(false);

	const getPage = computed((): PostPage => posts.value[currentPage.value] || { posts: [], currentPage: currentPage.value });
	const getPost = (id: string): PostType | undefined => posts.value[currentPage.value].posts.find((post) => post.id === id);
	const getLoaded = computed(() => loaded.value);
	const getCurrentPage = computed((): number => currentPage.value);
	const getTotalDocuments = computed((): number => totalDocuments.value);

	async function setCurrentPage(page: number): Promise<void> {
		if (page < 0 || page >= Math.ceil(totalDocuments.value / 9)) {
			throw new Error("Invalid page number");
		}

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
	async function fetchPosts(page: number = currentPage.value) {
		loaded.value = false;
		let coll;
		if (includeTripPosts.value) {
			coll = collection(db, "posts");
		} else {
			coll = query(collection(db, "posts"), where('tags', '!=', ['megatrip']));
		}

		const counterSnapshot = await getCountFromServer(coll);
		totalDocuments.value = counterSnapshot.data().count;

		let q;
		if (page === 0) {
			// If we're on the first page, fetch the first 9 posts
			if (includeTripPosts.value === true) {
				q = query(collection(db, "posts"), orderBy("date", "desc"), limit(ITEMS_PER_PAGE));
			} else {
				q = query(collection(db, "posts"), orderBy("date", "desc"), limit(ITEMS_PER_PAGE), where('tags', '!=', ['megatrip']));
			}

		} else {
			// If we're on subsequent pages, fetch the next 9 posts after the last post of the current page
			const lastPost = posts.value[page - 1].posts.slice(-1)[0].rawDocument;

			if (includeTripPosts.value) {
				q = query(
					collection(db, "posts"),
					orderBy("date", "desc"),
					startAfter(lastPost),
					limit(ITEMS_PER_PAGE));
			} else {
				q = query(
					collection(db, "posts"),
					orderBy("date", "desc"),
					startAfter(lastPost),
					limit(ITEMS_PER_PAGE),
					where('tags', '!=', ['megatrip']));
			}

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
				tags: data.tags,
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
			totalDocuments.value++;
		} else {
			const postToSend = post;
			delete postToSend.rawDocument;
			await setDoc(doc(db, "posts", post.id), postToSend);

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
		totalDocuments.value--;
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

	return { includeTripPosts, posts, getPage, getPost, fetchPosts, fetchPost, savePost, deletePost, getLoaded, setCurrentPage, getCurrentPage, getTotalDocuments }
})