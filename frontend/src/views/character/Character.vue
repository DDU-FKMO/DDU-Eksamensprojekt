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

			<use style="fill: var(--color-black-1)" :href="'/skin_' + gender + '_' + view + '.svg#silhouette'"></use>
			<use v-for="muscle of Object.keys(muscleGroups)" :style="muscleGroups[muscle] ? 'fill: var(--base-color-1)' : 'fill: var(--color-black-2)'" :href="'/skin_' + gender + '_' + view + '.svg#' + muscle"></use>
		</svg>
		<img :src="hat" class="hat" alt="" v-if="hat != 'none'" />
	</div>

	<div class="select">
		<select v-model="view">
			<option disabled value="">Please select view</option>
			<option value="front">Front</option>
			<option value="back">Back</option>
		</select>

		<!-- <select v-model="gender">
			<option disabled value="">Please select gender</option>
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select> -->
	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "Character",
		inject: ["$toast"],
		data: () => ({
			muscleGroups: {},
			view: "front",
			gender: "",
			hat: ""
		}),
		props: {
			name: {
				type: String,
				default: "",
				required: true
			}
		},
		mounted() {
			this.getMuscleGroups();
			this.skin();
			this.getHat();
		},
		methods: {
			getMuscleGroups() {
				fetch("/character/muscleGroups")
					.then(async (response) => {
						if (response.status == 400) {
							await response.text().then((t) => {
								throw new Error(t);
							});
						} else return response.json();
					})
					.then((data) => {
						console.log("Musclegroups:", data);
						this.muscleGroups = data;
					})
					.catch((error) => {
						console.error(error);
						this.$toast.error(error);
					});
			},
			async skin() {
				await axios
					.get("/node/skin")
					.then((res) => {
						console.log("Gender: " + res.data);
						this.gender = res.data;
					})
					.catch((err) => {
						console.log("error: " + err);
						this.gender = "male";
					});
			},
			async getHat() {
				await axios
					.get("/node/hats")
					.then((res) => {
						console.log("Hat: " + res.data);
						this.hat = res.data;
					})
					.catch((err) => {
						console.log("error: " + err);
						this.hat = "none";
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
	.hat {
		position: absolute;
		height: 10%;
		width: 20%;
		top: -3%;
		left: 40%;
	}
</style>
