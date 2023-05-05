const {app} = require("./server.js");
const auth = require("./authenticate.js");
//const {User} = require("./models/model_user.js");
const {getUserByEmail, getAllUnlocks, addUnlockToUser} = require("./database.js");

app.get("/node/achievements", auth, async (req, res) => {
	const email = req.body.user.email;

	let unlocks = await getAllUnlocks();
	let user = await getUserByEmail(email);
	console.log("Achievements for: " + user.email);
	if (unlocks && user) {
        let unlockList = [];// = structuredClone(unlocks);
        unlocks.forEach(unlock => {
            unlockList.push(unlock.name);
        });
        unlockList.splice(1,1); // red
        //console.log(unlockList)
        let lastUnlockName = user.unlocks[user.unlocks.length - 1].name;
        
        let idx = unlockList.indexOf(lastUnlockName);
        let level = Math.floor(user.streak / 5);
        
        if (idx > -1){
            if (level > (idx + 1) && idx != (unlockList.length - 1)){
                console.log("Unlocked " + unlockList[idx + 1]);
                await addUnlockToUser(email, unlockList[idx+1]);
            }
        }
        else if (lastUnlockName == "red"){
            if (level > 0) {
				console.log("Unlocked " + unlockList[idx + 1]);
				await addUnlockToUser(email, unlockList[idx + 1]);
			}
		} else if (lastUnlockName == "red") {
			if (level > 0) {
				console.log("Unlocked " + unlockList[idx + 1]);
				await addUnlockToUser(email, unlockList[idx + 1]);
			}
		}
		let data = {};
		data.streak = user.streak;
		data.level = level;
		data.unlockNames = unlockList;
		return res.status(200).json(data);
	}

	return res.status(404).send("wrong!!!");
});
