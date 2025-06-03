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
			<div class="flex items-center gap-1 mt-1">
				<ClockIcon class="size-4 text-gray-500" />
				<h2 class="text-gray-500 text-sm font-semibold">{{ friendlyDate }}</h2>
			</div>
			<div class="text-white mt-4">
				<div v-html="detailsHtml" class="flex flex-col space-y-3 markdown-body" />
			</div>
			<div class="flex justify-between items-center mt-12">
				<router-link :to="{ name: 'post', params: { postId: previousPostId } }"
					class="flex items-center gap-0.5 text-type-primary" :class="previousPostId ? '' : 'invisible'">
					<ArrowLongLeftIcon class="size-6" />
					<p>Previous Post</p>
				</router-link>
				<router-link v-if="nextPostId" :to="{ name: 'post', params: { postId: nextPostId } }"
					class="flex items-center gap-0.5 text-type-primary">
					<p>Next Post</p>
					<ArrowLongRightIcon class="size-6" />
				</router-link>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/24/outline';
import { ClockIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid';
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

const previousPostId = ref<string | null>(null);
const nextPostId = ref<string | null>(null);

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

	const posts = postStore.getPage.posts;
	const index = posts.findIndex((post) => post.id === props.postId);
	postData.value = posts[index];

	previousPostId.value = posts[index + 1]?.id || null;
	nextPostId.value = posts[index - 1]?.id || null;

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

// For Firebase Timestamp conversion
const friendlyDate = computed(() => {
	if (postData.value === undefined) {
		return '';
	}

	const date = postData.value.date;

	if (date && typeof date === 'object' && 'toDate' in date) {
		const jsDate = date.toDate();
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'America/Los_Angeles'
		}).format(jsDate);
	}
});
</script>