<template>
	<main>
		<div class="overview" v-for="n in program.schedule.days.length">
			<div class="sessionBlock">
				<h3>{{ program.schedule.days[n].day }}</h3>
				<ul v-for="i in program.schedule.days[n].exercises.length">
					<li>
						<Collapsible 
						summary="program.schedule.days[n].exercises[i].name + ' - ' + program.schedule.days[n].exercises[i].sets + ' sets'"
						description="program.schedule.days[n].exercises[i].equipment + program.schedule.days[n].exercises[i].instructions">
						</Collapsible>
					</li>
				</ul>
			</div>
			<!--
			<div class="sessionBlock">
				<h3>Friday</h3>
				<ul>
					<li>
						<Collapsible summary="Pushups" description="Do pushups lmao" />
					</li>
					<li>
						<Collapsible summary="Pullups" description="Do pullups lmao" />
					</li>
				</ul>
				<button @click="OpenPopup(this.value)" value="Friday">Log</button>
			</div>
			<div class="sessionBlock">
				<h3>Saturday</h3>
				<ul>
					<li>
						<Collapsible summary="Barbell lift" description="Lift it yeah"/>
					</li>
					<li>
						<Collapsible summary="Dumbbell lift" description="Woo yeah lift it baby"/>
					</li>
				</ul>
			</div>
			<div class="sessionBlock">
				<h3>Sunday</h3>
				<ul>
					<li>
						<Collapsible summary="Barbell squat" description="Squat with the barbell"/>
					</li>
					<li>
						<Collapsible summary="Crunches" description="Become thigh god"/>
					</li>
				</ul>
			</div>
		-->
		</div>
	</main>
</template>

<script>
import Collapsible from './Collapsible.vue';

	export default {
    mounted() { 
		fetch("/trainingProgram/import/" + this.userEmail).then((response) => response.json()).then((data) => {
			console.log("Success", data);
			this.program = data;
		}).catch((error) => {
			console.error("Error", error)
		});
	},
	data() {
		return {
			userEmail: "Filipemails",
			program,
			isPopupOpen: false
		}
	},
    methods: {
		OpenPopup(day) {

		}
	},
    components: { Collapsible }
}
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
