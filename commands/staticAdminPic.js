const fs = require("fs");

// simply serves the front html page
module.exports = {
  page: "/admin/review",
  method: "GET",
  execute: async (req, res) => {
    let body = fs.readFileSync("./assets/adminView.html").toString();
    res.set("Content-Type", "text/html").send(body);
    return;
  }
};