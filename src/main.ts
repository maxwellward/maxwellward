import { createApp } from 'vue';
import './main.css';
import App from './App.vue';
import './assets/tailwind.css';
import router from './router';
import { initializeApp } from 'firebase/app'
import { createPinia } from 'pinia'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "portfolio-42e1a.firebaseapp.com",
	projectId: "portfolio-42e1a",
	storageBucket: "portfolio-42e1a.firebasestorage.app",
	messagingSenderId: "161479179106",
	appId: "1:161479179106:web:6d8b682ae1761a60240a3b"
};

// TODO: Do Firebase initialization in it's own file
export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app');