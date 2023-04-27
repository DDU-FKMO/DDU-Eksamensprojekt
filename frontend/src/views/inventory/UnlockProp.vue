<template>
	<div class="unlock">
		<h2 style="font-size: max(2.5vmin, 20px)">{{ name }}</h2>
		<p>Type: {{ unlockType }}</p>
		<p>
			Status: <u :style="[equipped ? {'font-weight': 'bold', color: 'lime'} : '']"> {{ equipped ? "Equipped" : "Not equipped" }}</u>
		</p>
		<div class="item">
			<!-- <img class="imgUnlock" :src="content" v-if="unlockType == 'skin'" /> -->
			<div class="imgUnlock" :style="'background: url(' + content + ');'" v-if="unlockType != 'background'"></div>
			<div class="color" :style="'background-color: ' + content + ';'" v-else></div>
		</div>
		<button @click="equip" class="eqbtn">{{ equipped ? "Unequip" : "Equip" }}</button>
	</div>
</template>

<style scoped>
	.unlock {
		padding: 1vmin;
		width: 30vmin;
		height: 35vmin;
		border: 2px solid black;
		margin: 10px;
		min-width: 200px;
		min-height: 260px;
		font-size: max(1em, 12px);
		background-color: #9c9c9c;

		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: stretch;
	}
	.item {
		aspect-ratio: 1 / 1;
		height: 60%;
		/* width: 60%; */
		margin: max(7px, 0.5vmin);
	}
	.imgUnlock,
	.color {
		height: 100%;
		width: 100%;
		aspect-ratio: 1 / 1;
		/* background-size: auto; */
		background-size: contain !important;
	}
	.imgUnlock {
	}
	.eqbtn {
		min-width: 60px;
		min-height: 30px;
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
							//this.equipped = !this.equipped;
							if (!this.equipped && this.unlockType == "background") {
								document.documentElement.setAttribute("data-theme", this.name);
							}
							this.$emit("equip"); //, this.name);
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
