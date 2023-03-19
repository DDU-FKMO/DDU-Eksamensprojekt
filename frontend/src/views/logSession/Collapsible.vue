<template>
	<div class="collapsible">
		<button @click="update">{{ summary }}</button>
		<p v-if="open">{{ description }}</p>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				open: this.isOpen
			};
		},
		props: {
			summary: {
				type: String,
				default: ""
			},
			description: {
				type: String,
				default: ""
			},
			isOpen: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			update() {
				if (this.open) {
					this.open = false;
				} else {
					this.open = true;
				}
			}
		}
	};
</script>
