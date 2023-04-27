<template>
    <div class="logpopup">
        <button @click="OpenPopup" class="basebutton">Log</button>
        <div v-if="popupOpen" class="popupform">
            <div class="popupheader">
                <p class="popuptitle">{{ day }}</p>
                <button @click="() => (popupOpen = false)" class="basebutton popupbutton">x</button>
            </div>
            <div class="previous">
                <p v-if="stats[i - 1]">Previous session: <p>{{ stats[i - 1].sets }} sets of {{ stats[i - 1].reps }} reps with a weight of {{ stats[i - 1].weight }}</p></p>
            </div>
            <div v-for="i in exercises.length">
                <p class="popupsubtitle">{{ info[i - 1].nameOfExercise }}</p>
                <div class="popupcontent">
                    <label for="reps" class="popuplabel">Reps: </label>
                    <input type="number" name="reps" v-model="info[i - 1].reps">
                    <label for="sets" class="popuplabel">Sets: </label>
                    <input type="number" name="sets" v-model="info[i - 1].sets">
                    <label for="weight" class="popuplabel">Weight: </label>
                    <input type="number" name="weight" v-model="info[i - 1].weight">
                </div>
            </div>
            <button @click="SaveSession" class="basebutton">Save</button>
        </div>
    </div>
    <div class="shroud" v-if="popupOpen"></div>
</template>

<script>
	import {defineComponent} from "vue";

	export default defineComponent({
		data: () => ({
			popupOpen: false,
			info: [],
			stats: []
		}),
		name: "Logpopup",
		props: {
			exercises: {
				type: Array,
				required: true
			},
			day: {
				type: String,
				required: true
			},
			user: {
				type: String,
				required: true
			},
			programName: {
				type: String,
				required: true
			}
		},
		methods: {
			OpenPopup() {
				this.popupOpen = true;
				let count = 0;
				this.GetPreviousInfo();
				for (let exercise in this.exercises) {
					this.info[count] = {};
					this.info[count].nameOfExercise = this.exercises[exercise].name;
					this.info[count].sets = 0;
                    this.info[count].weight = 0;
                    this.info[count].reps = 0;
					count++;
				}
			},
			SaveSession() {
				let data = {};
				data.info = this.info;
				data.email = this.user;
				data.programName = this.programName;
				fetch("trainingProgram/log", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(data)
				});
			},
			async GetPreviousInfo() {
				for (let exercise in this.exercises) {
					this.stats[exercise] = await fetch("statistics/latest/" + this.exercises[exercise].name).then((response) => response.json());
				}
			}
		}
	});
</script>
