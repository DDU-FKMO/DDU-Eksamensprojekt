<template>
	<main>
		<h1>Character</h1>
		<MuscleGroups />
	</main>
</template>

<script>
	import MuscleGroups from "./MuscleGroups.vue";

	export default {
		name: "CharacterPage",
		components: {
			MuscleGroups
		}
	};
</script>
