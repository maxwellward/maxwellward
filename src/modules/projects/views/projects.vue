<template>
	<div class="sm:ml-64 lg:ml-80 relative mt-16 sm:mt-32 h-fit">
		<div class="sm:w-3/4 h-fit left-0 right-0 my-auto ml-7 sm:ml-0">
			<h1 class="text-type-primary font-bold text-4xl mb-10">Projects</h1>
			<div class="size-full dot-matrix p-12 flex flex-wrap gap-16 w-5/6 sm:max-w-[1100px]">
				<Project
					v-for="project in projects"
					:key="project.title"
					:title="project.title"
					:date="project.date"
					:description="project.description"
					:link="project.link" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Project from '@/modules/projects/components/project.vue';

const projects = ref([
	{
		title: 'Asteroids',
		date: 'Spring 2019',
		description: 'A clone of the 1979 hit game "Asteroids" by Lyle Rains and Ed Logg (Atari). Built in Unity with C#.',
		link: 'https://github.com/maxwellward/Asteroids',
	},
	{
		title: 'Discord Package Explorer',
		date: 'Winter 2022',
		description: 'Explore your Discord data package with a simple to use user interface.',
		link: 'https://github.com/peterhanania/Discord-Package',
	},
	{
		title: 'Burnout Torches',
		date: 'Spring 2022',
		description: 'A Minecraft Spigot/Paper plugin that causes torches to break and drop an item after a set time.',
		link: 'https://github.com/maxwellward/BurnoutTorches',
	},
	{
		title: 'Slothpixel API',
		date: 'Winter 2020',
		description: 'A wrapper to simplify and clean up data returned by the official Hypixel Games API.',
		link: 'https://github.com/slothpixel/core',
	},
]);
</script>

<style>
.dot-matrix {
	background-image: radial-gradient(#1f1d29 1.6500000000000001px, #13111c 1.6500000000000001px);
	background-size: 33px 33px;
}
</style>
