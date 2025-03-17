<template>
	<router-link
		v-if="routeName"
		:class="[colourful ? 'bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 background-animate' : 'bg-secondary']"
		class="py-3 px-8 rounded-lg text-type-primary font-semibold flex gap-2 w-fit"
		:to="{ name: routeName }">
		<p>{{ text }}</p>
		<ArrowLongRightIcon class="size-6"
	/></router-link>
	<button
		v-else
		:class="[colourful ? 'bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 background-animate' : 'bg-secondary']"
		class="py-3 px-8 rounded-lg text-type-primary font-semibold flex gap-2">
		<p>{{ text }}</p>
		<ArrowLongRightIcon class="size-6" />
	</button>
</template>

<script lang="ts" setup>
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid';

defineProps({
	text: {
		type: String,
		required: true,
	},
	colourful: {
		type: Boolean,
		default: false,
	},
	routeName: {
		type: String,
		default: undefined,
	},
});
</script>

<style>
.background-animate {
	background-size: 400%;

	-webkit-animation: ColourAnimate4s ease-in-out infinite;
	-moz-animation: ColourAnimate 4s ease-in-out infinite;
	animation: ColourAnimate 4s ease-in-out infinite;

	animation-play-state: paused;
}

.background-animate:hover {
	animation-play-state: running;
}

@keyframes ColourAnimate {
	0%,
	100% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
}
</style>
