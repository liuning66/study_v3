import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/grammer',
		},
		{
			path: '/xtermal',
			name: 'xtermal',
			component: () => import('../components/Xtermal.vue'),
		},
		{
			path: '/grammer',
			name: 'grammer',
			component: () => import('../views/Grammar.vue'),
		},
		{
			path: '/orgstructure',
			name: 'orgstructure',
			component: () => import('../views/OrgStructure.vue'),
		}
	],
});

export default router;
