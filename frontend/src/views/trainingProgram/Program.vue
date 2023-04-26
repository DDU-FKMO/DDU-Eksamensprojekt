<template>
	<div class="program">
		Current Program
		<h3>{{ name }}</h3>
		<Schedule :program="{schedule: {days: schedule}, exercises: exercises}" :edit="false" />
	</div>
</template>

<script>
	import {defineComponent} from "vue";
	import Schedule from "./custom/Schedule.vue";
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
		components: {Schedule},
		mounted() {
			console.log("Program mounted", this.name, this.exercises, this.schedule);
		}
	});
</script>
