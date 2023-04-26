<template>
	<div class="settings center">
		<div class="theme center">
			<h2>Theme:</h2>
			<div class="theme-buttons center">
				<button class="theme-button" :style="'background-color:' + themes[theme]" @click="setTheme(theme)" v-for="theme in Object.keys(themes)"></button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Settings",
		data: () => ({
			themes: {
				red: "#ff0000",
				blue: "#0e4c73",
				icyBlue: "#398cbf",
				green: "#0abf04",
				natureGreen: "#65a603",
				yellow: "#ffea2a",
				purple: "#8850bf",
				pink: "#bf1564"
			}
		}),
		methods: {
			setTheme(theme) {
				document.documentElement.setAttribute("data-theme", theme);
			}
		},
		mounted() {
			document.documentElement.setAttribute("data-theme", "red");
		}
	};
</script>

<style>
	.theme h2 {
		margin: 0;
		margin-right: 0.5em;
	}

	.settings,
	.theme,
	.theme-buttons {
		height: 100%;
	}

	.theme-button {
		width: 3em;
		height: 100%;
	}
	.theme-button:hover {
		cursor: pointer;
	}
</style>
