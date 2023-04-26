<template>
	<div class="stats">
		<h2>Statistics</h2>
		<div class="select">
			<select v-model="selectedExercise">
				<option disabled value="">Please select one</option>
				<option value="overview">Overview</option>
				<option v-for="exercise in Object.keys(average)" :value="exercise">{{ exercise }}</option>
			</select>
		</div>
		<div class="stat-elements" v-if="selectedExercise != 'overview'">
			<div class="stat-element" v-if="selectedExercise != ''">
				<div class="background"></div>
				<h4>{{ selectedExercise }}</h4>
				<div>
					<p>Average sets: {{ average[selectedExercise].sets }}</p>
					<p>Average weight: {{ average[selectedExercise].weight }}</p>
				</div>
			</div>
			<div class="stat-element">
				<div class="background"></div>
				<img src="/stat-2.png" />
			</div>
		</div>
		<div class="stat-elements" v-else>
			<div class="stat-element">
				<div class="background"></div>
				<h4>Overview</h4>
				<div>
					<p>Average sets: {{ combinedAverage.sets }}</p>
					<p>Average weight: {{ combinedAverage.weight }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Statistics",
		data: () => ({
			setsOverTime: {},
			weightOverTime: {},
			average: {},
			sessions: [],
			selectedExercise: "overview",
			combinedAverage: {}
		}),
		methods: {},
		mounted() {
			fetch("/statistics/all")
				.then((response) => response.json())
				.then((data) => {
					if (data.status == "error") throw new Error(data.message);
					else {
						console.log("Statistics:", data);
						this.setsOverTime = data.setsOverTime;
						this.weightOverTime = data.weightOverTime;
						this.average = data.average;
						this.sessions = data.sessions;
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
			fetch("/statistics/average")
				.then((response) => response.json())
				.then((data) => {
					if (data.status == "error") throw new Error(data.message);
					else {
						console.log("Combined average:", data);
						this.combinedAverage = data;
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	};
</script>

<style scoped>
	.stats {
		width: 100%;
		height: 70%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.stat-elements {
		width: 100%;
		height: 80%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
	}

	.stat-elements .stat-element {
		justify-self: center;
		flex-direction: column;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 40%;
		aspect-ratio: 1/1;
	}
	.stat-elements .stat-element .background {
		background-color: var(--base-color-2);
		opacity: 0.5;
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.stat-elements .stat-element img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.stat-elements .stat-element div {
		justify-self: center;
		flex-direction: row;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
</style>
