import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/modules/home/views/home.vue';
import NotFound from '@/modules/errors/views/404.vue';
import ProjectDetails from './modules/projects/views/project-details.vue';
import Projects from './modules/projects/views/projects.vue';
import Login from './modules/auth/views/login.vue';
import { adminRoutes } from './modules/admin/routes';
import { getAuth } from 'firebase/auth';
import { firebase } from './main';
import Posts from './modules/posts/views/posts.vue';
import Post from './modules/posts/views/post.vue';
import PostEditor from './modules/posts/views/post-editor.vue';

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
		props: true,
	},
	{
		path: '/projects/:projectId',
		props: true,
		name: 'project-details',
		component: ProjectDetails,
	},
	{
		path: '/posts',
		name: 'posts',
		component: Posts,
		props: true,
	},
	{
		path: '/posts/:postId',
		props: true,
		name: 'post',
		component: Post,
	},
	{
		path: '/posts/edit/:postId?',
		props: true,
		name: 'post-editor',
		component: PostEditor,
	},
	{
		path: '/auth',
		name: 'auth',
		component: Login,
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
	...adminRoutes
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior() {
		return { top: 0 }
	},
});

router.beforeEach(async (to, _, next) => {
	if (to.meta.requiresAuth) {
		const auth = getAuth(firebase);
		await auth.authStateReady();

		const isAuthenticated = auth.currentUser;
		if (!isAuthenticated) {
			next({ name: 'auth' });
			return;
		}
	}
	next();
})

export default router;
