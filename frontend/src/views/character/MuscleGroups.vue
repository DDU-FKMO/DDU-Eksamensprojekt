<template>
	<h2>Muscle Groups</h2>
	<div class="muscles">
		<li v-for="muscle of Object.keys(muscleGroups)">
			{{ muscle }}
			<input type="checkbox" :checked="muscleGroups[muscle]" disabled />
		</li>
	</div>
</template>

<script>
	export default {
		name: "MuscleGroups",
		data() {
			return {
				muscleGroups: {}
			};
		},
		mounted() {
			this.getMuscleGroups();
		},
		methods: {
			getMuscleGroups() {
				fetch("/character/muscleGroups", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						username: null
					})
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.status == "error") throw new Error(data.message);
						else {
							console.log("Success:", data);
							this.muscleGroups = data;
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		}
	};
</script>
