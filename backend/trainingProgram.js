const {app} = require("./server.js");

//Program Recommendations
app.get("/trainingProgram/recommend", (req, res) => {
	let programs = [
		{
			name: "Recommendation 1",
			description: "The first recommended training program",
			exercises: [
				{
					name: "Test",
					description: "Test",
					sets: [
						{
							reps: 5
						}
					]
				}
			]
		},
		{
			name: "Recommendation 2",
			description: "The second recommended training program",
			exercises: [
				{
					name: "Test",
					description: "Test",
					sets: [
						{
							reps: 5
						}
					]
				}
			]
		},
		{
			name: "Recommendation 3",
			description: "The third and final recommended training program",
			exercises: [
				{
					name: "Test",
					description: "Test",
					sets: [
						{
							reps: 5
						}
					]
				}
			]
		}
	];
	console.log(programs);
	res.json(programs);
});

//Program Suggestions
app.post("/trainingProgram/suggest", (req, res) => {
	let settings = req.body;
	console.log(settings);

	let programs = [];

	for (let i = 0; i < 3; i++) {
		let program = {
			name: "Suggestion " + (i + 1),
			description: "Test",
			exercises: [
				{
					name: "Test",
					description: "Test",
					sets: [
						{
							reps: 10
						}
					]
				}
			]
		};

		programs.push(program);
	}

	res.json(programs);
});
