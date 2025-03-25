<template>
	<router-link :to="{ name: 'post', params: { postId: post.id } }"
		class="group hover:cursor-pointer bg-card border-2 border-cardborder rounded-xl flex w-1/4 min-w-[250px] p-3 transition-all duration-150 hover:scale-102 hover:shadow-lg hover:-rotate-2 relative">
		<BookOpenIcon class="size-6 mt-1.5 shrink-0 text-type-primary" />
		<div class="ml-1">
			<h2 class="font-semibold text-type-primary text-xl mt-2.5">{{ post.title }}</h2>
			<p class="mt-1.5 text-type-secondary text-sm w-[85%]">{{ post.description }}</p>
		</div>
		<ArrowLongRightIcon
			class="transition-all duration-150 opacity-0 group-hover:opacity-100 bottom-3 right-3 size-5 absolute text-type-secondary" />
	</router-link>
</template>

<script lang="ts" setup>
import { BookOpenIcon, ArrowLongRightIcon } from '@heroicons/vue/24/outline';
import { PostType } from '../store/postStore';

interface Props {
	post: PostType;
}

defineProps<Props>();
</script>
