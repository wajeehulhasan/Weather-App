const http = require("http");
const fs = require("fs");
const requests = require("requests");
const indexFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
	let temperature = tempVal
		.replace("{%tempval%}", orgVal.main.temp)
		.replace("{%tempmin%}", orgVal.main.temp_min)
		.replace("{%tempmax%}", orgVal.main.temp_max)
		.replace("{%location%}", orgVal.name)
		.replace("{%country%}", orgVal.sys.country)
		.replace("{%tempStatus%}", orgVal.weather[0]);
	return temperature;
	// console.log(orgval.main.temp);
};

const server = http.createServer((req, res) => {
	if (req.url == "/")
		requests(
			"https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=7a1172319da083a113c44ad96da1d389",
		)
			.on("data", (chunk) => {
				const objData = JSON.parse(chunk);
				const arrData = [objData];
				const realTimeData = arrData
					.map((val) => replaceVal(indexFile, val))
					.join(" ");
				res.write(realTimeData);
			})
			.on("end", (err) => {
				if (err) return console.log("connection closed due to errors", err);
				res.end();
			});
});
server.listen(8000, "127.0.0.1");
