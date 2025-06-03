<template>
	<router-link :to="{ name: 'post', params: { postId: post.id } }"
		class="group hover:cursor-pointer bg-card border-2 border-cardborder rounded-xl flex flex-col w-1/4 min-w-[250px] p-3 transition-all duration-150 hover:scale-102 hover:shadow-lg hover:-rotate-2 relative">
		<div class="flex items-start text-type-primary">
			<BookOpenIcon class="size-6 shrink-0" />
			<h2 class="ml-1 font-semibold text-lg">{{ post.title }}</h2>
		</div>
		<div class="flex gap-1 items-center ml-2 text-type-primary">
			<ClockIcon class="size-4" />
			<p class="text-sm mt-0.5">{{ friendlyDate }}</p>
		</div>
		<p class="mt-1.5 text-type-secondary text-sm w-[85%]">{{ post.description }}</p>
		<ArrowLongRightIcon
			class="transition-all duration-150 opacity-0 group-hover:opacity-100 bottom-3 right-3 size-5 absolute text-type-secondary" />
	</router-link>
</template>

<script lang="ts" setup>
import { BookOpenIcon, ArrowLongRightIcon, ClockIcon } from '@heroicons/vue/24/outline';
import { PostType } from '../store/postStore';
import { computed } from 'vue';

interface Props {
	post: PostType;
}

const props = defineProps<Props>();

// For Firebase Timestamp conversion
const friendlyDate = computed(() => {
	const date = props.post.date;

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
