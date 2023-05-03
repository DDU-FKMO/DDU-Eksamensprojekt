<template>
	<div class="all center">
		<div class="schedule">
			<div class="scheduleBlock" v-for="day in days">
				<div class="scheduleheader">
					<p class="scheduletitle">{{ day }}</p>
				</div>
				<div v-if="schedule.filter((a) => a.day == day).length > 0" v-for="exercise in schedule.find((a) => a.day == day).exercises">
					<ExerciseInfo @remove="removeExercise(exercise, day)" :edit="edit" :name="exercise.name" :sets="exercise.sets" :equipment="exercises.find((a) => a.name == exercise.name).equipment" :instructions="exercises.find((a) => a.name == exercise.name).instructions" />
				</div>
				<div v-else style="height: 100%">No exercises</div>
				<button class="button" @click="startCreateExercise(day)" v-if="!createExercise && (edit || newProgram)">Add exercise</button>
				<Logpopup v-if="log && schedule.filter((a) => a.day == day).length > 0" :day="day" :exercises="schedule.find((a) => a.day == day).exercises"></Logpopup>
			</div>
		</div>
		<div class="createExercise" v-if="createExercise && (edit || newProgram)">
			<h2>Select exercise</h2>
			<button class="button" @click="() => (createExercise = false)">Cancel</button>
			<Exercise :day="currentDay" @done="addExercise" />
		</div>
	</div>
</template>

<script>
	import {defineComponent} from "vue";
	import Exercise from "./SelectExercise.vue";
	import ExerciseInfo from "./ExerciseInfo.vue";
	import Logpopup from "./Logpopup.vue";

	export default defineComponent({
		name: "Schedule",
		data: () => ({
			days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			currentDay: null,
			schedule: [],
			exercises: [],
			createExercise: false
		}),
		props: {
			program: {
				type: Object,
				required: false
			},
			edit: {
				type: Boolean,
				required: false
			},
			"new-program": {
				type: Boolean,
				required: false
			},
			log: {
				type: Boolean,
				required: false
			}
		},
		components: [{Exercise}, {ExerciseInfo}, {Logpopup}],
		mounted() {
			console.log("Schedule mounted");

			if (this.program != null) {
				this.schedule = this.program.schedule.days;
				this.exercises = this.program.exercises;
				console.log("Schedule", this.schedule);
				console.log("Exercises", this.exercises);
				console.log("Program name", this.program.name);
			}
		},
		methods: {
			startCreateExercise: function (day) {
				this.createExercise = true;
				this.currentDay = day;
			},
			addExercise: function (exercise, sets, day) {
				this.createExercise = false;
				this.currentDay = null;
				//Add to schedule
				if (this.schedule.filter((a) => a.day == day).length == 0) this.schedule.push({day: day, exercises: [{name: exercise.name, sets: sets}]});
				else this.schedule.filter((a) => a.day == day)[0].exercises.push({name: exercise.name, sets: sets});
				//Add to exercise
				if (this.exercises.filter((a) => a.name == exercise.name).length == 0) this.exercises.push(exercise);
				//Emit
				console.log("Schedule", this.schedule);
				console.log("Exercises", this.exercises);
				this.$emit("update", this.schedule, this.exercises);
			},
			removeExercise: function (exercise, day) {
				//Remove from schedule
				this.schedule.find((a) => a.day == day).exercises = this.schedule.find((a) => a.day == day).exercises.filter((a) => a.name != exercise.name);
				//Remove day if no more exercises
				if (this.schedule.find((a) => a.day == day).exercises.length == 0) this.schedule = this.schedule.filter((a) => a.day != day);
				//Remove from exercises if not used
				if (this.schedule.filter((a) => a.exercises.filter((b) => b.name == exercise.name).length > 0).length == 0) this.exercises = this.exercises.filter((a) => a.name != exercise.name);
				//Update
				this.$emit("update", this.schedule, this.exercises);
			}
		},
		components: {Logpopup, ExerciseInfo, Exercise}
	});
</script>

<style scoped>
	h2 {
		font-size: 2.5em;
		font-weight: bold;
	}
	.all {
		width: 100%;
		padding: 0 5%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}
	.schedule {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		min-height: 50%;
	}
	.scheduleBlock {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		background-color: var(--color-black-3);
		border: 0.2em solid var(--color-black-4);
		padding: 0.5em;
		min-width: 17em;
		width: 20%;
		margin: 2.5%;
		min-height: 15em;
	}
	.scheduleheader {
		padding: 0.3em;
		background-color: var(--color-black-2);
		display: flex;
	}
	.scheduletitle {
		margin: auto;
		color: white;
		font-size: 1.5em;
		font-weight: bold;
	}
	.schedulebutton {
		margin-left: 0.5em;
		margin-bottom: 0.5em;
	}
	.createExercise {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.createExercise .button {
		width: 10em;
		margin: 0.5em;
	}

	.button {
		font-size: 0.8em;
		width: 80%;
	}
</style>
