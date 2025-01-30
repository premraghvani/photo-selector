const fs = require("fs");

// Admin API to get the manifest of files approved
module.exports = {
  page: "/admin/manifest",
  method: "GET",
  execute: async (req, res) => {
    // gets the type
    const type = req.query.type; // if equal to csv then serves csv, else serves json

    // gathers all codes
    let filenames = fs.readdirSync("./database/data");
    let codes = []
    filenames.forEach(file=>{
      if(file.match(/.json$/i)){
        codes.push(file.split(".")[0]);
      }
    });

    // extracts the metadatas, image manifest and missing groups
    let metadataManifest = {};
    let imageManifest = [];
    let missingManifest = [];

    codes.forEach(code=>{
      let file = JSON.parse(fs.readFileSync(`./database/data/${code}.json`).toString());

      // metadata manifest
      metadataManifest[file.id] = file.description;

      // image manifest and missing manifest
      let groups = Object.keys(file.photos);
      groups.forEach(group=>{
        let preferences = file.preferences[group];
        let loves = file.loves[group];
        if(preferences.includes(loves) == false && (loves != undefined || loves != "")){
          preferences.push(loves)
        }
        // missing manifest
        if(preferences.length == 0){
          missingManifest.push({
            id: file.id,
            group: group,
            likes: true,
            loves: true
          })
        } else if(loves == undefined || loves == ""){
          missingManifest.push({
            id: file.id,
            group: group,
            likes: false,
            loves: true
          })
        }

        // image manifest
        preferences.forEach(image=>{
          let toPush = {
            image,
            id: file.id,
            group: group,
            loves: false
          }
          if(loves == image){
            toPush.loves = true;
          }
          imageManifest.push(toPush)
        })
      })
    })

    // sorts manifest for image
    imageManifest.sort((a, b) => a.image - b.image);

    if(type == "csv"){
      // constructs a csv, first up: missing manifest
      let content = "PART 1: MISSING MANIFEST\nid,group,likesMissed,lovesMissed,description"
      missingManifest.forEach(missing=>{
        let likeMiss = "";
        if(missing.likes){likeMiss = "X"};
        content += `\n${missing.id},${missing.group},${likeMiss},X,${metadataManifest[missing.id]}`
      });
      
      // next up: for images
      content += `\n\nPART 2: IMAGES\nimageId,userId,group,loves,description`;
      imageManifest.forEach(image=>{
        let loved = "";
        if(image.loves){loved = "X"};
        content += `\n${image.image},${image.id},${image.group},${loved},${metadataManifest[image.id]}`
      });
      res.set("content-type","text/csv").send(content)
    } else {
      // sends manifest for json
      res.json({ metadataManifest, missingManifest, imageManifest });
    }
    return;
  },
};
