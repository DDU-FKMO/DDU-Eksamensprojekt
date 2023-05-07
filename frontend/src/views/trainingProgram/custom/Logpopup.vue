<template>
	<div class="logpopup">
		<button @click="OpenPopup" class="basebutton schedulebutton">Log</button>
		<div v-if="popupOpen" class="popupform">
			<div class="popupheader">
				<p class="popuptitle">{{ day }}</p>
				<button @click="() => (popupOpen = false)" class="basebutton popupbutton">x</button>
			</div>
			<div v-if="stats[i - 1]" class="previous">
				<p>Previous session:</p>
				<p>{{ stats[i - 1].sets }} sets of {{ stats[i - 1].reps }} reps with a weight of {{ stats[i - 1].weight }}</p>
			</div>
			<div v-for="i in exercises.length">
				<p class="popupsubtitle">{{ info[i - 1].nameOfExercise }}</p>
				<div class="popupcontent">
					<div class="popuplabel">
						<label for="reps">Reps: </label>
						<input type="number" name="reps" v-model="info[i - 1].reps" />
					</div>
					<div class="popuplabel">
						<label for="sets">Sets: </label>
						<input type="number" name="sets" v-model="info[i - 1].sets" />
					</div>
					<div class="popuplabel">
						<label for="weight">Weight: </label>
						<input type="number" name="weight" v-model="info[i - 1].weight" />
					</div>
				</div>
			</div>
			<div class="popupfooter">
				<button @click="SaveSession" class="basebutton savebutton">Save</button>
			</div>
		</div>
	</div>
	<div class="shroud" v-if="popupOpen"></div>
</template>

<script>
	import {defineComponent} from "vue";

	export default defineComponent({
		data: () => ({
			popupOpen: false,
			info: [],
			stats: []
		}),
		name: "Logpopup",
		inject: ["$toast"],
		props: {
			exercises: {
				type: Array,
				required: true
			},
			day: {
				type: String,
				required: true
			}
		},
		methods: {
			OpenPopup() {
				this.popupOpen = true;
				let count = 0;
				this.GetPreviousInfo();
				for (let exercise in this.exercises) {
					this.info[count] = {};
					this.info[count].nameOfExercise = this.exercises[exercise].name;
					this.info[count].sets = 0;
					this.info[count].weight = 0;
					this.info[count].reps = 0;
					count++;
				}
				console.log(this.info);
			},
			SaveSession() {
				let data = {};
				data.info = this.info;
				data.info = data.info.filter((i) => i.reps != 0 && i.sets != 0);
				console.log("Log:", data.info);
				fetch("trainingProgram/log", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(data)
				});
				this.$toast.success("Logged session successfully!");
				this.popupOpen = false;
			},
			async GetPreviousInfo() {
				for (let exercise in this.exercises) {
					this.stats[exercise] = await fetch("statistics/latest/" + this.exercises[exercise].name)
						.then(async (response) => {
							if (response.status == 400)
								await response.text().then((t) => {
									throw new Error(t);
								});
							else return response.json();
						})
						.catch((error) => {
							console.error(error);
						});
				}
			}
		}
	});
</script>

<style scoped>
	.logpopup {
		width: 80%;
	}
	.popupform {
		position: fixed;
		border: 3px solid rgba(0, 0, 0, 0.3);
		background-color: white;
		z-index: 3;
		width: 50%;
		left: 25%;
		top: 10%;
		height: 80%;
		overflow-y: scroll;
	}
	.popupheader {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: var(--color-black-2);
		width: 100%;
		padding: 0.5rem;
	}
	.popuptitle {
		color: white;
		font-size: 2.5em;
		margin: auto 0.5rem;
		display: flex;
	}
	.popupbutton {
		color: white;
		font-size: 2.5rem;
		margin: auto 0.5rem;
		display: flex;
	}
	.popupcontent {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		color: var(--color-black-1);
	}
	.popupsubtitle {
		font-size: 1.5rem;
		color: rgba(0, 0, 0, 0.8);
		margin-bottom: 0.5rem;
		margin-top: 1rem;
	}
	.popuplabel {
		margin: auto 0.5rem;
	}
	.popupfooter {
		display: flex;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	.schedulebutton {
		margin-bottom: 0.5rem;
		padding-top: 0.4rem;
		padding-left: 0.4rem;
		padding-right: 0.4rem;
		padding-bottom: 0.2rem;
		width: 100%;
	}
	.savebutton {
		margin: auto;
		font-size: 1.5rem;
		padding-top: 0.5rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-bottom: 0.25rem;
	}
	.basebutton {
		color: white;
		border-top: none;
		border-left: none;
		border-right: none;
		transition-duration: 0.3s;
		cursor: pointer;
		background: var(--color-black-2);
		border-bottom: 7px solid var(--color-black-1);
		font-weight: bold;
	}
	button:hover {
		background-color: var(--base-color-4);
		border-color: var(--base-color-5);
	}
	.shroud {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 2;
	}
	@media (max-aspect-ratio: 0.84) {
		@media (max-width: 1000px) {
			.popupform {
				width: 90%;
				left: 5%;
				top: 15%;
				height: 80%;
			}
		}
	}
</style>
