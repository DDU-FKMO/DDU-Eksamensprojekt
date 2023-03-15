import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomePage.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: HomeView
		},
		{
			path: "/training",
			name: "Traning Program",
			component: () => import("../views/trainingProgram/TrainingPage.vue")
		},
		{
			path: "/log",
			name: "Log Session",
			component: () => import("../views/logSession/LogPage.vue")
		},
		{
			path: "/character",
			name: "Character",
			component: () => import("../views/character/CharacterPage.vue")
		}
	]
});

let DEFAULT_TITLE = "DDU";
router.afterEach((to, from) => {
	document.title = to.name ? to.name + ` | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
});

export default router;
