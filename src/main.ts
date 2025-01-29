import { createApp } from 'vue';
import './main.css';
import App from './App.vue';
import './assets/tailwind.css';
import router from './router';

createApp(App).use(router).mount('#app');
