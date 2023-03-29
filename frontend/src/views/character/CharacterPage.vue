<template>
	<main>
		<h1>Character</h1>
		<p>Level: {{ level }}</p>
		<p>Streak: {{ streak }}</p>
		<p v-if="gotStreakThisWeek">User has completed their training this week! Good Job!</p>
		<MuscleGroups />
	</main>
</template>

<script>
	import MuscleGroups from "./MuscleGroups.vue";

	export default {
		name: "CharacterPage",
		data: () => ({
			level: null,
			streak: 0,
			gotStreakThisWeek: false
		}),
		components: {
			MuscleGroups
		},
		methods: {
			getLevel: function () {
				fetch("/character/level", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: null
					})
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.status == "error") throw new Error(data.message);
						else {
							console.log("Level success:", data);
							this.level = data;
							this.gotStreakThisWeek = data.hasTrained;
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			},
			getStreak: function () {
				fetch("/character/get-streak", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: null
					})
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.message == "error"){
							throw new Error(data.message)
						}
						else{
						console.log("streak : "+data);
						this.streak = data.streak;
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		},
		mounted() {
			this.getLevel();
			this.getStreak();
		}
	};
</script>
