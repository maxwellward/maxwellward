import Projects from "@/modules/admin/views/projects.vue";
import AdminLayout from "./layout/admin-layout.vue";
import Admin from "@/modules/admin/views/admin.vue";

export const adminRoutes = [
	{
		path: '/admin',
		name: 'admin',
		redirect: { name: 'admin-home' },
		component: AdminLayout,
		meta: {
			requiresAuth: true
		},
		children: [
			{
				path: '',
				name: 'admin-home',
				component: Admin,
			},
			{
				path: 'projects',
				name: 'project-editor',
				component: Projects,
			}
		]
	},

]