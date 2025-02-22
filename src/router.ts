import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/modules/home/views/home.vue';
import NotFound from '@/modules/errors/views/404.vue';
import ProjectDetails from './modules/projects/views/project-details.vue';
import Projects from './modules/projects/views/projects.vue';

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
		path: '/projects/:project',
		props: true,
		name: 'project-details',
		component: ProjectDetails,
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
	{
		path: '/:pathMatch(.*)*',
		name: '404',
		component: NotFound
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
