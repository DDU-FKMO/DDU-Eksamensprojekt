<template>
	<div class="all">
		<svg viewBox="0 0 2481 3508" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2">
			<filter id="blur">
				<feGaussianBlur stdDeviation="5" />
			</filter>
			<filter id="shadow">
				<feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
				<feDisplacementMap type="displacement" in2="turbulence" in="SourceGraphic" scale="50" xChannelSelector="0" yChannelSelector="0" />
				<feGaussianBlur in="displacement" stdDeviation="0.8" />
			</filter>

			<use style="fill: #000000" href="/skin_male.svg#silhouette"></use>
			<use v-for="muscle of Object.keys(muscleGroups)" :style="muscleGroups[muscle] ? 'fill:#DE032A' : 'fill:#282828'" :href="'/skin_male.svg#' + muscle"></use>
		</svg>
	</div>
</template>

<script>
	export default {
		name: "Character",
		data: () => ({
			name: "Filip",
			muscleGroups: {}
		}),
		mounted() {
			this.getMuscleGroups();
		},
		methods: {
			test: function () {
				console.log("test");
				this.name = "Filip 2";
			},
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
