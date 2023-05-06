<template>
    <h1>Welcome To Apex Fitness - Training for True Legends</h1>
    <p>Here is an introduction to the site's functionality</p>
    <div class="everything">
    <div class="Explanation">
        <h2 class="subtitle">Character - The homepage</h2>
        <img src="/pages/home.png" alt="">
        <p>On this page, you have an overview of your training. 
            On the right side is your character. The characters muscles become highlighted when you workout the corresponding muscle.
            On the left side is your personal statistics. Here, you can see your overall progress or a chart over a specifik exercise.
            On top of your statistics is your current Streak. You gain a Streak when you follow your program continuously.</p>
    </div>
    <div class="Explanation">
        <h2 class="subtitle">Training</h2>
        <img src="/pages/training.png" alt="">
        <p>Here, you personalize your workout. You can either make your own or choose a pre-generated workout.
            If you are new to working out, we recommend choosing a pre-generated workout by clicking "Recommended".
            Alternatively, you can auto-generate a workout that hits some musclegroups of your choice. 
        </p>
    </div>
    <div class="Explanation">
        <h2 class="subtitle">Log Session</h2>
        <img src="/pages/log.png" alt="">
        <p>To log a workout session, use this page. Your program is already present on this page, so just press "log" on the current day.
            After pressing "log", you can insert your repetitions, sets and weight.
        </p>
    </div>
    <div class="Explanation">
        <h2 class="subtitle">Inventory</h2>
        <img src="/pages/inventory.png" alt="">
        <p>After working out for a while, you will begin to unlock items that can customise your experience on this app.
            On the inventory page, you can see all your unlocked items and equip og unequip them.
            
        </p>
    </div>
    <div class="Explanation">
        <h2 class="subtitle">Achievements</h2>
        <img src="/pages/achievements.png" alt="">
        <p>Here, you can observe your progress towards achievements.
            Getting Achievements on Apex Fitness is easy: You just need to do workouts.
            When increasing your Streak, your Level will also increase. An increase in Level will also unlock an achievement.
            Unlocking an achievement will also unlock a item, which you will find in your inventory.
        </p>
    </div>
    </div>
</template>

<style scoped>
	.Explanation {
		padding: 1vmin;
		width: 80vw;
		height: 70vh;
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
	img {
		height: 50vh;
		/* width: 60%; */
		margin: max(7px, 0.5vmin);

		width: 75vw;
		/* background-size: auto; */
		background-size: contain !important;
		background-repeat: no-repeat !important;
	}

</style>
