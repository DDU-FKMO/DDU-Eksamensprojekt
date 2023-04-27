<template>
	<div class="settings" v-if="type == 1 && suggestions.length == 0">
		<h3>User Settings</h3>
		<form @submit="getSuggestions">
			<h4>Difficulty:</h4>
			<div class="select">
				<select name="difficulty" id="difficulty">
					<option value="beginner">Beginner</option>
					<option value="intermediate">Intermediate</option>
					<option value="expert">Expert</option>
				</select>
			</div>
			<h4>Muscle Group:</h4>
			<div class="checkbox-list">
				<label>Abdominals(<input type="checkbox" name="muscleGroups" value="abdominals" checked />)</label>
				<label>Abductors(<input type="checkbox" name="muscleGroups" value="abductors" checked />)</label>
				<label>Adductors(<input type="checkbox" name="muscleGroups" value="adductors" checked />)</label>
				<label>Biceps(<input type="checkbox" name="muscleGroups" value="biceps" checked />)</label>
				<label>Calves(<input type="checkbox" name="muscleGroups" value="calves" checked />)</label>
				<label>Chest(<input type="checkbox" name="muscleGroups" value="chest" checked />)</label>
				<label>Forearms(<input type="checkbox" name="muscleGroups" value="forearms" checked />)</label>
				<label>Glutes(<input type="checkbox" name="muscleGroups" value="glutes" checked />)</label>
				<label>Hamstrings(<input type="checkbox" name="muscleGroups" value="hamstrings" checked />)</label>
				<label>Lats(<input type="checkbox" name="muscleGroups" value="lats" checked />)</label>
				<label>Lower back(<input type="checkbox" name="muscleGroups" value="lower_back" checked />)</label>
				<label>Middle back(<input type="checkbox" name="muscleGroups" value="middle_back" checked />)</label>
				<label>Neck(<input type="checkbox" name="muscleGroups" value="neck" checked />)</label>
				<label>Quadriceps(<input type="checkbox" name="muscleGroups" value="quadriceps" checked />)</label>
				<label>Traps(<input type="checkbox" name="muscleGroups" value="traps" checked />)</label>
				<label>Triceps(<input type="checkbox" name="muscleGroups" value="triceps" checked />)</label>
			</div>
			<h4>Equipment:</h4>
			<div class="checkbox-list">
				<label>Body(<input type="checkbox" name="equipment" value="body_only" checked />)</label>
				<label>Barbell(<input type="checkbox" name="equipment" value="barbell" checked />)</label>
				<label>Dumbbell(<input type="checkbox" name="equipment" value="dumbbell" checked />)</label>
				<label>E-Z Curl bar(<input type="checkbox" name="equipment" value="e-z_curl_bar" checked />)</label>
				<label>Other(<input type="checkbox" name="equipment" value="other" checked />)</label>
				<label>Machine(<input type="checkbox" name="equipment" value="machine" checked />)</label>
				<label>Cable(<input type="checkbox" name="equipment" value="cable" checked />)</label>
				<label>Kettlebells(<input type="checkbox" name="equipment" value="kettlebells" checked />)</label>
				<label>Exercise ball(<input type="checkbox" name="equipment" value="exercise_ball" checked />)</label>
				<label>Medicine ball(<input type="checkbox" name="equipment" value="medicine_ball" checked />)</label>
				<label>Bands(<input type="checkbox" name="equipment" value="bands" checked />)</label>
			</div>
			<input type="submit" class="button" value="Get suggestions" />
		</form>
	</div>
	<div class="suggestions" v-if="type == 0 || type == 1">
		<h3>Program suggestions</h3>
		<div v-for="program in suggestions">
			<button class="button" @click="selectProgram(program)" v-if="program != null">Use this suggestion</button>
			<Schedule :program="{schedule: {days: program.schedule.days}, exercises: program.exercises, name: program.programName}" :edit="false" :log="false" :user="userEmail" v-if="program != null"></Schedule>
		</div>
	</div>
	<div class="create" v-if="type == 2">
		<h3>Create your own training program</h3>
		<h4>Program name:</h4>
		<input type="text" name="programName" id="programName" v-model="custom.programName" />
		<h4>Schedule:</h4>
		<Schedule @update="updateSchedule" :program="edit ? program : null" :edit="edit" :new-program="!edit" />
		<button class="button" @click="createProgram">Create program</button>
	</div>
</template>

<script>
	import {defineComponent} from "vue";
	import Schedule from "./custom/Schedule.vue";

	export default defineComponent({
		name: "CreateProgram",
		data: () => ({
			suggestions: [],
			custom: {
				programName: "",
				exercises: [],
				schedule: []
			}
		}),
		props: {
			program: {
				type: Object,
				required: false
			},
			edit: {
				type: Boolean,
				required: true
			},
			type: {
				type: Number,
				required: false
			}
		},
		components: {Schedule},
		mounted() {
			console.log("Settings mounted");
			if (this.edit) this.type = 2;
			console.log("Program", this.program);
			console.log("Type", this.type);
		},
		methods: {
			selectProgram: function (program) {
				program.programName = "Custom program - User";
				console.log("Selected program", program);
				//Tell backend to save program
				fetch("/trainingProgram/select", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(program)
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.status == "error") throw new Error(data.message);
						else {
							console.log("Success:", data);
							this.type = null;
							this.suggestions = [];
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			},
			getRecommendations: function () {
				fetch("/trainingProgram/recommend")
					.then((response) => response.json())
					.then((data) => {
						if (data.status == "error") throw new Error(data.message);
						else {
							console.log("Success:", data);
							this.suggestions = data;
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			},
			getSuggestions: function (e) {
				//Prevent default form action (reloading page)
				e.preventDefault();
				//Get form data settings
				const data = new FormData(e.target);
				let settings = {
					muscleGroup: data.getAll("muscleGroups"),
					difficulty: data.get("difficulty"),
					equipment: data.getAll("equipment")
				};
				console.log(settings);
				//Generate suggestions based on settings
				fetch("/trainingProgram/suggest", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(settings)
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.status == "error") throw new Error(data.message);
						else {
							console.log("Success:", data);
							this.suggestions = data;
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			},
			createProgram: function (e) {
				console.log("Create program", this.custom);
				//Tell backend to save program
				fetch("/trainingProgram/select", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(this.custom)
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.status == "error") throw new Error(data.message);
						else {
							console.log("Success:", data);
							this.type = null;
							this.custom = {
								programName: "",
								exercises: [],
								schedule: []
							};
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			},
			updateSchedule: function (schedule, exercises) {
				console.log("Schedule updated", schedule);
				console.log("Exercises updated", exercises);
				this.custom.schedule = schedule;
				this.custom.exercises = exercises;
			}
		}
	});
</script>

<style scoped>
	.suggestions,
	.create,
	.settings {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h3 {
		font-size: 2em;
		font-weight: bold;
	}
	h4 {
		font-size: 1.5em;
		font-weight: bold;
	}

	.settings form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.settings form div {
		margin: 1em 0;
	}

	input[type="text"] {
		width: 25%;
		max-width: 20em;
		height: 2em;
		font-size: 1em;
		padding: 15px 15px;
		box-sizing: border-box;
	}
	input[type="text"]:focus {
		outline: none;
	}
	input[type="text"]:focus-visible {
		outline: none;
	}

	.settings .checkbox-list {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.settings .checkbox-list label {
		margin: 0 0.5rem;
		font-size: 1.25em;
	}

	.suggestions div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.create .button {
		margin: 1em 0;
	}
</style>
