const fs = require("fs");

// simply serves the front html page
module.exports = {
  page: "/image/fetch",
  method: "GET",
  execute: async (req, res) => {
    let id = req.query.id;
    let fileExists = fs.existsSync(`./database/images/${id}`);
    if(fileExists){
        let content = fs.readFileSync(`./database/images/${id}`);
        res.status(200).set("Content-Type", "image/jpeg").send(content);
    } else {
        res.status(404).send();
    }
    return;
  }
};