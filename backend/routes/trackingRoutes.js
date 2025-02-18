const express = require("express");
const axios = require("axios");
const requestIp = require("request-ip");
const Tracking = require("../models/Tracking");
const router = express.Router();
const nodemailer = require("nodemailer");

const GEOLOCATION_URL = "http://ip-api.com/json"; 
const VPN_API_KEY = "5648s6-c8489j-4s6hge-o40023"; // Change this to your chosen VPN checking API key
const VPN_CHECK_URL = "https://proxycheck.io/v2"; // Example VPN check API URL


let vpnIpsQueue = []; // Array to store VPN detected IPs with timestamp

// Helper function to check if the IP is a VPN
async function checkVpn(ip) {
    try {
      const vpnResponse = await axios.get(`${VPN_CHECK_URL}/${ip}`, {
        params: { key: VPN_API_KEY, vpn: 1, asn: 1 },
      });
      const vpnData = vpnResponse.data[ip];
      console.log("VPN Check Data:", vpnData); // Log the VPN check data
      return vpnData && vpnData.proxy === "yes";
    } catch (error) {
      console.error("Error checking VPN:", error.message);
      return false;
    }
  }

// VPN check API endpoint
router.get("/api/check-vpn", async (req, res) => {
  try {
    const ip = req.query.ip;
    if (!ip) {
      return res.status(400).json({ error: "IP address is required" });
    }

    const isVpn = await checkVpn(ip);
    res.status(200).json({ ip, isVpn });
  } catch (error) {
    console.error("Error in VPN check API:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shafyhussain909@gmail.com", // Your email address
    pass: "yzhv jfqm aqwi pyot", // Use an app-specific password
  },
});

// Function to send email with detected VPN IPs
const sendVpnEmail = (vpnIps) => {
  const mailOptions = {
    from: "shafyhussain909@gmail.com",
    to: "shafyhussain909@gmail.com",
    subject: "VPN Users Detected in the Last Hour",
    text: `The following users accessed the site using a VPN:\n\n${vpnIps
      .map((ipData) => `IP: ${ipData.ip}, Geolocation: ${ipData.geoData.country}`)
      .join("\n")}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

// Function to process and send email after 1 hour
const processVpnQueue = () => {
  const currentTime = Date.now();
  const oneHourAgo = currentTime - 60 * 60 * 1000; // 1 hour ago in milliseconds

  // Filter out VPN IPs older than 1 hour
  const vpnIpsToSend = vpnIpsQueue.filter((ipData) => ipData.timestamp <= oneHourAgo);

  if (vpnIpsToSend.length > 0) {
    sendVpnEmail(vpnIpsToSend);
  }

  // Clear the queue after processing
  vpnIpsQueue = vpnIpsQueue.filter((ipData) => ipData.timestamp > oneHourAgo);
};

// Set an interval to process the queue every minute
setInterval(processVpnQueue, 60 * 1000); // Every minute


router.get("/api/track", async (req, res) => {
  try {
    const ip = req.query.ip || requestIp.getClientIp(req);
    console.log("IP to track:", ip);

    const domain = req.query.domain || req.hostname;
    const gclid = req.query.gclid || null;
    const gad = req.query.gad || null;
    const kw = req.query.kw || null;

    // Geolocation request using ip-api
    const geoResponse = await axios.get(`${GEOLOCATION_URL}/${ip}`);
    const geoData = geoResponse.data;
    console.log("Geolocation Data:", geoData);

    const isVpn = await checkVpn(ip); // Use the VPN check function

    const trackingData = new Tracking({
      domain,
      gclid,
      gad,
      kw,
      ip,
      country: geoData.country || "Unknown", // Using ip-api response country
      isVpn,
    });

    await trackingData.save();

    // If the user is coming from a VPN, store the data temporarily
    if (isVpn) {
      vpnIpsQueue.push({
        ip,
        timestamp: Date.now(), // Capture the time when VPN was detected
        geoData,
      });
    }

    res.status(201).json({ message: "Tracking information logged successfully", trackingData });
  } catch (error) {
    console.error("Error tracking user data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Existing tracking API
// router.get("/api/track", async (req, res) => {
//   try {
//     const ip = req.query.ip || requestIp.getClientIp(req);
//     console.log("IP to track:", ip);

//     const domain = req.query.domain || req.hostname;
//     const gclid = req.query.gclid || null;
//     const gad = req.query.gad || null; 
//     const kw = req.query.kw || null;  

//     // Geolocation request using ip-api
//     const geoResponse = await axios.get(`${GEOLOCATION_URL}/${ip}`);
//     const geoData = geoResponse.data;
//     console.log("Geolocation Data:", geoData);

//     const isVpn = await checkVpn(ip); // Use the new VPN check function

//     const trackingData = new Tracking({
//       domain,
//       gclid,
//       gad,      
//       kw,  
//       ip,
//       country: geoData.country || "Unknown", // Using ip-api response country
//       isVpn,
//     });

//     await trackingData.save();
//     res.status(201).json({ message: "Tracking information logged successfully", trackingData });
//   } catch (error) {
//     console.error("Error tracking user data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Fetch tracking records
router.get("/api/tracking-records", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await Tracking.deleteMany({ date: { $lt: sevenDaysAgo } });

    const records = await Tracking.find();
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching tracking records:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a specific tracking record
router.delete("/api/tracking-records/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecord = await Tracking.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
