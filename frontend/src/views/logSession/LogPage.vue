<template>
	<div v-if="program != null && program != {}">
		<Schedule :program="{schedule: {days: program.schedule.days}, exercises: program.exercises, name: program.programName}" :log="true" :user="userEmail"></Schedule>
	</div>
</template>

<script>
	import Schedule from "../trainingProgram/custom/Schedule.vue";

	export default {
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
				});
		},
		data() {
			return {
				userEmail: "Filip@emails.dk",
				program: null
			};
		},
		components: {Schedule}
	};
</script>
