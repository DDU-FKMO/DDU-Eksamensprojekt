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
			path: "/inventory",
			name: "Inventory",
			component: () => import("../views/inventory/Inventory.vue"),
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
//redirect and authentication
import axios, {AxiosError} from "axios";
router.beforeEach(async (to, from) => {
	if (to.meta.auth) {
		try {
			let token = localStorage.getItem("user");
			const config = {
				"x-access-token": token
			};
			if (!token) throw new Error("Not logged in");
			await axios
				.get("/node/auth", {headers:config})
				.then((res) => console.log(res))
				.catch((err) => {
					console.log(err.response.data);
					throw new Error("Invalid token");
				});

			//let decoded = VueJwtDecode.decode(token);
			//console.log(decoded.userName, " has logged in");
		} catch (err) {
			console.log(err);
			return {name: "Login"};
		}
	}
});

router.afterEach((to, from) => {
	document.title = to.name ? to.name + ` | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
});

export default router;
