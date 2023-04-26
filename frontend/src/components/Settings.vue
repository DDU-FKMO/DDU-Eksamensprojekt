<template>
	<div class="settings center">
		<div class="theme center">
			<h2>Theme:</h2>
			<div class="theme-buttons center">
				<button class="theme-button red" @click="setTheme('red')">Red</button>
				<button class="theme-button blue" @click="setTheme('blue')">Blue</button>
				<button class="theme-button green" @click="setTheme('green')">Green</button>
				<button class="theme-button purple" @click="setTheme('purple')">Purple</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Settings",
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
	.red {
		background-color: #ff4343;
	}
	.blue {
		background-color: #0070f3;
	}
	.green {
		background-color: #00ff29;
	}
	.purple {
		background-color: #7000ff;
	}

	.theme h2 {
		margin: 0;
		margin-right: 0.5em;
	}
</style>
