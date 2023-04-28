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
			},
			SaveSession() {
				let data = {};
				data.info = this.info;
				fetch("trainingProgram/log", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(data)
				});
			},
			async GetPreviousInfo() {
				for (let exercise in this.exercises) {
					this.stats[exercise] = await fetch("statistics/latest/" + this.exercises[exercise].name).then((response) => response.json());
				}
			}
		}
	});
</script>

<style>
	.popupform {
		position: fixed;
		border: 3px solid rgba(0, 0, 0, 0.3);
		background-color: white;
		z-index: 3;
		width: 50%;
		left: 25%;
		top: 10%;
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
		font-size: 2.5em;
		margin: auto 0.5rem;
		display: flex;
	}
	.popupcontent {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.popupsubtitle {
		font-size: 1.5em;
		color: rgba(0, 0, 0, 0.8);
		margin-bottom: 0.5em;
		margin-top: 1em;
	}
	.popuplabel {
		margin: auto 0.5em;
	}
	.popupfooter {
		display: flex;
		margin-top: 1em;
		margin-bottom: 0.5em;
	}
	.schedulebutton {
		margin-left: 0.5em;
		margin-bottom: 0.5em;
		padding-top: 0.4em;
		padding-left: 0.4em;
		padding-right: 0.4em;
		padding-bottom: 0.2em;
	}
	.savebutton {
		margin: auto;
		font-size: 1.5em;
		padding-top: 0.5em;
		padding-left: 0.5em;
		padding-right: 0.5em;
		padding-bottom: 0.25em;
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
</style>
