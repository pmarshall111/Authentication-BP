//initialising
const express = require("express");
const http = require("http");
//body-parser will be used to parse any request coming in as if it were json.
const bodyParser = require("body-parser");
//morgan is used for logging requests to the console. used for debugging.
const morgan = require("morgan")
const app = express();
const router = require("./router")
const mongoose = require("mongoose")

//db setup
mongoose.connect("mongodb://localhost:auth/auth")

//app setup

//app.use is for adding middleware
// app.use(morgan("combined"))
app.use(bodyParser.json({ type: "*/*" }))
router(app)

//server setup
const PORT = 3000;
const server = http.createServer(app);
server.listen(PORT, function() {
  console.log(`Server ${PORT} is go`)
})
