<template>
	<div class="chevrons">
		<button @click="update" class="basebutton setsbutton">{{ sets }} sets</button>
		<button @click="update" class="basebutton namebutton">{{ name }}</button>
	</div>
	<div class="popupform" v-if="open">
		<div class="popupheader">
			<label class="popuptitle" for="close">{{ name }}</label>
			<button @click="update" class="basebutton popupbutton" name="close">x</button>
		</div>
		<div class="popupcontent">
			<p class="contentheader">Equipment: {{ equipment }}</p>
			<p>{{ instructions }}</p>
			<iframe v-if="video" width="560" height="315" :src="'https://www.youtube.com/embed/' + video" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen> </iframe>
			<button v-if="edit" class="button" @click="remove">Remove</button>
		</div>
	</div>
	<div class="shroud" v-if="open"></div>
</template>

<script>
	import {defineComponent} from "vue";

	export default defineComponent({
		data() {
			return {
				open: this.isOpen,
				video: null
			};
		},
		name: "ExerciseInfo",
		props: {
			name: {
				type: String,
				default: ""
			},
			sets: {
				type: String,
				default: ""
			},
			equipment: {
				type: String,
				default: ""
			},
			instructions: {
				type: String,
				default: ""
			},
			isOpen: {
				type: Boolean,
				default: false
			},
			edit: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			console.log("Name:", this.name);
			fetch("/exercise/video/" + this.name)
				.then(async (response) => {
					if (response.status == 400)
						await response.text().then((t) => {
							throw new Error(t);
						});
					else return response.text();
				})
				.then((data) => {
					this.video = data;
				})
				.catch((error) => {
					console.error(error);
				});
		},
		methods: {
			update() {
				if (this.open) {
					this.open = false;
				} else {
					this.open = true;
				}
			},
			remove() {
				this.$emit("remove");
			}
		}
	});
</script>

<style scoped>
	.popupform {
		position: fixed;
		border: 3px solid rgba(0, 0, 0, 0.3);
		background-color: white;
		z-index: 3;
		width: 50%;
		left: 25%;
		top: 10%;
		height: 80%;
		overflow-y: scroll;
	}
	.chevrons {
		display: flex;
		justify-content: baseline;
		margin: 0.5rem;
		height: 100%;
	}
	.basebutton {
		color: white;
		border-top: none;
		border-left: none;
		border-right: none;
		transition-duration: 0.3s;
		cursor: pointer;
		background: var(--color-black-2);
		border-bottom: 7px solid var(--color-black-1);
		font-weight: bold;
		font-size: 0.75em;
	}
	.setsbutton {
		clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
		width: 4rem;
		height: 3rem;
		text-align: left;
		margin-right: -0.75rem;
	}
	.namebutton {
		clip-path: polygon(92% 0, 100% 50%, 92% 100%, 0% 100%, 8% 50%, 0% 0%);
		width: 13rem;
		height: 3rem;
		text-align: center;
	}
	.popupheader {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: var(--color-black-2);
		width: 100%;
		padding: 0.5rem;
	}
	.popuptitle {
		color: white;
		font-size: 2.5em;
		margin: auto 0.5rem;
		display: flex;
	}
	.popupbutton {
		color: white;
		font-size: 2.5em;
		margin: auto 0.5rem;
		display: flex;
	}
	button:hover {
		background-color: var(--base-color-4);
		border-color: var(--base-color-5);
	}
	.popupcontent {
		margin: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	.popupcontent .video {
		display: block;
		margin-left: auto;
		margin-right: auto;
		height: 25%;
	}
	.contentheader {
		font-size: 1.5em;
		color: rgba(0, 0, 0, 0.8);
	}
	.shroud {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 2;
	}
</style>
