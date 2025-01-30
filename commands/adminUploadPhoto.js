const fs = require("fs");
const {getFormattedTimestamp} = require("../commonFunctions")

// Admin portal to upload an image
module.exports = {
  page: "/admin/images/upload",
  method: "POST",
  execute: async (req, res) => {
    let body;
    try {
      body = JSON.parse(req.body.toString());
    } catch (err) {
      body = {};
    }

    // input validation
    if(!body.code || !body.file || !body.fileName){
        res.status(400).json({success:false,message:"missing id or image"});
        return;
    }
    if(!body.group){
        body.group = "main";
    }
    if(/^[a-zA-Z0-9]{1,16}$/.test(body.group) == false){
      body.group = "main";
    }
    if(/^[a-zA-Z0-9_]{1,16}\.(jpg|JPG)$/.test(body.fileName) == false){
      body.fileName = "image.jpg";
    } else {
      body.fileName.replaceAll("JPG","jpg");
    }

    // checks if id exists
    let fileLocation = `./database/data/${body.code}.json`;
    if(fs.existsSync(fileLocation)){
      let loginCodeInfo = JSON.parse(fs.readFileSync(fileLocation).toString());
      if(loginCodeInfo.photos[body.group] == undefined){
        loginCodeInfo.photos[body.group] = [];
        loginCodeInfo.preferences[body.group] = [];
        loginCodeInfo.final[body.group] = [];
        loginCodeInfo.loves[body.group] = "";
      }

      // checks the group
      let fileNameAccept = false; let ct = 1; let tmpFilename = body.fileName
      while(fileNameAccept == false){
        if(loginCodeInfo.photos[body.group].includes(tmpFilename)){
          tmpFilename = `${ct}${body.fileName}`;
          ct += 1;
        } else {
          fileNameAccept = true;
        }
      }
      body.fileName = tmpFilename;

      // accepts file for upload
      const buffer = Buffer.from(body.file, "base64");
      fs.writeFileSync(`./database/images/${loginCodeInfo.id}-${body.group}-${body.fileName}`,buffer);
      loginCodeInfo.photos[body.group].push(body.fileName);
      loginCodeInfo.status.push(`UP ${body.group} ${body.fileName} ${getFormattedTimestamp()}`)
      fs.writeFileSync(fileLocation, JSON.stringify(loginCodeInfo))

      res.status(200).json({success:true,message:"Uploaded"})
    } else {
      res.status(404).json({success:false,message:"Given code does not exist"})
    }
    return;
  }
};