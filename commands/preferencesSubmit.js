const fs = require("fs");
const {getFormattedTimestamp} = require("../commonFunctions")

// To submit preferences
module.exports = {
  page: "/preferences/submit",
  method: "POST",
  execute: async (req, res) => {
    let body;
    try {
      body = JSON.parse(req.body.toString());
    } catch (err) {
      body = {};
    }
    const code = body.id;

    // input validation
    if(!code || !body.likes || !body.love){
        res.status(400).json({message:"Missing code, likes, loves"});
        return;
    }
    if(/^[a-zA-Z0-9]{1,16}$/.test(code) == false){
        res.status(400).json({message:"Code does not exist"});
        return;
    }
    
    // checks if id exists
    let fileLocation = `./database/data/${code}.json`;
    if(fs.existsSync(fileLocation) == false){
        res.status(404).json({message:"Code not found"});
        return;
    }

    let info = JSON.parse(fs.readFileSync(fileLocation).toString());
    
    // to add loves to likes, if not done already
    let loveGroups = Object.keys(body.love);
    for(var i = 0; i < loveGroups.length; i++){
        let item = body.love[loveGroups[i]];
        if(body.likes[loveGroups[i]].includes(item) == false){
            body.likes[loveGroups[i]].push(item);
        }
    }

    let validGroups = Object.keys(info.photos);

    // inserts into info
    for(var i = 0; i < loveGroups.length; i++){
        let group = loveGroups[i];
        let item = body.love[group];
        if(validGroups.includes(group)){
            info.loves[group] = item;
        }
    }
    let likeGroups = Object.keys(body.likes);
    for(var i = 0; i < likeGroups.length; i++){
        let group = likeGroups[i];
        let items = body.likes[group];
        if(validGroups.includes(group)){
            info.preferences[group] = items;
        }
    }

    // logs
    info.status.push(`PREF UPDATE ${getFormattedTimestamp()}`)

    // writes
    fs.writeFileSync(fileLocation,JSON.stringify(info));
    res.set(200).json({success:true,message:"Updated Preferences"})

  },
};
