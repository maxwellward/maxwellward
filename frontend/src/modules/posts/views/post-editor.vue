<template>
	<div class="w-full flex flex-col items-center">
		<p class="text-white">Post Editor</p>
		<input v-model="post.title" type="text" placeholder="Title"
			class="w-4/5 border border-type-secondary py-1 px-2 rounded-md text-white" />
		<input v-model="post.description" type="text" placeholder="Description"
			class="w-4/5 border border-type-secondary py-1 px-2 rounded-md text-white" />
		<input v-model="selectedDate" type="date" placeholder="Date"
			class="w-4/5 border border-type-secondary py-1 px-2 rounded-md text-white" @change="updatePostDate" />
		<m-markdown-editor v-model="post.content" class="w-4/5 text-white" />
		<button class="border-1 border-white rounded-md mt-2 px-4 py-2 hover:cursor-pointer hover:font-bold"
			@click="save">
			<p class="text-type-primary">Save</p>
		</button>
	</div>
</template>

<script setup lang="ts">
import MMarkdownEditor from '@/components/m-markdown-editor.vue';
import { onMounted, ref } from 'vue';
import { PostType, usePostStore } from '../store/postStore';
import router from '@/router';
import { Timestamp } from 'firebase/firestore';

interface Props {
	postId?: string;
}

const props = defineProps<Props>();

const postStore = usePostStore();

const post = ref<PostType>({
	title: '',
	description: '',
	content: '',
	date: new Timestamp(Math.floor(Date.now() / 1000), 0),
})

onMounted(async () => {
	if (props.postId) {
		const p = await postStore.getPost(props.postId);

		if (p) {
			post.value = p;
			selectedDate.value = new Date(p.date.seconds * 1000).toISOString().split('T')[0];
		} else {
			throw new Error('Post not found');
		}
	}
});

const selectedDate = ref();

const updatePostDate = () => {
	if (selectedDate.value) {
		const date = new Date(selectedDate.value + "T00:00:00");
		post.value.date = new Timestamp(Math.floor(date.getTime() / 1000), 0);
	}
}

const save = async () => {
	await postStore.savePost(post.value);
	router.push({ name: 'posts' });
}
</script>