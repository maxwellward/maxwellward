<template>
	<router-view />
	<button @click="logout" class="w-full mt-auto flex justify-center">
		<p class="font-mono text-xs text-white">Logout</p>
	</button>
</template>

<script setup lang="ts">
import router from "@/router";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

const logout = async () => {
	await signOut(auth);
	router.push({ name: "home" });
}

</script>