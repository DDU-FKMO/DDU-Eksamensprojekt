<template>
	<div class="all">
		<img src="character.webp" alt="character" />
		<MuscleGroups />
	</div>
</template>

<script>
	import MuscleGroups from "./MuscleGroups.vue";
	export default {
		name: "Character",
		components: {
			MuscleGroups
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
