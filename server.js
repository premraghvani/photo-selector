const port = 3030;

// actually runs the server.
const { app } = require("./app.js");

app.listen(port);
console.log(`Services available - access on this device at http://localhost:${port} - please ensure ports are configured correctly should you want to access on other internet devices.`)