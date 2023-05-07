<template>
	<h1 class="title">Welcome to <u>Apex Fitness</u></h1>
	<div class="ctn center">
		<form @submit.prevent="loginUser" method="post" v-if="!signUp">
			<h2 class="head">Login</h2>
			<label for="email"> E-mail: <input type="email" id="email" name="email" v-model="info.email" /></label>
			<label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password" /> </label>
			<button class="sbmt" type="submit">Sign in</button>
		</form>

		<form @submit.prevent="registerAcc" method="post" v-else>
			<h2 class="head">Register</h2>
			<label for="username"> Username: <input type="text" id="username" name="username" v-model="info.username" /></label>
			<label for="email"> E-mail: <input type="email" id="email" name="email" v-model="info.email" /></label>
			<label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password" /> </label>
			<button class="sbmt" type="submit">Create account</button>
		</form>
	</div>
	<div class="bottom">
		<div class="acc center">
			<p>{{ !this.signUp ? "No account?" : "Already have an account?" }}</p>
			<button @click="signUp = !signUp" href="javascript:void(0);">{{ !this.signUp ? "Register" : "Login" }}</button>
		</div>
	</div>
</template>

<style scoped>
	.title{
		margin-bottom: 4vh;
	}

	div.ctn {
		width: 100%;
		height: 70%;
	}

	form {
		width: 50%;
		max-width: 50rem;
		border: 5px solid var(--base-color-5);
		padding: 1em;
		background-color: var(--base-color-1);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	form h2 {
		font-size: 2.5em;
		font-weight: bold;
	}
	form label {
		font-size: 1.5em;
		width: 90%;
	}

	form input {
		width: 100%;
		font-size: 0.75em;
		padding: 15px 15px;
		box-sizing: border-box;
	}
	form input:focus-visible {
		outline: var(--base-color-5) auto 1px;
	}

	form button[type="submit"] {
		width: 50%;
		min-width: 10rem;
		font-size: 1.5em;
		font-weight: bold;
		margin: 0;
		margin-top: 1em;
		background-color: var(--base-color-3);
		border: 5px solid var(--base-color-5);
	}
	form button[type="submit"]:hover {
		background-color: var(--base-color-2);
		border-color: var(--base-color-4);
		cursor: pointer;
	}

	.bottom {
		position: absolute;
		text-align: center;
		margin: auto;
		bottom: 5vh;
		width: 100%;
	}
	.acc {
		text-align: center;
		font-size: 1.1em;
		color: var(--color-white);
		width: 100%;
	}

	.acc button {
		width: 6em;
		background-color: var(--color-white);
		border: 1px solid var(--base-color-5);
		margin-left: 1em;
		font-size: 0.9em;
		font-weight: bold;
		padding: 5px 10px;
	}
	.acc button:hover {
		cursor: pointer;
	}

	@media (max-aspect-ratio: 0.84) {
		@media (max-width: 1000px) {
			div.ctn {
				height: 90%;
			}
			form {
				width: 100%;
				max-width: 100%;
				height: 90%;
				padding: 0;
			}
			form button[type="submit"] {
				width: 95%;
			}
			.bottom {
				bottom: 1vh;
			}
		}
	}
</style>

<script>
	import axios from "axios";
	export default {
		inject: ["$toast"],
		data() {
			return {
				signUp: false,
				info: {
					email: "",
					username: "",
					password: ""
				}
			};
		},
		mounted() {
			if (document.cookie.length > 0) {
				// logged in
				// cookie remove one-liner:
				document.cookie.split(";").forEach(function (c) {
					document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
				});
				this.$emit("login");
				this.$router.push("/login");
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
							//localStorage.setItem("user", token);
							let c_time = 60 * 60 * 1000 * 24 * 3; // 3 dage
							document.cookie = "user=" + token + "; expires=" + new Date(new Date().getTime() + c_time).toGMTString() + ";path=/";
							this.$toast.success("Logged in!");
							this.$emit("login");
							this.$router.push("/");
						})
						.catch((err) => {
							this.$toast.error("Failed to login! " + err.response.data);
							console.log(err);
						});
				} catch (err) {
					console.log(err);
					this.$toast.error("Error occured while logging in!");
				}
			},
			async registerAcc() {
				try {
					await axios
						.post("/node/register", this.info)
						.then((res) => {
							let token = res.data.token;

							//localStorage.setItem("user", token);
							let c_time = 60 * 60 * 1000 * 24 * 3; // 3 dage
							document.cookie = "user=" + token + "; expires=" + new Date(new Date().getTime() + c_time).toGMTString() + ";path=/";
							this.$toast.success("Registered user and logged in!");
							this.$emit("login");
							this.$router.push("/intro");
						})
						.catch((err) => {
							this.$toast.error("Failed to register user! " + err.response.data);
							console.log(err);
						});
				} catch (err) {
					console.log(err);
					this.$toast.error("Error occured while registering user!");
				}
			}
		}
	};
</script>
