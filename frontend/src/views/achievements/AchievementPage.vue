<template>
	<h1 class="title">Achievements</h1>
    <h2>Level: {{ data.level }}</h2>
    <h3>Streak to next level: {{ data.streak % 7 }} / 7</h3>
	<div class="unlocks">
		<div v-for="name in data.unlockNames">
			<Achievement :AcName="AcNames" :unlockName="name" :id="data.unlockNames.indexOf(name)" :unlocked="data.unlockNames.indexOf(name) < data.level"></Achievement>
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
                AcNames: "Achievement Name"
			};
		},
		mounted() {
			this.getAchievements();
		},
		methods: {
			async getAchievements() {
				try {
					await axios
						.get("/node/achievements")
						.then((res) => {
							this.data = res.data;
                            console.log(data.unlockNames)
						})
						.catch((err) => {
							console.log("error: " + err);
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
