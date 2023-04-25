<script setup>
	import {RouterLink, RouterView} from "vue-router";
</script>
<script>
	export default {
		data() {
			return {
				loggedIn: false,
				routes: []
			};
		},
		mounted() {
			if (!(localStorage.getItem("user") === null)) {
				this.loggedIn = true;
			}
			console.log("App mounted");
			console.log("Routes", this.$router.options.routes);
			this.routes = this.$router.options.routes;
			console.log("Routes 2", this.routes);
		}
	};
</script>

<template>
	<header>
		<div class="background"></div>
		<RouterLink to="/" class="logo center">
			<img src="../public/logo.png" alt="logo" />
		</RouterLink>
		<nav class="nav center">
			<RouterLink v-for="route in routes" :to="route.path" class="navlink center" :class="route.path == route.path ? 'selected' : ''">
				<p>{{ route.name == Login ? (loggedIn ? "Logout" : "Login") : route.name }}</p>
			</RouterLink>
		</nav>
	</header>
	<main>
		<RouterView @login="loggedIn = !loggedIn" />
	</main>
</template>


<style scoped>
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	/*Main layout*/
	main {
		width: 100%;
		min-height: 95vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	/*Nav bar*/
	header {
		height: 7.5vh;
		width: 100%;
		display: flex;
		flex-direction: row;
		z-index: 100;
	}
	header .background {
		background-color: var(--color-black-3);
		opacity: 0.5;
		width: 100%;
		height: 100%;
		position: absolute;
	}
	/* Logo */
	.logo {
		height: 200%;
		aspect-ratio: 1/1;
		float: left;
		background-color: var(--base-color-5);
		clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
		position: absolute;
		z-index: 2;
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
		background-color: var(--color-black-3);
		clip-path: polygon(0 0, 68% 0, 100% 100%, 32% 100%);
		text-decoration: none;
		border: 7px solid var(--color-black-2);
		transition: background-color 0.5s, border-color 0.5s;
	}
	.nav .navlink p {
		color: var(--color-white);
		font-weight: bold;
		font-size: 2.5vh;
	}
	.nav .navlink.selected {
		background-color: var(--base-color-4);
		border-color: var(--base-color-5);
	}
	.nav .navlink:hover {
		background-color: var(--base-color-3);
		border-color: var(--base-color-4);
	}
</style>
