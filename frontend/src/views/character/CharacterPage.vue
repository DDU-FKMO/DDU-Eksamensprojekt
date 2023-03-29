<template>
	<main>
		<h1>Character</h1>
		<Character />
		<p>Level: {{ level }}</p>
		<MuscleGroups />
	</main>
</template>

<script>
	import MuscleGroups from "./MuscleGroups.vue";
	import Character from "./Character.vue";

	export default {
		name: "CharacterPage",
		data: () => ({
			level: null,
			streak: 0,
			gotStreakThisWeek: false
		}),
		components: {
			MuscleGroups,
			Character
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
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			},
			getStreak: function () {}
		},
		mounted() {
			this.getLevel();
		}
	};
</script>
