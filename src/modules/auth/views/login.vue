<template>
	<div class="text-white">
		<p>Welcome</p>
		<input type="text" placeholder="Email" v-model="email" />
		<input type="password" placeholder="Password" v-model="password" />
		<button @click="login(email, password)">Sign in</button>
	</div>
</template>

<script setup lang="ts">
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";

const auth = getAuth();

const email = ref('');
const password = ref('');

const login = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		console.log(user);
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