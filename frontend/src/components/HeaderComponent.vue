<template>
	<div class="flex justify-between w-full items-center sm:w-4/5">
		<router-link :to="{ name: 'home' }" class="p-7 bg-primary">
			<p class="font-bold text-xl text-type-primary">Maxwell Ward</p>
		</router-link>

		<!-- Mobile Dropdown -->
		<div class="relative block sm:hidden">
			<button class="px-7 text-type-primary" @click="toggleDropdown">
				<span class="sr-only">Toggle Dropdown</span>
				<svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
					</path>
				</svg>
			</button>
			<div v-if="isDropdownOpen"
				class="absolute right-7 mt-2 w-48 bg-secondary text-type-primary rounded-md shadow-lg text-sm"
				@click="toggleDropdown">
				<router-link :to="{ name: 'home' }" class="block px-5 py-3">home</router-link>
				<!-- <router-link :to="{ name: 'about' }" class="block px-5 py-3">about</router-link> -->
				<router-link :to="{ name: 'projects' }" class="block px-5 py-3">my work</router-link>
			</div>
		</div>

		<div class="hidden sm:flex text-type-secondary font-bold gap-20 p-7 bg-primary">
			<router-link :to="{ name: 'home' }">
				<p class="font-bold text-type-secondary">home</p>
			</router-link>
			<!-- <router-link :to="{ name: 'about' }">
				<p class="font-bold text-type-secondary">about</p>
			</router-link> -->
			<router-link :to="{ name: 'projects' }">
				<p class="font-bold text-type-secondary">my work</p>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value;
};
</script>
