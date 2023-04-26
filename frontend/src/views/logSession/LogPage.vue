<template>
	<div v-if="days" class="overview">
		<div v-for="day in days">
			<div class="sessionBlock">
				<h3>{{ day.day }}</h3>
				<div v-for="exercise in day.exercises">
					<ExerciseInfo v-bind:name="exercise.name" v-bind:sets="exercise.sets" v-bind:equipment="exercise.equipment" v-bind:instructions="exercise.instructions"> </ExerciseInfo>
				</div>
				<button @click="OpenPopup(day)">Open Log</button>
			</div>
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
					let program = data;
					this.programName = program.name;
					for (let i = 0; i < program.schedule.days.length; i++) {
						this.days[i] = {};
						this.days[i].exercises = {};
						this.days[i].day = program.schedule.days[i].day;
						for (let n = 0; n < program.schedule.days[i].exercises.length; n++) {
							this.days[i].exercises[n] = {};
							this.days[i].exercises[n].name = program.schedule.days[i].exercises[n].name;
							this.days[i].exercises[n].sets = program.schedule.days[i].exercises[n].sets;
							for (let k = 0; k < program.exercises.length; k++) {
								if (this.days[i].exercises[n].name == program.exercises[k].name) {
									this.days[i].exercises[n].instructions = program.exercises[k].instructions;
									this.days[i].exercises[n].equipment = program.exercises[k].equipment;
								}
							}
						}
					}
				})
				.catch((error) => {
					console.error("Error", error);
				});
		},
		data() {
			return {
				userEmail: "Filip@emails.dk",
				days: [],
				isPopupOpen: false,
				info: [],
				programName: String
			};
		},
		methods: {
			OpenPopup(day) {
				this.isPopupOpen = true;
				this.chosenDay = day;
				let count = 0;
				for (let exercise in day.exercises) {
					this.info[count] = {};
					this.info[count].name = day.exercises[exercise].name;
					this.info[count].sets = 0;
					count++;
				}
			},
			SaveSession() {
				let data = {};
				data.info = this.info;
				data.email = this.userEmail;
				data.programName = this.programName;
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
