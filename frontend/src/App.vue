<script setup>
	import {RouterLink, RouterView} from "vue-router";
</script>
<script>
export default {
  data() {
    return {
      loggedIn: false
    }
  },
  mounted(){
	if (!(localStorage.getItem("user") === null)){
		this.loggedIn = true;
	}
  }
}
</script>


<template>
	<header>
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/training">Training</RouterLink>
			<RouterLink to="/log">Log</RouterLink>
			<RouterLink to="/character">Character</RouterLink>
			<RouterLink to="/login" :key="loggedIn">{{ (loggedIn ? "Logout" : "Login")}}</RouterLink>
		</nav>
	</header>
	<main>
		<RouterView @login="loggedIn = !loggedIn"/>
	</main>
</template>

<style scoped>
	header {
		min-height: 5vh;
		width: 100%;
	}

	main {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	nav {
		width: 100%;
		font-size: 12px;
		text-align: center;
		margin-top: 2rem;
	}

	nav a.router-link-exact-active {
		color: var(--color-text);
	}

	nav a.router-link-exact-active:hover {
		background-color: transparent;
	}

	nav a {
		display: inline-block;
		padding: 0 1rem;
		border-left: 1px solid var(--color-border);
		height: 100%;
		flex: stretch;
	}

	nav a:first-of-type {
		border: 0;
	}
</style>
