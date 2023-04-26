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
				<div class="text">
					<p>Average sets: {{ average[selectedExercise].sets }}</p>
					<p>Average weight: {{ average[selectedExercise].weight }}</p>
				</div>
			</div>
			<div class="stat-element">
				<div class="background"></div>
				<div class="chart-container">
					<Chart v-if="chartData != {}" :options="chartData" id="chart" />
				</div>
			</div>
		</div>
		<div class="stat-elements" v-else>
			<div class="stat-element">
				<div class="background"></div>
				<h4>Overview</h4>
				<div class="text">
					<p>Average sets: {{ combinedAverage.sets }}</p>
					<p>Average weight: {{ combinedAverage.weight }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {Chart} from "highcharts-vue";
	export default {
		name: "Statistics",
		data: () => ({
			setsOverTime: {},
			weightOverTime: {},
			average: {},
			sessions: [],
			dates: [],
			selectedExercise: "overview",
			combinedAverage: {},
			chartData: {}
		}),
		components: {
			Chart
		},
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
						this.dates = data.dates;
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
		},
		watch: {
			selectedExercise: function (newVal, oldVal) {
				if (newVal != oldVal) {
					this.createTimeGraph(
						"chart",
						newVal + " Chart",
						[
							{name: "Sets", data: this.setsOverTime[newVal]},
							{name: "Weight", data: this.weightOverTime[newVal]}
						],
						this.dates.map((date) => date.slice(0, 10))
					);
				}
			}
		},
		methods: {
			createTimeGraph: function (id, name, data, timeData) {
				this.chartData = {
					series: data,
					title: {
						text: name,
						align: "center",
						style: {
							fontSize: "0.9em",
							color: "white"
						}
					},
					legend: {
						enabled: true,
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
							borderRadius: 10
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
		flex-direction: row;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
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
	#chart {
		width: 100%;
		height: 100%;
	}
</style>
