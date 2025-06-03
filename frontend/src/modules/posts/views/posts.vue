<template>
	<div class="w-full flex flex-col items-center relative mt-[3%]">
		<div class="h-fit w-5/6">
			<router-link :to="{ name: 'post-editor' }" v-if="isAuthenticated"
				class="text-type-secondary hover:text-white flex items-center gap-1 font-semibold text-sm transition-colors duration-150 w-fit">
				<PencilIcon class="size-3 -mt-1" />
				<p>Create Post</p>
			</router-link>
			<h1 class="text-type-primary font-bold text-4xl mb-5 xs:mb-10">Recent Posts</h1>
			<div v-if="!loaded"
				class="size-full dot-matrix xs:p-12 flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full justify-center xs:justify-normal py-8">
				<div v-for="i in 3" :key="i"
					class="group bg-card/80 border-2 border-cardborder/80 rounded-xl h-32 animate-pulse w-1/4 min-w-[250px] p-3" />
			</div>
			<div v-if="loaded"
				class="size-full flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full justify-center xs:justify-normal py-6">
				<PostCard :post="post" v-for="post in posts" :key="post.id" />
			</div>
		</div>
		<div class="text-white flex gap-8" v-if="loaded">
			<button @click="nextPage" v-if="hasNextPage" class="flex items-center gap-1 hover:cursor-pointer">
				<ArrowLongLeftIcon class="size-4 inline-block" />
				<p>Next Page</p>
			</button>
			<button @click="prevPage" v-if="hasPrevPage" class="flex items-center gap-1 hover:cursor-pointer">
				<p>Previous Page</p>
				<ArrowLongRightIcon class="size-4 inline-block" />
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { PostType, usePostStore } from '../store/postStore';
import PostCard from '../components/post-card.vue';
import { getAuth } from 'firebase/auth';
import { firebase } from '@/main';

import { ArrowLongRightIcon, ArrowLongLeftIcon, PencilIcon } from '@heroicons/vue/24/solid';


const postStore = usePostStore();

const posts = ref<PostType[]>([]);
const isAuthenticated = ref(false);

onMounted(async () => {
	if (!postStore.getLoaded) {
		await postStore.fetchPosts();
	}

	posts.value = postStore.getPage.posts;

	const auth = getAuth(firebase);
	await auth.authStateReady();

	if (auth.currentUser) {
		isAuthenticated.value = true;
	}
});

const ITEMS_PER_PAGE = 9;
const hasPrevPage = computed(() => {
	return postStore.getCurrentPage * ITEMS_PER_PAGE < postStore.getTotalDocuments && posts.value.length === ITEMS_PER_PAGE;
})

const hasNextPage = computed(() => {
	return postStore.getCurrentPage != 0;
})

watch(() => postStore.getCurrentPage, () => {
	posts.value = postStore.getPage.posts;
}, { immediate: true });

const prevPage = () => {
	postStore.setCurrentPage(postStore.getCurrentPage + 1);
}

const nextPage = () => {
	postStore.setCurrentPage(postStore.getCurrentPage - 1);
}

const loaded = computed(() => {
	return postStore.getLoaded;
});
</script>

<style>
.dot-matrix {
	background-image: radial-gradient(#393639 1.6500000000000001px, #161618 1.6500000000000001px);
	background-size: 33px 33px;
}
</style>
