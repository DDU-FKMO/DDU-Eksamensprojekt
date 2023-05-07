<template>
	<h1 class="title">Achievements</h1>
	<h2>Level: {{ data.level }}</h2>
	<h3>Streak to next level: {{ data.streak % 5 }} / 5</h3>
	<div class="unlocks">
		<div v-for="name in data.unlockNames">
			<Achievement :AcName="AcNames[data.unlockNames.indexOf(name)]" :unlockName="name" :id="data.unlockNames.indexOf(name)" :unlocked="data.unlockNames.indexOf(name) < data.level"></Achievement>
			<!-- 
            AcName: String,
			unlockName: String,
			id: String,
			unlocked: Boolean 
            -->
		</div>
	</div>
</template>

<style scoped>
	.unlocks {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: center;
		align-content: space-around;
	}
	.title {
		position: static;
		top: 1vh;
		padding-bottom: 0.1vmin;
	}
</style>

<script>
	import Achievement from "./Achievement.vue";
	import axios from "axios";
	export default {
		data() {
			return {
				data: {},
				AcNames: ["Getting Started", "Hanging in there", "Feeling Changes", "Looking Good", "Getting Fit", "Shirts are Getting Tight", "Dwayne Johnson", "Build like a Beast", "Rawr ;)"]
			};
		},
		inject: ["$toast"],
		mounted() {
			this.getAchievements();
		},
		methods: {
			async getAchievements() {
				try {
					await fetch("/node/achievements")
						.then(async (response) => {
							console.log("Response:", response);
							if (response.status == 400)
								await response.text().then((t) => {
									throw new Error(t);
								});
							else return response.json();
						})
						.then((data) => {
							this.data = data;
							console.log("Achievements: ", this.data);
						})
						.catch((err) => {
							console.log(err);
							this.$toast.error(err);
						});
				} catch (err) {
					console.log("Something went wrong... " + err);
				}
			}
		},
		components: {
			Achievement
		}
	};
</script>
