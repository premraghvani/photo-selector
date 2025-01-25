// loads all node dependencies
const express = require("express");
const fs = require("fs");

// configures the app
const app = express();
app.use(express.raw({ type: "*/*", limit: "10mb" }));
app.use(express.json());

// loads up a reference to all commands
const modules = fs
  .readdirSync("./commands")
  .map((file) => require(`./commands/${file}`));
let moduleList = Object.keys(modules);

// allocates different paths of API to different commands
for (var i = 0; i < moduleList.length; i++) {
  let module = modules[moduleList[i]];
  app[module.method.toLowerCase()](module.page, module.execute);
}

// export the app function
module.exports = { app };