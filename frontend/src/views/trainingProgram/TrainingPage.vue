<template>
	<main>
		<div class="creation">
			<div class="create" v-if="type != null">
				<button class="button" @click="back">Back</button>
				<ProgramCreation :edit="edit" :type="type" :program="program" />
			</div>
			<div class="buttons" v-else>
				<button class="button" @click="() => (type = 0)">Recomended</button>
				<button class="button" @click="() => (type = 1)">Auto generated</button>
				<button class="button" @click="() => (type = 2)">Custom</button>
			</div>
		</div>
		<div class="program" v-if="type == null">
			<div class="program" v-if="program != null && program != {}">
				<h3>Current Training Program</h3>
				<button class="button" @click="editProgram">Edit</button>
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
	.buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.create {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
	}
	.program {
		width: 100%;
		min-height: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	h2 {
		text-align: center;
		width: 10rem;
		font-size: 2rem;
	}

	.button {
		min-width: 10em;
		min-height: 2.5em;
		margin: 0.5em 0 0.5em 0;
	}
	@media (max-aspect-ratio: 0.84) {
		.creation div {
			display: none;
		}
		.button {
			display: none;
		}
	}
</style>
