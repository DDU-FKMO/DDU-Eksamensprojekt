<template>
	<div class="exercise" v-if="exercise != null">
		<p>{{ exercise.name }}</p>
		<p>{{ exercise.sets }} sets</p>
	</div>
	<div class="create" v-else>
		<p>Select exercise</p>
		<div class="settings">
			<p>Settings</p>
			<form ref="exerciseForm" @submit="getAvailable" @load="getAvailable">
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
					<input type="checkbox" name="equipment" value="body_only" checked />
					<label>Body</label>
					<input type="checkbox" name="equipment" value="barbell" checked />
					<label>Barbell</label>
					<input type="checkbox" name="equipment" value="dumbbell" checked />
					<label>Dumbbell</label>
					<input type="checkbox" name="equipment" value="e-z_curl_bar" checked />
					<label>E-Z Curl bar</label>
					<input type="checkbox" name="equipment" value="other" checked />
					<label>Other</label>
					<input type="checkbox" name="equipment" value="machine" checked />
					<label>Machine</label>
					<input type="checkbox" name="equipment" value="cable" checked />
					<label>Cable</label>
					<input type="checkbox" name="equipment" value="kettlebells" checked />
					<label>Kettlebells</label>
					<input type="checkbox" name="equipment" value="exercise_ball" checked />
					<label>Exercise ball</label>
					<input type="checkbox" name="equipment" value="medicine_ball" checked />
					<label>Medicine ball</label>
					<input type="checkbox" name="equipment" value="bands" checked />
					<label>Bands</label>
				</div>
				<input type="submit" value="Get available exercises" />
			</form>
		</div>
		<div class="select">
			<label>Available exercises:</label>
			<select v-model="selectedExercise" v-if="availableExercises.length > 0">
				<option v-for="exercise of availableExercises" :value="exercise">{{ exercise.name }}</option>
			</select>
			<label>Number of sets:</label>
			<input type="number" v-model="sets" />
			<button @click="addExercise">Add exercise</button>
		</div>
	</div>
</template>

<script>
	import {defineComponent} from "vue";

	export default defineComponent({
		name: "SelectExercise",
		data: () => ({
			availableExercises: [],
			selectedExercise: null,
			sets: 0
		}),
		props: {
			exercise: {
				type: Object,
				required: false
			},
			day: {
				type: String,
				required: false
			}
		},
		mounted() {
			console.log("Schedule mounted");
			this.getAvailable(this.$refs.exerciseForm, false);
		},
		watch: {
			selectedExercise: function (newVal, oldVal) {
				if (this.sets == 0) {
					this.sets = newVal.defaultSets;
				}
			}
		},
		methods: {
			getAvailable: function (e, prevent = true) {
				console.log("Getting available exercises");
				//Prevent default form action (reloading page)
				if (prevent) e.preventDefault();
				//Get form data settings
				let data;
				if (prevent) data = new FormData(e.target);
				else data = new FormData(e);
				let settings = {
					muscleGroup: data.getAll("muscleGroups"),
					difficulty: data.get("difficulty"),
					equipment: data.getAll("equipment")
				};
				console.log(settings);
				//Generate suggestions based on settings
				fetch("/trainingProgram/exercises", {
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
							this.availableExercises = data;
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			},
			addExercise() {
				console.log("Add exercise", this.selectedExercise, this.sets);
				this.$emit("done", this.selectedExercise, this.sets, this.day);
			}
		}
	});
</script>
