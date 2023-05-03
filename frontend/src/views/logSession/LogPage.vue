<template>
	<div v-if="program != null && program != {}">
		<Schedule :program="{schedule: {days: program.schedule.days}, exercises: program.exercises}" :log="true"></Schedule>
	</div>
	<h3 v-else>No program selected</h3>
</template>

<script>
	import Schedule from "../trainingProgram/custom/Schedule.vue";

	export default {
		inject: ["$toast"],
		mounted() {
			fetch("/trainingProgram/import/")
				.then(async (response) => {
					if (response.status == 400)
						await response.text().then((t) => {
							throw new Error(t);
						});
					else return response.json();
				})
				.then((data) => {
					console.log("Success:", data);
					this.program = data;
				})
				.catch((error) => {
					console.error(error);
					this.$toast.error(error);
				});
		},
		data() {
			return {
				program: null
			};
		},
		components: {Schedule}
	};
</script>
