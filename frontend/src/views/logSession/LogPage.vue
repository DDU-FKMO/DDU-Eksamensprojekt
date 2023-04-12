<template>
	<div v-if="days">
		<div class="overview" v-for="day in days">
			<div class="sessionBlock">
				<h3>{{ day.day }}</h3>
				<ul v-for="exercise in day.exercises">
					<li>
						<Collapsible v-bind:summary="exercise.name + ' - ' + exercise.sets + ' sets'" v-bind:description="'Equipment: ' + exercise.equipment + '\n' + exercise.instructions"> </Collapsible>
					</li>
				</ul>
				<button @click="OpenPopup(n)">Log</button>
			</div>
		</div>
		<div class="popup" v-if="isPopupOpen">
			<div v-for="n in days[index].exercises">
				<span>{{ days[index].exercises[n].name }}</span>
				<input type="text" placeholder="number of sets..." v-bind="info[n].sets" />
			</div>
		</div>
	</div>
</template>

<script>
	import Collapsible from "./Collapsible.vue";

	export default {
		mounted() {
			fetch("/trainingProgram/import/" + this.userEmail)
				.then((response) => response.json())
				.then((data) => {
					console.log("Success", data);
					let program = data;
					this.days = [];
					for (let i = 0; i < program.schedule.days.length; i++) {
						this.days[i] = {};
						this.days[i].exercises = {};
						this.days[i].day = program.schedule.days[i].day;
						for (let n = 0; n < program.schedule.days[i].exercises.length; n++) {
							this.days[i].exercises[n] = {};
							this.days[i].exercises[n].name = program.schedule.days[i].exercises[n].name;
							this.days[i].exercises[n].sets = program.schedule.days[i].exercises[n].sets;
							for (let k = 0; k < program.exercises.length; k++) {
								if (this.days[i].exercises[n].name == program.exercises[k].name) {
									this.days[i].exercises[n].instructions = program.exercises[k].instructions;
									this.days[i].exercises[n].equipment = program.exercises[k].equipment;
								}
							}
						}
					}
					console.log(this.days);
				})
				.catch((error) => {
					console.error("Error", error);
				});
		},
		data() {
			return {
				userEmail: "Filipemails",
				days: null,
				isPopupOpen: false,
				index: null,
				info: [
					{
						nameOfExercise: String,
						sets: Number //eller noget
					}
				]
			};
		},
		methods: {
			OpenPopup(id) {
				this.isPopupOpen = true;
				this.index = id;
				this.info.length = 0;
				for (var i = 0; i < this.program.schedule.days[id].exercises.length; i++) {
					this.info.push;
					this.info[i].name = this.program.schedule.days[id].exercises[i].name;
				}
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
