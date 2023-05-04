<template>
	<div class="unlock">
		<h2 style="font-size: max(2.5vmin, 20px)">{{ AcName }}</h2>
		<p>
			<u :style="[unlocked ? {'font-weight': 'bold', color: 'lime'} : '']"> {{ unlocked ? "Unlocked" : "Not unlocked" }}</u>
		</p>
		<div class="item">
			<!-- <img class="imgUnlock" :src="content" v-if="unlockType == 'skin'" /> -->
			<div class="imgUnlock" :style="'background: url(/achievements/' + (id + 1) + '.png);'"></div>
		</div>
		<p>Item unlocked: {{ unlockName }}</p>
		<p>Description: Unlocked by reaching level {{ id + 1 }}</p>
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
		background-repeat: no-repeat !important;
	}
	.imgUnlock {
	}
	.eqbtn {
		min-width: 60px;
		min-height: 30px;
	}
</style>

<script>
	export default {
		data() {
			return {};
		},

		props: {
			AcName: String,
			unlockName: String,
			id: String,
			unlocked: Boolean
		},
		methods: {}
	};
</script>
