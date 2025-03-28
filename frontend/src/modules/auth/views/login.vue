<template>
	<div class="text-white w-full flex-col flex items-center h-full justify-center">
		<div class="flex flex-col gap-2">
			<input type="text" placeholder="Email" v-model="email"
				class="border-2 border-type-secondary text-type-secondary rounded-sm p-1.5" />
			<input type="password" placeholder="Password" v-model="password"
				class="border-2 border-type-secondary text-type-secondary rounded-sm p-1.5" />
		</div>

		<button @click="login(email, password)"
			class="border border-type-secondary rounded-md py-1.5 px-3 text-sm mt-4 cursor-pointer">
			Sign in
		</button>
	</div>
</template>

<script setup lang="ts">
import router from "@/router";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";

const auth = getAuth();

const email = ref('');
const password = ref('');

const login = async (email: string, password: string) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		router.push({ name: 'admin' })
	} catch (error: unknown) {
		if (error instanceof FirebaseError) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error(errorCode, errorMessage);
		} else {
			console.error(error);
		}
	}
}

</script>