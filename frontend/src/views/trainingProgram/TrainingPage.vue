<template>
	<main>
		<h2>Training</h2>
		<div class="creation" v-if="createNew || edit">
			<button @click="back">Back</button>
			<ProgramCreation :edit="edit" :program="program" />
		</div>
		<div class="program" v-else>
			<button @click="createNewProgram()">Create new program</button>
			<div v-if="program != null && program != {}">
				<h3>Current Training Program</h3>
				<button @click="editProgram">Edit</button>
				<Program :key="program._id" :name="program.programName" :exercises="program.exercises" :schedule="program.schedule.days" />
			</div>
			<h3 v-else>No program selected</h3>
		</div>
	</main>
</template>

<script>
	import {defineComponent} from "vue";
	import ProgramCreation from "./ProgramCreation.vue";
	import Program from "./Program.vue";

	export default defineComponent({
		name: "TrainingPage",
		components: {ProgramCreation, Program},
		data() {
			return {
				program: null,
				createNew: false,
				edit: false
			};
		},
		methods: {
			back: function () {
				console.log("Back");
				this.createNew = false;
				this.edit = false;
			},
			createNewProgram: function () {
				console.log("Create new program");
				this.createNew = true;
				this.edit = false;
			},
			editProgram: function () {
				console.log("Edit program");
				this.createNew = false;
				this.edit = true;
			}
		},
		mounted() {
			let email = "Filip@emails.dk";
			fetch("/trainingProgram/import/" + email)
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
