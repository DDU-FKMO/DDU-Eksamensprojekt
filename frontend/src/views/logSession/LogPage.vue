<template>
	<div v-if="program">
		<p>Hej</p>
		<div class="overview" v-for="n in program.schedule.days.length">
			<div class="sessionBlock">
				<h3>{{ program.schedule.days[n].day }}</h3>
				<ul v-for="i in program.schedule.days[n].exercises.length">
					<li>
						<Collapsible v-bind:summary="program.schedule.days[n].exercises[i].name + ' - ' + program.schedule.days[n].exercises[i].sets + ' sets'" v-bind:description="'Equipment: ' + program.schedule.days[n].exercises[i].equipment + '\n' + program.schedule.days[n].exercises[i].instructions"> </Collapsible>
					</li>
				</ul>
				<button @click="OpenPopup(n)">Log</button>
			</div>
		</div>
	</div>
	<div v-if="isPopupOpen"></div>
</template>

<script>
	import Collapsible from "./Collapsible.vue";

	export default {
		mounted() {
			fetch("/trainingProgram/import/" + this.userEmail)
				.then((response) => response.json())
				.then((data) => {
					console.log("Success", data);
					this.program = data;
				})
				.catch((error) => {
					console.error("Error", error);
				});
		},
		data() {
			return {
				userEmail: "Filipemails",
				program: null,
				isPopupOpen: false
			};
		},
		methods: {
			OpenPopup(index) {
				this.isPopupOpen = true;
			}
		},
		components: {Collapsible}
	};
</script>

<style>
	.sessionBlock {
		display: inline-block;
		align-self: baseline;
	}
	.overview {
		display: inline;
		align-items: baseline;
	}
</style>
