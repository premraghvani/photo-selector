const fs = require("fs");

// Admin API to set current mode
module.exports = {
  page: "/admin/mode",
  method: "POST",
  execute: async (req, res) => {
    let body;
    try {
      body = JSON.parse(req.body.toString());
    } catch (err) {
      body = {};
    }
    const { mode } = body;

    // Validate mode
    const validModes = ["selfScrutiny", "review"];
    if (!validModes.includes(mode)) {
      res.status(400).json({ success: false, message: "Invalid mode" });
      return;
    }

    // Simulate saving the mode
    fs.writeFileSync("./database/mode.json", JSON.stringify({ mode }));

    res.json({ success: true, message: `Mode set to ${mode}` });
    return;
  },
};
