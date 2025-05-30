const mongoose = require("mongoose");

const ProfileViewSchema = new mongoose.Schema({
  viewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  viewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ProfileView", ProfileViewSchema);
