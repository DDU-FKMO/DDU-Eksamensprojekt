<template>
	<h1 class="title">Inventory</h1>

	<div class="unlocks">
		<div v-for="unlock in data.unlocks">
			<UnlockProp v-bind="unlock" :key="data" @equip="getUnlocks"></UnlockProp>
		</div>
	</div>
</template>

<style scoped>
	.unlocks {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: center;
		align-content: space-around;
	}
	.title {
		position: static;
		top: 1vh;
		padding-bottom: 0.1vmin;
	}
</style>

<script>
	import UnlockProp from "./UnlockProp.vue";
	import axios from "axios";
	export default {
		data() {
			return {
				data: {}
			};
		},
		mounted() {
			this.getUnlocks();
		},
		methods: {
			async getUnlocks() {
				try {
					await axios
						.get("/node/get-unlocks")
						.then((res) => {
							this.data = res.data;

							for (let unlock of this.data.unlocks) {
								//console.log(unlock.content);
								if (this.data.equipment.includes(unlock.name)) {
									unlock.equipped = true;
								} else {
									unlock.equipped = false;
								}
							}
						})
						.catch((err) => {
							console.log("error: " + err);
						});
				} catch (err) {
					console.log("Something went wrong... " + err);
				}
			}
			// equip(changeName) {
			// 	console.log("equip status changed for: " + changeName)
			// 	for (let unlock of this.data.unlocks) {
			// 		if (unlock.name == changeName) {
			// 			unlock.equipped = !unlock.equipped;
			// 		}
			// 	}
			// }
		},
		components: {
			UnlockProp
		}
	};
</script>
