<template>
	<main>
		<h2>Training</h2>
		<div class="creation">
			<div v-if="type != null">
				<button @click="back">Back</button>
				<ProgramCreation :edit="edit" :type="type" :program="program" />
			</div>
			<div v-else>
				<button @click="() => (type = 0)">Recomended</button>
				<button @click="() => (type = 1)">Auto generated</button>
				<button @click="() => (type = 2)">Custom</button>
			</div>
		</div>
		<div class="program" v-if="type == null">
			<div v-if="program != null && program != {}">
				<h3>Current Training Program</h3>
				<button @click="editProgram">Edit</button>
				<Schedule :program="{schedule: {days: program.schedule.days}, exercises: program.exercises, name: program.programName}" :edit="false"></Schedule>
			</div>
			<h3 v-else>No program selected</h3>
		</div>
	</main>
</template>

<script>
	import {defineComponent} from "vue";
	import ProgramCreation from "./ProgramCreation.vue";
	import Schedule from "./custom/Schedule.vue";

	export default defineComponent({
		name: "TrainingPage",
		components: {ProgramCreation, Schedule},
		data() {
			return {
				program: null,
				edit: false,
				type: null
			};
		},
		methods: {
			back: function () {
				console.log("Back");
				this.edit = false;
				this.type = null;
			},
			editProgram: function () {
				console.log("Edit program");
				this.edit = true;
				this.type = 2;
			}
		},
		mounted() {
			fetch("/trainingProgram/import")
				.then((response) => response.json())
				.then((data) => {
					if (data.status == "error") throw new Error(data.message);
					else {
						console.log("Success:", data);
						this.program = data;
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	});
</script>

<style scoped>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
	}

	.creation {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.program {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h2 {
		text-align: center;
		width: 10rem;
		font-size: 2rem;
	}
</style>
