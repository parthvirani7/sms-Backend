const express = require("express");
const http = require("http");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const routes = require("./src/routes/route");
const connectDB = require("./src/db/dbconnect");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const socketHandler = require("./src/sockets/socketHandler");
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
socketHandler(io);
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
module.exports = app;
app.use(cors())
app.use(routes);
dotenv.config({
  path: ".env",
});
const PORT = process.env.PORT || 8080
connectDB();
server.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});

