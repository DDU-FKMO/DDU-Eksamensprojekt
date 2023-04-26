<template>
	<div class="all">
		<img src="/character.webp" alt="character" />
		<MuscleGroups />
		{{ name }}
	</div>
</template>

<script>
	import MuscleGroups from "./MuscleGroups.vue";
	export default {
		name: "Character",
		data: () => ({
			name: "Filip"
		}),
		components: {
			MuscleGroups
		},
		methods: {
			test: function () {
				console.log("test");
				this.name = "Filip 2";
			}
		}
	};
</script>

<style>
	.all {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
	}
</style>
