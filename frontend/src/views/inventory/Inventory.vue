<template>
	<h1>Inventory</h1>
	<div v-for="unlock in data.unlocks">
		<UnlockProp v-bind="unlock" :key="unlock.equipped" @equip="(n) => equip(n)"></UnlockProp>
	</div>
</template>

<style></style>

<script>
	import UnlockProp from "./UnlockProp.vue";
	import axios from "axios";
	export default {
		data() {
			return {
				jwt: String,
				data: {}
			};
		},
		mounted() {
			this.jwt = localStorage.getItem("user");
			this.getUnlocks();
		},
		methods: {
			async getUnlocks() {
				try {
					await axios
						.get("/node/get-unlocks", {headers: {"x-access-token": this.jwt}})
						.then((res) => {
							this.data = res.data;

							for (let unlock of this.data.unlocks) {
								console.log(unlock.content);
								if (unlock.name in this.data.equipment) {
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
			},
			equip(changeName) {
				for (let unlock in this.data.unlocks) {
					if (unlock.name == changeName) {
						unlock.equipped = !unlock.equipped;
					}
				}
			}
		},
		components: {
			UnlockProp
		}
	};
</script>
