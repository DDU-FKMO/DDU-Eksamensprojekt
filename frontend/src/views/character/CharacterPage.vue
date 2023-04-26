<template>
	<main>
		<div class="character center">
			<div class="background"></div>
			<div class="name">
				<h2>{{ username }}</h2>
			</div>
			<Character />
			<div class="level">
				<p>Level {{ level }}</p>
			</div>
		</div>
		<div class="statistics center">
			<div class="streak">
				<p>Streak: {{ streak }}</p>
			</div>
			<div class="motivationl">
				<p v-if="gotStreakThisWeek">User has completed their training this week! Good Job!</p>
				<p v-else>You still have time to complete your training this week!</p>
			</div>
			<div class="stats">
				<h2>Statistics</h2>
				<div class="stat-elements">
					<div class="stat-element">
						<div class="background"></div>
						<img src="/stat-1.webp" />
					</div>
					<div class="stat-element">
						<div class="background"></div>
						<img src="/stat-2.png" />
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import Character from "./Character.vue";

	export default {
		name: "CharacterPage",
		data: () => ({
			level: null,
			streak: 0,
			gotStreakThisWeek: false,
			username: "Filip"
		}),
		components: {
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
						if (data.message == "error") {
							throw new Error(data.message);
						} else {
							console.log("streak : " + data);
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

<style>
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
		width: 30%;
		height: 75%;
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
		width: 33%;
		min-width: 10rem;
		height: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to right, var(--color-gold-2), var(--color-gold-1), var(--color-gold-2));
		font-size: 2rem;
		clip-path: polygon(100% 0, 80% 50%, 100% 100%, 0 100%, 20% 50%, 0 0);
	}

	.statistics .stats {
		width: 100%;
		height: 70%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.statistics .stat-elements {
		width: 100%;
		height: 80%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
	}

	.statistics .stat-elements .stat-element {
		justify-self: center;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 40%;
		aspect-ratio: 1/1;
	}
	.statistics .stat-elements .stat-element .background {
		background-color: var(--base-color-2);
		opacity: 0.5;
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.statistics .stat-elements .stat-element img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
