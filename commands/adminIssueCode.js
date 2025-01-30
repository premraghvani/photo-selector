const fs = require("fs");
const {getFormattedTimestamp} = require("../commonFunctions")

// Admin API to issue a new code
module.exports = {
  page: "/admin/codes/issue",
  method: "POST",
  execute: async (req, res) => {
    let body;
    try {
      body = JSON.parse(req.body.toString());
    } catch (err) {
      body = {};
    }

    // input validation
    if(!body.code){
        res.status(400).json({success:false,message:"missing id"});
        return;
    }
    if(!body.description){
        body.description = "";
    }
    if(/^[a-zA-Z0-9]{1,16}$/.test(body.code) == false){
        res.status(400).json({success:false,message:"id must conform to regex ^[a-zA-Z0-9]{1,16}$"});
        return;
    }
    if(/^[a-zA-Z0-9&.\-;:!@ ]{0,128}$/.test(body.description) == false){
        res.status(400).json({success:false,message:"description must conform to regex ^[a-zA-Z0-9&.\-;:!@ ]{0,128}$"});
        return;
    }

    // checks if id exists
    let fileLocation = `./database/data/${body.code}.json`;
    if(fs.existsSync(fileLocation)){
        res.status(400).json({success:false,message:"code in use"});
    } else {
        let entry = {
            id: body.code,
            description: body.description,
            status:[`CR ENTRYCODE ${getFormattedTimestamp()}`],
            photos:{},
            preferences:{},
            final:{},
            loves:{}
        }
        fs.writeFileSync(fileLocation,JSON.stringify(entry));
        res.set(200).json({success:true,message:"created"})
    }
    return;
  }
};