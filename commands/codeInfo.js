const fs = require("fs");

// Gets the code information
module.exports = {
  page: "/code/info",
  method: "GET",
  execute: async (req, res) => {
    const code = req.query.code;

    // input validation
    if(!code){
        res.status(400).json({});
        return;
    }
    if(/^[a-zA-Z0-9]{1,16}$/.test(code) == false){
        res.status(400).json();
        return;
    }

    // checks if id exists
    let fileLocation = `./database/data/${code}.json`;
    if(fs.existsSync(fileLocation) == false){
        res.status(404).json({});
    } else {
        let info = JSON.parse(fs.readFileSync(fileLocation).toString());
        info.programStage = "selfScrutiny"
        res.set(200).json(info)
    }
    return;
  }
};