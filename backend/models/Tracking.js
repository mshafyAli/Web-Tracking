

const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  gclid: { type: String, required: false },
  kw: { type: String, required: false },
  gad: { type: String, required: false },
  ip: { type: String, required: true },
  country: { type: String, required: false },
  isVpn: { type: Boolean, required: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tracking", trackingSchema);
