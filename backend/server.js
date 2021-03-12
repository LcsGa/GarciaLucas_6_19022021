const http = require("http");
const app = require("./app");
require("dotenv").config();

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};
const port = normalizePort(process.env.DB_PORT || 3000);
app.set("port", port);

const bind = () => {
  const address = server.address();
  return typeof address === "string" ? "pipe " + address : "port: " + port;
};

const errorHandler = (error) => {
  if (error.syscall !== "listen") throw error;
  switch (error.code) {
    case "EACCESS":
      console.error(bind() + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind() + " is already in use.");
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  console.log("Listening on " + bind());
});

server.listen(port);
