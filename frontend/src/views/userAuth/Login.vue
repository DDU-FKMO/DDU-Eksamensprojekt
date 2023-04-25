<template>
	<div class="ctn">
		<h2 class="head">{{ this.signUp ? "Register" : "Login" }}</h2>

		<h4 class="head" v-if="errorMsg != 'x'" style="color: red">{{ errorMsg }}</h4>

		<form @submit.prevent="loginUser" method="post" v-if="!signUp">
			<label for="email"> email: <input type="email" id="email" name="email" v-model="info.email" /></label>
			<label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password" /> </label>
			<button class="sbmt" type="submit">Sign in</button>
		</form>

		<form @submit.prevent="registerAcc" method="post" v-else>
			<label for="username"> username: <input type="text" id="username" name="username" v-model="info.username" /></label>
			<label for="email"> email: <input type="email" id="email" name="email" v-model="info.email" /></label>
			<label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password" /> </label>
			<button class="sbmt" type="submit">{{ !this.signUp ? "Sign in" : "Create account" }}</button>
		</form>
	</div>
	<div class="bottom">
		<p class="acc">
			{{ !this.signUp ? "No account?" : "Have an account?" }} <a style="color: blue" @click="signUp = !signUp" href="javascript:void(0);">{{ !this.signUp ? "Register" : "Login" }}</a>
		</p>
	</div>
</template>

<style>
	input {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		box-sizing: border-box;
	}
	form {
		border: 2px solid black;
		padding: 10px;
		margin: 10px;
		background-color: whitesmoke;
	}
	div.ctn {
		width: 40vw;
		position: fixed;
		top: 10%;
	}
	.bottom {
		position: absolute;
		text-align: center;
		margin: auto;
		bottom: 5vh;
	}
	.acc {
		text-align: center;
	}
	.sbmt {
		padding: 10px;
		width: 50%;
		left: 25%;
		background-color: floralwhite;
	}
	.head {
		text-align: center;
	}
</style>

<script>
	import axios from "axios";
	export default {
		data() {
			return {
				signUp: false,
				info: {
					email: "",
					username: "",
					password: ""
				},
				errorMsg: "x"
			};
		},
		mounted() {
			if (localStorage.getItem("user") != null) {
				// logged in
				localStorage.removeItem("user");
				this.$emit("login");
			}
		},
		methods: {
			async loginUser() {
				try {
					await axios
						.post("/node/login", this.info)
						.then((res) => {
							let token = res.data.token;
							//console.log(token);
							localStorage.setItem("user", token);
							this.$emit("login");
							this.$router.push("/");
						})
						.catch((err) => {
							this.errorMsg = err.response.data;
							console.log(err);
						});
				} catch (err) {
					console.log(err);
					this.errorMsg = "Something went wrong...";
				}
			},
			async registerAcc() {
				try {
					await axios
						.post("/node/register", this.info)
						.then((res) => {
							let token = res.data.token;

							localStorage.setItem("user", token);
							this.$emit("login");
							this.$router.push("/");
						})
						.catch((err) => {
							this.errorMsg = err.response.data;
							console.log(err);
						});
				} catch (err) {
					console.log(err);
				}
			}
		}
	};
</script>
