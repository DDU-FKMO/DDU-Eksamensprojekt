<template>
	<div class="buttons" v-if="type == null">
		<button @click="onClick(0)">Recomended</button>
		<button @click="onClick(1)">Auto generated</button>
		<button @click="onClick(2)">Custom</button>
	</div>
	<div class="settings" v-if="type == 1">
		<h3>User Settings</h3>
		<form @submit="getSuggestions">
			<label for="muscleGroups">Muscle Group:</label>
			<div>
				<input type="checkbox" name="muscleGroups" value="abdominals" checked />
				<label>Abdominals</label>
				<input type="checkbox" name="muscleGroups" value="abductors" checked />
				<label>Abductors</label>
				<input type="checkbox" name="muscleGroups" value="adductors" checked />
				<label>Adductors</label>
				<input type="checkbox" name="muscleGroups" value="biceps" checked />
				<label>Biceps</label>
				<input type="checkbox" name="muscleGroups" value="calves" checked />
				<label>Calves</label>
				<input type="checkbox" name="muscleGroups" value="chest" checked />
				<label>Chest</label>
				<input type="checkbox" name="muscleGroups" value="forearms" checked />
				<label>Forearms</label>
				<input type="checkbox" name="muscleGroups" value="glutes" checked />
				<label>Glutes</label>
				<input type="checkbox" name="muscleGroups" value="hamstrings" checked />
				<label>Hamstrings</label>
				<input type="checkbox" name="muscleGroups" value="lats" checked />
				<label>Lats</label>
				<input type="checkbox" name="muscleGroups" value="lower_back" checked />
				<label>Lower back</label>
				<input type="checkbox" name="muscleGroups" value="middle_back" checked />
				<label>Middle back</label>
				<input type="checkbox" name="muscleGroups" value="neck" checked />
				<label>Neck</label>
				<input type="checkbox" name="muscleGroups" value="quadriceps" checked />
				<label>Quadriceps</label>
				<input type="checkbox" name="muscleGroups" value="traps" checked />
				<label>Traps</label>
				<input type="checkbox" name="muscleGroups" value="triceps" checked />
				<label>Triceps</label>
			</div>
			<label for="difficulty">Difficulty:</label>
			<select name="difficulty" id="difficulty">
				<option value="beginner">Beginner</option>
				<option value="intermediate">Intermediate</option>
				<option value="expert">Expert</option>
			</select>
			<label for="equipment">Equipment:</label>
			<div>
				<input type="checkbox" name="equipment" value="barbell" checked />
				<label>Barbell</label>
				<input type="checkbox" name="equipment" value="dumbbell" checked />
				<label>Dumbbell</label>
				<input type="checkbox" name="equipment" value="e-z_curl_bar" checked />
				<label>E-Z Curl bar</label>
			</div>
			<input type="submit" value="Get training program suggestions" />
		</form>
	</div>
	<div class="suggestions" v-if="type == 0 || type == 1">
		<h3>Program suggestions</h3>
		<div v-for="program in suggestions">
			<Program :name="program.programName" :exercises="program.exercises" :schedule="program.schedule" v-if="program != null" />
			<button @click="selectProgram(program)" v-if="program != null">Use this suggestion</button>
		</div>
	</div>
</template>

<script>
	import {defineComponent} from "vue";
	import Program from "./Program.vue";

	export default defineComponent({
		name: "UserSettings",
		data: () => ({
			type: null,
			suggestions: []
		}),
		components: {Program},
		mounted() {
			console.log("Settings mounted");
		},
		methods: {
			onClick: function (type) {
				console.log("Clicked on: " + type);
				this.type = type;
				if (type == 0) this.getRecommendations();
			},
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
			}
		}
	});
</script>
