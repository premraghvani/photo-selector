const fs = require("fs");

// Admin portal for uploading images and grouping them
module.exports = {
  page: "/admin/upload/metadata",
  method: "POST",
  execute: async (req, res) => {
    const { loginCode, description } = req.body;

    // Simulate saving data (replace with actual database logic)
    const data = {
      loginCode,
      description,
    };
    fs.writeFileSync(`./database/data/${loginCode}.json`, JSON.stringify(data, null, 2));

    res.json({ success: true, message: "Successfully created group" });
    return;
  },
};
