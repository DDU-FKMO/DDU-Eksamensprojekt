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
			<select name="Muscle groups" id="muscleGroups">
				<option value="Chest">Chest</option>
				<option value="Back">Back</option>
				<option value="Shoulders">Shoulders</option>
				<option value="Biceps">Biceps</option>
				<option value="Triceps">Triceps</option>
				<option value="Legs">Legs</option>
				<option value="Abs">Abs</option>
			</select>
			<label for="difficulty">Difficulty:</label>
			<select name="Difficulty" id="difficulty">
				<option value="Beginner">Beginner</option>
				<option value="Intermediate">Intermediate</option>
				<option value="Advanced">Advanced</option>
			</select>
			<label for="equipment">Equipment:</label>
			<div>
				<input type="checkbox" id="equipment" name="equipment" value="Barbell" checked />
				<label for="Barbell">Barbell</label>
				<input type="checkbox" id="equipment" name="equipment" value="Dumbbell" checked />
				<label for="Dumbbell">Dumbbell</label>
				<input type="checkbox" id="equipment" name="equipment" value="Kettlebell" checked />
				<label for="Kettlebell">Kettlebell</label>
				<input type="checkbox" id="equipment" name="equipment" value="Bodyweight" checked />
				<label for="Bodyweight">Bodyweight</label>
			</div>
			<input type="submit" value="Get training program suggestions" />
		</form>
	</div>
	<div class="suggestions" v-if="type == 0 || type == 1">
		<h3>Program suggestions</h3>
		<Program v-for="program in suggestions" :name="program.name" :excersises="program.excersises" :schedule="program.schedule" />
	</div>
</template>

<script>
	import {defineComponent} from "vue";
	import Program from "./Program.vue";

	export default defineComponent({
		name: "UserSettings",
		data() {
			return {
				type: null,
				suggestions: []
			};
		},
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
			getRecommendations: function () {
				fetch("/trainingProgram/recommend")
					.then((response) => response.json())
					.then((data) => {
						console.log("Success:", data);
						this.suggestions = data;
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
					muscleGroup: data.get("Muscle groups"),
					difficulty: data.get("Difficulty"),
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
						console.log("Success:", data);
						this.suggestions = data;
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		}
	});
</script>
