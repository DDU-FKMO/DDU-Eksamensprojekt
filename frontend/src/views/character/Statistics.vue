<template>
	<div class="stats">
		<h2>Statistics</h2>
		<div class="select">
			<select v-model="selectedExercise">
				<option disabled value="">Please select an exercise</option>
				<option v-for="exercise in Object.keys(average)" :value="exercise">{{ exercise }}</option>
			</select>
		</div>
		<div class="stat-elements" v-if="selectedExercise">
			<div class="stat-element" v-if="selectedExercise != ''">
				<div class="background"></div>
				<div class="text">
					<p>Average sets: {{ average[selectedExercise].sets }}</p>
					<p>Average reps: {{ average[selectedExercise].reps }}</p>
					<p>Average weight: {{ average[selectedExercise].weight }}</p>
				</div>
			</div>
			<div class="stat-element">
				<div class="background"></div>
				<div class="chart-container">
					<Chart class="chart" v-if="chartData.sets != {}" :options="chartData.sets" />
				</div>
			</div>
			<div class="stat-element">
				<div class="background"></div>
				<div class="chart-container">
					<Chart class="chart" v-if="chartData.reps != {}" :options="chartData.reps" />
				</div>
			</div>
			<div class="stat-element">
				<div class="background"></div>
				<div class="chart-container">
					<Chart class="chart" v-if="chartData.weight != {}" :options="chartData.weight" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {Chart} from "highcharts-vue";
	export default {
		name: "Statistics",
		inject: ["$toast"],
		data: () => ({
			setsOverTime: {},
			weightOverTime: {},
			average: {},
			sessions: [],
			dates: [],
			selectedExercise: "",
			combinedAverage: {},
			chartData: {
				sets: {},
				reps: {},
				weight: {}
			}
		}),
		components: {
			Chart
		},
		mounted() {
			fetch("/statistics/all")
				.then(async (response) => {
					if (response.status == 400)
						await response.text().then((t) => {
							throw new Error(t);
						});
					else return response.json();
				})
				.then((data) => {
					console.log("Statistics:", data);
					this.setsOverTime = data.setsOverTime;
					this.repsOverTime = data.repsOverTime;
					this.weightOverTime = data.weightOverTime;
					this.average = data.average;
					this.sessions = data.sessions;
				})
				.catch((error) => {
					console.error(error);
					this.$toast.error(error);
				});
			fetch("/statistics/average")
				.then(async (response) => {
					if (response.status == 400)
						await response.text().then((t) => {
							throw new Error(t);
						});
					else return response.json();
				})
				.then((data) => {
					console.log("Combined average:", data);
					this.combinedAverage = data;
				})
				.catch((error) => {
					console.error(error);
					this.$toast.error(error);
				});
		},
		watch: {
			selectedExercise: function (newVal, oldVal) {
				if (newVal != oldVal) {
					this.createTimeGraph(
						[
							{name: "Sets", data: Object.values(this.setsOverTime[newVal])},
							{name: "Reps", data: Object.values(this.repsOverTime[newVal])},
							{name: "Weight", data: Object.values(this.weightOverTime[newVal])}
						],
						Object.keys(this.setsOverTime[newVal]).map((date) => new Date(date).toLocaleDateString())
					);
				}
			}
		},
		methods: {
			createTimeGraph: function (data, timeData) {
				console.log("Data", data);
				for (let series of data) {
					console.log("Series " + series.name, series);
					this.chartData[series.name.toLowerCase()] = {
						series: [series],
						title: {
							text: series.name,
							align: "center",
							style: {
								fontSize: "0.9em",
								color: "white"
							},
							animation: false
						},
						legend: {
							enabled: false,
							itemStyle: {
								color: "white"
							},
							layout: "horizontal",
							padding: 0
						},
						chart: {
							backgroundColor: "transparent",
							animation: false,
							type: "column"
						},
						yAxis: {
							title: {
								text: "",
								style: {
									color: "white"
								}
							},
							labels: {
								style: {
									color: "white",
									fontWeight: "bold"
								}
							}
						},
						xAxis: {
							categories: timeData,

							labels: {
								style: {
									color: "white",
									fontWeight: "bold"
								}
							}
						},
						plotOptions: {
							column: {
								margin: 2,
								pointPadding: 0,
								groupPadding: 0.1,
								shadow: false,
								borderWidth: 2,
								borderColor: "var(--color-white)",
								borderRadius: 10,
								animation: false
							}
						},
						credits: {
							enabled: false
						},
						exporting: {
							buttons: {
								contextButton: {
									menuItems: ["downloadCSV", "downloadXLS"]
								}
							}
						},
						colors: ["var(--base-color-1)", "var(--base-color-3)", "var(--base-color-4)", "var(--base-color-5)"]
					};
				}
				console.log("Charts", this.chartData);
			}
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
		padding: 1%;
		margin-bottom: 1em;
		color: var(--color-white);
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
	.stat-elements .stat-element .text {
		justify-self: center;
		flex-direction: column;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	/* Selection */
	.select {
		width: 50%;
		height: 2em;
		margin: 1em 0;
	}
	.select select {
		height: 100%;
		margin: 0;
		font-size: 1.25em;
	}

	/* Charts */
	.chart-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.chart {
		width: 100%;
		height: 100%;
	}
</style>
