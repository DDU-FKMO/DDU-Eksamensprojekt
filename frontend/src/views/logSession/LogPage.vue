<template>
	<main>
		<div class="overview">
			<div class="sessionBlock">
				<h3>Friday</h3>
				<ul>
					<li>
						<Collapsible summary="Pushups" description="Do pushups lmao" />
					</li>
					<li>
						<Collapsible summary="Pullups" description="Do pullups lmao" />
					</li>
				</ul>
			</div>
			<div class="sessionBlock">
				<h3>Saturday</h3>
				<ul>
					<li>
						<Collapsible summary="Barbell lift" description="Lift it yeah"/>
					</li>
					<li>
						<Collapsible summary="Dumbbell lift" description="Woo yeah lift it baby"/>
					</li>
				</ul>
			</div>
			<div class="sessionBlock">
				<h3>Sunday</h3>
				<ul>
					<li>
						<Collapsible summary="Barbell squat" description="Squat with the barbell"/>
					</li>
					<li>
						<Collapsible summary="Crunches" description="Become thigh god"/>
					</li>
				</ul>
			</div>
		</div>
	</main>
</template>

<script>
import Collapsible from './Collapsible.vue';

	export default {
    mounted() { },
    methods: {},
    components: { Collapsible }
}
</script>

<style>
	.sessionBlock {
		display: inline-block;
		align-self: baseline;
	}
	.overview {
		display: inline;
		align-items: baseline;
	}
</style>
