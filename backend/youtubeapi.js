const {app} = require("./server.js");
const auth = require("./authenticate.js");
const {getExerciseByName} = require("./database.js");

//Youtube api
const youtubesearchapi = require("youtube-search-api");

//CSP
app.use(function (req, res, next) {
	res.setHeader("Content-Security-Policy", "default-src 'self'; frame-src *");
	next();
});

//Get video for exercise
app.get("/exercise/video/:name", async (req, res) => {
	let exercise = await getExerciseByName(req.params.name);
	//Get video from google api
	let data = await youtubesearchapi.GetListByKeyword(exercise.name + " tutorial", false, 1, {
		type: "video",
		part: "snippet",
		maxResults: 1,
		order: "relevance",
		relevanceLanguage: "en",
		videoDuration: "short"
	});
	///console.log(exercise.name + ": " + "https://www.youtube.com/watch?v=" + data.items[0].id);
	//Send video back to client
	res.send(data.items[0].id);
});
