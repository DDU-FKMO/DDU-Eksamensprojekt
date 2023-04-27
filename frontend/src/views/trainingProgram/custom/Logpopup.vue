<template>
	<div class="logpopup">
		<button class="button" @click="OpenPopup">Log</button>
		<div v-if="popupOpen">
			<h3>{{ day }}</h3>
			<div v-for="i in exercises.length">
				<p>{{ exercises[i - 1].name }}</p>
				<div class="previous">
					<p v-if="stats[i - 1]">Previous session: <p>{{ stats[i - 1].sets }} sets of {{ stats[i - 1].reps }} reps with a weight of {{ stats[i - 1].weight }}</p></p>
				</div>
				<input type="number" v-model="info[i - 1].sets" />
				<input type="number" v-model="info[i - 1].weight" />
			</div>
			<button @click="SaveSession">Save</button>
		</div>
	</div>
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
			},
			user: {
				type: String,
				required: true
			},
			programName: {
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
					count++;
				}
			},
			SaveSession() {
				let data = {};
				data.info = this.info;
				data.email = this.user;
				data.programName = this.programName;
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

<style scoped>
	.button {
		background-color: var(--color-black-2);
	}
</style>
