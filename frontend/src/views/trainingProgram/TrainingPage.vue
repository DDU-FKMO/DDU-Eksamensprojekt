<template>
	<main>
		<h2>Training</h2>
		<div class="creation" v-if="createNew">
			<button
				@click="
					() => {
						createNew = false;
					}
				"
			>
				Back
			</button>
			<ProgramCreation />
		</div>
		<div class="program" v-else>
			<button @click="createNewProgram()">Create new program</button>
			<h3>Current Training Program</h3>
			<Program v-if="program != null && program != {}" :key="program.id" :name="program.name" :excersises="program.excersises" :schedule="program.schedule" />
			<p v-else>No program selected</p>
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
				createNew: false
			};
		},
		methods: {
			createNewProgram: function () {
				console.log("Create new program");
				this.createNew = true;
			}
		},
		mounted() {
			console.log("Training page mounted");
		}
	});
</script>
