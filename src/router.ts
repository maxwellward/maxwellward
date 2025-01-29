import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/modules/home/views/home.vue';
import Projects from '@/modules/projects/views/projects.vue';
import NotFound from '@/modules/errors/views/404.vue';

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
	},
	{
		path: '/projects',
		name: 'projects',
		component: Projects,
	},
	{
		path: '/about',
		name: 'about',
		component: Home,
	},
	{
		path: '/contact',
		name: 'contact',
		component: Home,
	},
	{ path: '/:pathMatch(.*)*', name: '404', component: NotFound },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
