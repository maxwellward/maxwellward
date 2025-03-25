<template>
	<div class="w-full flex flex-col items-center">
		<p class="text-white">Post Editor</p>
		<input v-model="post.title" type="text" placeholder="Title"
			class="w-4/5 border border-type-secondary py-1 px-2 rounded-md text-white" />
		<input v-model="post.description" type="text" placeholder="Description"
			class="w-4/5 border border-type-secondary py-1 px-2 rounded-md text-white" />
		<m-markdown-editor v-model="post.content" class="w-4/5 text-white" />
		<button class="border-1 border-white p-2" @click="save">Save</button>
	</div>
</template>

<script setup lang="ts">
import MMarkdownEditor from '@/components/m-markdown-editor.vue';
import { onMounted, ref } from 'vue';
import { PostType, usePostStore } from '../store/postStore';
import router from '@/router';

interface Props {
	postId?: string;
}

const props = defineProps<Props>();

const postStore = usePostStore();

const post = ref<PostType>({
	title: '',
	description: '',
	content: '',
	date: new Date(),
})

onMounted(async () => {
	if (props.postId) {
		const p = await postStore.getPost(props.postId);

		if (p) {
			post.value = p;
		} else {
			throw new Error('Post not found');
		}
	}
});

const save = async () => {
	await postStore.savePost(post.value);
	router.push({ name: 'posts' });
}
</script>