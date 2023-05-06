<template>
	<main>
		<div class="character center">
			<div class="background"></div>
			<div class="name">
				<h2>{{ username }}</h2>
			</div>
			<Character :name="username" />
			<div class="level">
				<p>Level {{ level }}</p>
			</div>
		</div>
		<div class="statistics center">
			<div class="streak">
				<p>Streak: {{ streak }}</p>
			</div>
			<div class="motivationl">
				<p v-if="gotStreakThisWeek">You have completed your training this week! Good Job!</p>
				<p v-else>You still have time to complete your training this week!</p>
			</div>
			<Statistics />
		</div>
	</main>
</template>

<script>
	import Character from "./Character.vue";
	import Statistics from "./Statistics.vue";

	export default {
		name: "CharacterPage",
		inject: ["$toast"],
		data: () => ({
			level: 0,
			streak: 0,
			gotStreakThisWeek: false,
			username: ""
		}),
		components: {
			Character,
			Statistics
		},
		methods: {
			getLevel: function () {
				fetch("/character/level")
					.then(async (response) => {
						if (response.status == 400) {
							await response.text().then((t) => {
								throw new Error(t);
							});
						} else return response.json();
					})
					.then((data) => {
						console.log("Level success:", data);
						this.level = data;
					})
					.catch((error) => {
						console.error(error);
						this.$toast.error(error);
					});
			},
			getStreak: function () {
				fetch("/character/get-streak")
					.then(async (response) => {
						if (response.status == 400) {
							await response.text().then((t) => {
								throw new Error(t);
							});
						} else return response.json();
					})
					.then((data) => {
						console.log("streak : " + data);
						this.streak = data.streak;
						this.gotStreakThisWeek = data.hasTrained;
					})
					.catch((error) => {
						console.error(error);
						this.$toast.error(error);
					});
			}
		},
		mounted() {
			this.getLevel();
			this.getStreak();
			fetch("/character/name")
				.then(async (response) => {
					if (response.status == 400)
						await response.text().then((t) => {
							throw new Error(t);
						});
					else return response.json();
				})
				.then((data) => {
					console.log("Name:", data);
					this.username = data.name;
				});
		}
	};
</script>

<style scoped>
	/* Main */
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		align-content: center;
		justify-content: space-evenly;
	}
	/*Character side */
	.character {
		width: 25%;
		flex-direction: column;
		justify-content: space-between;
	}
	.character .background {
		background-color: var(--color-black-3);
		opacity: 0.5;
		width: 100%;
		height: 100%;
		position: absolute;
	}
	.character .name {
		width: 100%;
		height: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to right, var(--base-color-3), var(--base-color-2), var(--base-color-3));
	}
	.character .level {
		width: 50%;
		height: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--color-black-1);
		background: linear-gradient(to right, var(--color-gold-2), var(--color-gold-1), var(--color-gold-2));
	}

	/*Statistics side */
	.statistics {
		width: 50%;
		height: 75%;
		flex-direction: column;
		justify-content: space-evenly;
	}
	.statistics .streak {
		width: 50%;
		min-width: 10rem;
		max-width: 20rem;
		height: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--color-black-1);
		background: linear-gradient(to right, var(--color-gold-2), var(--color-gold-1), var(--color-gold-2));
		font-size: 2rem;
		clip-path: polygon(100% 0, 80% 50%, 100% 100%, 0 100%, 20% 50%, 0 0);
	}

	/* Mobile changes */
	@media (max-aspect-ratio: 0.84) {
		main {
			flex-direction: column;
			justify-content: space-between;
		}
		.character,
		.statistics {
			width: 80%;
			margin-bottom: 5%;
		}
	}
</style>
