<template>
    <div class="logpopup">
        <button @click="OpenPopup">Log</button>
        <div v-if="popupOpen">
            <p>{{ day }}</p>
            <div v-for="i in exercises.length">
                <p>{{ info[i - 1].name }}</p>
                <input type="number" v-model="info[i - 1].sets">
                <input type="number" v-model="info[i - 1].weight">
            </div>
            <button @click="SaveSession">Save</button>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            return {
                popupOpen: false,
                info: []
            }
        },
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
				for (let exercise in this.exercises) {
					this.info[count] = {};
					this.info[count].nameOfExercise = this.exercises[exercise].name;
					this.info[count].sets = 0;
                    this.info[count].weight = 0;
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
            }
        }
    })
</script>