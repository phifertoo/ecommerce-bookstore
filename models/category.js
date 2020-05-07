const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // any space at the beginning or end will be trimmed out
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  // include timestamps
  { timestamps: true }
);

// makes a mongoose model called user based on the userSchema
module.exports = mongoose.model("Category", categorySchema);
