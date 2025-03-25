<template>
	<div class="w-full flex justify-center">
		<div class="w-[80%] md:w-[60%] lg:w-1/2 mt-12" v-if="postData">
			<router-link :to="{ name: 'posts' }"
				class="text-gray-500 hover:text-gray-100 transition flex items-center gap-1">
				<ArrowLongLeftIcon class="size-6" />
				<p class="text-sm">Back</p>
			</router-link>
			<h1 class="text-white font-bold text-3xl">{{ postData.name }}</h1>
			<div class="text-white mt-6">
				<div v-html="detailsHtml" class="flex flex-col space-y-3 markdown-body" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked';
import { PostType, usePostStore } from '../store/postStore';

interface Props {
	postId: string;
}

const props = defineProps<Props>();
const postStore = usePostStore();

const postData = ref<PostType>();
const detailsHtml = ref('');

marked.use({
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
})
</script>