<template>
	<div class="schedule">
		<table>
			<tr>
				<td v-for="day in days">{{ day }}</td>
			</tr>
			<tr>
				<td v-for="day in days">
					<div class="exercise" v-if="schedule.filter((a) => a.day == day).length > 0" v-for="exercise in schedule.find((a) => a.day == day).exercises">
						<Exercise :exercise="exercise" />
						<button @click="removeExercise(exercise, day)" v-if="edit">Remove</button>
					</div>
					<p v-else>Currently no exercises</p>
					<button @click="startCreateExercise(day)" v-if="!createExercise && edit">Add exercise</button>
				</td>
			</tr>
		</table>
	</div>

	<div class="createExercise" v-if="createExercise && edit">
		<Exercise :day="currentDay" @done="addExercise" />
	</div>
</template>

<script>
	import {defineComponent} from "vue";
	import Exercise from "./SelectExercise.vue";

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
			}
		},
		components: {Exercise},
		mounted() {
			console.log("Schedule mounted");
			if (this.program != null) {
				this.schedule = this.program.schedule.days;
				this.exercises = this.program.exercises;
				console.log("Schedule", this.schedule);
				console.log("Exercises", this.exercises);
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
		}
	});
</script>

<style>
	.schedule {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.createExercise {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
