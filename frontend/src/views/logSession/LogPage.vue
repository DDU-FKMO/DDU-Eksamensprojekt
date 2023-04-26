<template>
	<div v-if="program" class="overview">
		<div v-for="day in program.schedule.days" class="sessionBlock">
			<h3>{{ day.day }}</h3>
			<div v-for="exercise in day.exercises">
				<ExerciseInfo v-bind:name="exercise.name" v-bind:sets="exercise.sets" v-bind:equipment="exercise.equipment" v-bind:instructions="exercise.instructions"> </ExerciseInfo>
			</div>
			<button @click="OpenPopup(day)">Open Log</button>
		</div>
		<div class="popup" v-if="isPopupOpen">
			<div v-for="i in info.length">
				<span>{{ info[i - 1].name }}: </span>
				<input type="text" placeholder="number of sets..." v-model="info[i - 1].sets" />
			</div>
			<button @click="SaveSession">Save Log</button>
		</div>
	</div>
</template>

<script>
	import ExerciseInfo from "./ExerciseInfo.vue";

	export default {
		mounted() {
			fetch("/trainingProgram/import/" + this.userEmail)
				.then((response) => response.json())
				.then((data) => {
					console.log("Success", data);
					this.program = data;
				})
				.catch((error) => {
					console.error("Error", error);
				});
		},
		data() {
			return {
				userEmail: "Filip@emails.dk",
				program: Object,
				isPopupOpen: false,
				info: []
			};
		},
		methods: {
			OpenPopup(day) {
				this.isPopupOpen = true;
				let count = 0;
				for (let exercise in day.exercises) {
					this.info[count] = {};
					this.info[count].nameOfExercise = day.exercises[exercise].name;
					this.info[count].sets = 0;
					count++;
				}
			},
			SaveSession() {
				let data = {};
				data.info = this.info;
				data.email = this.userEmail;
				data.programName = this.program.name;
				fetch("trainingProgram/log", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(data)
				});
			}
		},
		components: {ExerciseInfo}
	};
</script>

<style>
	.sessionBlock {
		display: inline-block;
		background-color: var(--color-black-3);
		border-color: var(--color-blac-4);
	}
	.overview {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: wrap;
	}
</style>
