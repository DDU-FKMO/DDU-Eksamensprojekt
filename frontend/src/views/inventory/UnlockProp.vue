<template>
	<div class="unlock">
		<h4>{{ name }}</h4>
		<p>Type: {{ unlockType }}</p>
		<div class="item">
			<img class="imgUnlock" :src="content" v-if="unlockType == 'skin'" />
			<div class="color" :style="content" v-else></div>
		</div>
		<button @click="equip">{{ equipped ? "Unequip" : "Equip" }}</button>
	</div>
</template>

<style>
	.unlock {
		padding: 20vmin;
		border: 2px solid black;
	}
	.item {
		height: 10vmin;
		width: 10vmin;
	}
	.imgUnlock {
		height: 100%;
		width: 100%;
	}
	.color {
		height: 100%;
		width: 100%;
	}
</style>

<script>
	import axios from "axios";
	export default {
		data() {
			return {};
		},

		props: {
			name: String,
			unlockType: String,
			content: String,
			equipped: Boolean
		},
		methods: {
			async equip() {
				try {
					await axios
						.post("/node/equip", {name: this.name})
						.then((res) => {
							console.log("Equip sucess: " + res.data);
							this.equipped = !this.equipped;
							this.$emit("equip", this.name);
						})
						.catch((err) => {
							console.log("error:" + err);
						});
				} catch (err) {
					console.log("error:" + err);
				}
			}
		}
	};
</script>
