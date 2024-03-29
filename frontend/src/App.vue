<script setup>
	import {RouterLink, RouterView} from "vue-router";
	import Settings from "./components/Settings.vue";
</script>
<script>
	import axios from "axios";

	export default {
		inject: ["$toast"],
		data: () => ({
			loggedIn: false,
			routes: [],
			showSidebar: false
		}),
		components: {RouterLink, RouterView, Settings},
		mounted() {
			if (document.cookie.length > 0) {
				this.loggedIn = true;
				console.log("logged in");
			}
			this.routes = this.$router.options.routes;
			this.routes = this.routes.filter((route) => route.path != "/intro");
			this.$router.afterEach((to, from) => {
				this.color();
			});
			this.color();
		},
		methods: {
			logoClick: function () {
				let aspectRatio = window.innerWidth / window.innerHeight;
				if (aspectRatio > 1.16) {
					this.$router.push("/");
				} else {
					this.showSidebar = !this.showSidebar;
					let el = document.querySelector(".nav");
					let display = getComputedStyle(el).getPropertyValue("--display");
					el.style.setProperty("--display", display == "flex" ? "none" : "flex");
				}
			},
			async color() {
				if (this.loggedIn) {
					await axios
						.get("/node/color")
						.then((res) => {
							document.documentElement.setAttribute("data-theme", res.data);
						})
						.catch((err) => {
							console.log("error: " + err);
							document.documentElement.setAttribute("data-theme", "red");
						});
				} else {
					document.documentElement.setAttribute("data-theme", "red");
				}
			}
		}
	};
</script>

<template>
	<header>
		<div class="background"></div>
		<div class="logo center" @click="logoClick">
			<img src="/logo_1.png" alt="logo" />
		</div>
		<nav class="nav center" :key="loggedIn">
			<RouterLink v-for="route in routes" :to="route.path" class="navlink center" :class="route.path == $router.currentRoute.value.path ? 'selected' : ''">
				<p>{{ route.name == "Login" ? (loggedIn ? "Logout" : "Login") : route.name }}</p>
			</RouterLink>
		</nav>
	</header>
	<main class="page">
		<RouterView @login="loggedIn = !loggedIn" />
	</main>
</template>

<style scoped>
	/*Main layout*/
	.page {
		width: 100%;
		min-height: 75vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	main {
		width: 100%;
		min-height: 100%;
	}

	/*Nav bar*/
	header {
		height: 8vh;
		width: 100%;
		display: flex;
		flex-direction: row;
		z-index: 100;
		margin-bottom: 7.5vh;
	}
	header .background {
		background-color: var(--color-black-3);
		opacity: 0.25;
		width: 100%;
		height: 100%;
		position: absolute;
	}
	/* Logo */
	.logo {
		height: 200%;
		aspect-ratio: 1/1;
		float: left;
		background-color: var(--base-color-4);
		clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
		position: absolute;
		z-index: 2;
	}
	.logo:hover {
		cursor: pointer;
	}
	.logo img {
		height: 75%;
		width: 75%;
	}

	/*Nav links*/
	.nav {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 100%;
		margin-left: 8.5vh;
	}
	.nav .navlink {
		height: 100%;
		aspect-ratio: 12/3.86;
		margin-right: -6.5vh;
		background: linear-gradient(0.25turn, var(--color-black-2), var(--color-black-3));
		clip-path: polygon(0 0, 68% 0, 100% 100%, 32% 100%);
		text-decoration: none;
		border: 7px solid var(--color-black-2);
		transition: border-color 0.2s;
	}
	.nav .navlink p {
		color: var(--color-white);
		font-weight: bold;
		font-size: 2.2vh;
	}
	.nav .navlink.selected {
		background: linear-gradient(0.25turn, var(--base-color-5), var(--base-color-2));
		border-color: var(--base-color-5);
	}
	.nav .navlink:hover {
		background: linear-gradient(0.25turn, var(--base-color-3), var(--base-color-1));
		border-color: var(--base-color-4);
	}

	.footer {
		justify-content: space-between;
		padding: 5px 5%;
		max-height: 2.5vh;
		height: 100%;
		overflow: hidden;
	}

	/* Mobile changes */
	@media (max-aspect-ratio: 1.16) {
		@media (max-width: 999px) {
			.nav {
				width: 50%;
				min-width: 12rem;
				position: fixed;
				margin: 0;
				top: 7.5vh;
				left: 7.5vh;
				--display: none;
				display: var(--display);
				flex-direction: column;
				height: 50%;
				animation: stretch 0.5s forwards;
				-webkit-animation: stretch 0.5s forwards;
				overflow: hidden;
			}
			@keyframes stretch {
				0% {
					height: 0%;
				}
				100% {
					height: 50%;
				}
			}
			@-webkit-keyframes stretch {
				0% {
					height: 0%;
				}
				100% {
					height: 50%;
				}
			}
			.nav .navlink {
				width: 100%;
				margin-right: 0;
				clip-path: none;
				border-width: 3px;
				transition: background-color 0.5s, border-color 0.5s;
			}
			.nav .navlink p {
				font-size: 1.5rem;
			}
		}
		@media (min-width: 1000px) {
			header {
				height: 4vh;
				margin-bottom: 4vh;
			}
			.nav {
				margin-left: 4.5vh;
			}
			.nav .navlink {
				margin-right: -3.5vh;
			}
			.nav .navlink p {
				font-size: 1.3rem;
			}
		}
	}
</style>
