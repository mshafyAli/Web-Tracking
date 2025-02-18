const express = require("express");
const axios = require("axios");
const requestIp = require("request-ip");
const Tracking = require("../models/Tracking");
const router = express.Router();
const nodemailer = require("nodemailer");

const GEOLOCATION_URL = "http://ip-api.com/json"; 
const VPN_API_KEY = "5648s6-c8489j-4s6hge-o40023"; // Change this to your chosen VPN checking API key
const VPN_CHECK_URL = "https://proxycheck.io/v2"; // Example VPN check API URL


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
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other email services too
  auth: {
    user: "shafyhussain909@gmail.com", // Your email address
    pass: "yzhv jfqm aqwi pyot", // Your email password or app-specific password
  },
});

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

    const isVpn = await checkVpn(ip); // Use the new VPN check function

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

    // If the user is coming from a VPN, send an email notification
    if (isVpn) {
      const mailOptions = {
        from: "shafyhussain909@gmail.com", // Sender address
        to: "shafyali433@gmail.com", // Receiver address
        subject: "VPN User Detected", // Email subject
        text: `A user from IP: ${ip} is accessing the site using a VPN.\n\nGeolocation: ${geoData.city}, ${geoData.country}\n\nTracking Data:\n${JSON.stringify(trackingData)}`,
      };

      // Send email notification
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
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
