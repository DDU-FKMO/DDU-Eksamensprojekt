<template>
	<div class="exercise" v-if="exercise != null">
		<p>{{ exercise.name }}</p>
		<p>{{ exercise.sets }} sets</p>
	</div>
	<div class="create center" v-else>
		<div class="settings">
			<form ref="exerciseForm" @submit="getAvailable" @load="getAvailable">
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
				<input class="button" type="submit" value="Get available exercises" />
			</form>
		</div>
		<div class="selectExercise center" v-if="availableExercises.length > 0">
			<h3>Available exercises:</h3>
			<div class="select">
				<select v-model="selectedExercise">
					<option v-for="exercise of availableExercises" :value="exercise">{{ exercise.name }}</option>
				</select>
			</div>
			<label>Number of sets: <input type="number" v-model="sets" /></label>
			<button class="button" @click="addExercise">Add exercise</button>
		</div>
	</div>
</template>

<script>
	import {defineComponent} from "vue";

	export default defineComponent({
		name: "SelectExercise",
		inject: ["$toast"],
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
				console.log("Scroll");
				document.getElementById("newExercise").scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
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
					.then(async (response) => {
						if (response.status == 400) {
							await response.text().then((t) => {
								throw new Error(t);
							});
						} else return response.json();
					})
					.then((data) => {
						if (data.length == 0) throw new Error("No exercises found with current settings");
						console.log("Success:", data);
						this.$toast.success("Successfully retrieved available exercises");
						this.availableExercises = data;
					})
					.catch((error) => {
						console.error(error);
						this.$toast.error(error);
					});
			},
			addExercise() {
				console.log("Add exercise", this.selectedExercise, this.sets);
				this.$emit("done", this.selectedExercise, this.sets, this.day);
			}
		}
	});
</script>

<style scoped>
	.create,
	.selectExercise {
		flex-direction: column;
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

	.selectExercise label {
		font-size: 1.25em;
		margin-bottom: 0.75em;
	}
	.selectExercise label input {
		width: 5em;
		margin: 0 0.5rem;
		background-color: var(--color-black-3);
		outline-color: var(--color-black-2);
	}
</style>
