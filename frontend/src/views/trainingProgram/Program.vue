<template>
	<div class="program">
		Program...
		<h3>{{ name }}</h3>
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
			excersises: {
				type: Array,
				required: true
			},
			schedule: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				program: {}
			};
		},
		mounted() {
			console.log("Program mounted");
		}
	});
</script>
