import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomePage.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "Character",
			component: () => import("../views/character/CharacterPage.vue"),
			meta: {auth: true}
		},
		{
			path: "/training",
			name: "Training",
			component: () => import("../views/trainingProgram/TrainingPage.vue"),
			meta: {auth: true}
		},
		{
			path: "/log",
			name: "Log Session",
			component: () => import("../views/logSession/LogPage.vue"),
			meta: {auth: true}
		},
		{
			path: "/login",
			name: "Login",
			component: () => import("../views/userAuth/Login.vue"),
			meta: {auth: false}
		}
	]
});

let DEFAULT_TITLE = "DDU";
router.afterEach((to, from) => {
	document.title = to.name ? to.name + ` | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
});

export default router;
