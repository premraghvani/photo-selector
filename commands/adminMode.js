const fs = require("fs");

// Admin portal for setting the current mode
module.exports = {
  page: "/admin/mode",
  method: "POST",
  execute: async (req, res) => {
    const { mode } = req.body;

    // Validate mode
    const validModes = ["self-scrutiny", "review", "final"];
    if (!validModes.includes(mode)) {
      res.status(400).json({ success: false, message: "Invalid mode!" });
      return;
    }

    // Simulate saving the mode
    fs.writeFileSync("./database/mode.json", JSON.stringify({ mode }));

    res.json({ success: true, message: `Mode set to ${mode}` });
    return;
  },
};
