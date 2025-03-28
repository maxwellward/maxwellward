<template>
	<div class="w-full flex justify-center">
		<div class="w-[80%] md:w-[60%] lg:w-1/2 mt-12" v-if="postData">
			<div class="flex gap-2">
				<router-link :to="{ name: 'post-editor', params: { postId: postData.id } }" v-if="isAuthenticated"
					class="text-type-secondary hover:text-white flex items-center gap-1 font-semibold text-sm transition-colors duration-150 w-fit">
					<PencilIcon class="size-3 -mt-1" />
					<p>Edit Post</p>
				</router-link>
				<button @click="deletePost" v-if="isAuthenticated"
					class="text-type-secondary hover:text-red-400 flex items-center gap-1 font-semibold text-sm transition-colors duration-150 w-fit">
					<TrashIcon class="size-3 -mt-1" />
					<p>Delete Post</p>
				</button>
			</div>

			<router-link :to="{ name: 'posts' }"
				class="text-gray-500 hover:text-gray-100 transition flex items-center gap-1">
				<ArrowLongLeftIcon class="size-6" />
				<p class="text-sm">Back</p>
			</router-link>
			<h1 class="text-white font-bold text-3xl">{{ postData.title }}</h1>
			<div class="text-white mt-6">
				<div v-html="detailsHtml" class="flex flex-col space-y-3 markdown-body" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { marked } from 'marked';
import { PostType, usePostStore } from '../store/postStore';
import { firebase } from '@/main';
import { getAuth } from 'firebase/auth';
import router from '@/router';
import { imagerowExtension } from '@/markdown/imagerow';

interface Props {
	postId: string;
}

const props = defineProps<Props>();
const postStore = usePostStore();

const postData = ref<PostType>();
const detailsHtml = ref('');
const isAuthenticated = ref(false);

//TODO: fix this
// @ts-ignore
marked.use(imagerowExtension, {
	breaks: true,
	gfm: true
});

onMounted(async () => {
	if (!postStore.getLoaded) {
		await postStore.fetchPosts();
	}

	const posts = postStore.getPosts;
	const index = posts.findIndex((post) => post.id === props.postId);
	postData.value = posts[index];

	const detailsStringWithNewlines = postData.value?.content.replace(/\\n/g, '\n') || '';

	detailsHtml.value = await marked.parse(detailsStringWithNewlines || '');

	const auth = getAuth(firebase);
	await auth.authStateReady();

	if (auth.currentUser) {
		isAuthenticated.value = true;
	}
})

const deletePost = async () => {
	if (postData.value?.id) {
		await postStore.deletePost(postData.value.id);
		router.push({ name: 'posts' });
	}
}
</script>