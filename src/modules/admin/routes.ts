import Admin from "@/modules/admin/views/admin.vue";
import Projects from "@/modules/admin/views/projects.vue";

export const adminRoutes = [
	{
		path: '/admin',
		name: 'admin',
		component: Admin,
		meta: {
			requiresAuth: true
		},
	},
	{
		path: '/admin/projects',
		name: 'project-editor',
		component: Projects,
		meta: {
			requiresAuth: true
		},
	}
]