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
