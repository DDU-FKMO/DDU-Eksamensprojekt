<template>
	<div class="program">
		Program
		<h3>{{ name }}</h3>
		<div class="day" v-for="dayObject of schedule">
			<h4>{{ dayObject.day }}</h4>
			<div class="exercise" v-for="exercise of dayObject.exercises">
				<p>{{ exercise.sets }} sets of {{ exercise.name }}</p>
			</div>
		</div>
	</div>
</template>

<script>
	import {defineComponent} from "vue";
	export default defineComponent({
		name: "Program",
		props: {
			name: {
				type: String,
				required: true
			},
			exercises: {
				type: Array,
				required: true
			},
			schedule: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				program: {}
			};
		},
		mounted() {
			console.log("Program mounted", this.name, this.exercises, this.schedule);
		}
	});
</script>
