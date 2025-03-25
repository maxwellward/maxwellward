<template>
	<div class="w-full flex flex-col items-center relative mt-[3%]">
		<div class="h-fit w-5/6">
			<router-link :to="{ name: 'post-editor' }" v-if="isAuthenticated"
				class="text-type-secondary hover:text-white flex items-center gap-1 font-semibold text-sm transition-colors duration-150 w-fit">
				<PencilIcon class="size-3 -mt-1" />
				<p>Create Post</p>
			</router-link>
			<h1 class="text-type-primary font-bold text-4xl mb-5 xs:mb-10">Recent Posts</h1>
			<div v-if="loading"
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full justify-center xs:justify-normal py-8">
				<div v-for="i in 3" :key="i"
					class="group bg-card/80 border-2 border-cardborder/80 rounded-xl h-32 animate-pulse w-1/4 min-w-[250px] p-3" />
			</div>
			<div v-for="post in posts" :key="post.id">
				<PostCard :post="post" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { PostType, usePostStore } from '../store/postStore';
import PostCard from '../components/post-card.vue';
import { PencilIcon } from '@heroicons/vue/24/solid';
import { getAuth } from 'firebase/auth';
import { firebase } from '@/main';

const postStore = usePostStore();

const posts = ref<PostType[]>([]);
const loading = ref(true);
const isAuthenticated = ref(false);

onMounted(async () => {
	if (!postStore.getLoaded) {
		await postStore.fetchPosts();
	}

	posts.value = postStore.getPosts;
	loading.value = false;

	const auth = getAuth(firebase);
	await auth.authStateReady();

	if (auth.currentUser) {
		isAuthenticated.value = true;
	}
});
</script>

<style>
.dot-matrix {
	background-image: radial-gradient(#393639 1.6500000000000001px, #161618 1.6500000000000001px);
	background-size: 33px 33px;
}
</style>
