const fs = require("fs");

// Admin API to get all codes
module.exports = {
  page: "/admin/codes/list",
  method: "GET",
  execute: async (req, res) => {
    let items = [];
    let filenames = fs.readdirSync("./database/data");
    filenames.forEach(file=>{
      if(file.match(/.json$/i)){
        items.push(file.split(".")[0]);
      }
    });
    res.status(200).send(items)
    return;
  }
};