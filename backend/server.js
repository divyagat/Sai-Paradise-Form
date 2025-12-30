const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

// 🔗 B2B Bricks CRM Hook
const CRM_URL =
  "https://connector.b2bbricks.com/api/Integration/hook/7050d279-271b-467c-8e0b-e847c75293c1";

/* ===============================
   GET REAL USER IP
================================ */
function getUserIP(req) {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "";

  return ip.replace("::ffff:", "") || "N/A";
}

/* ===============================
   IP → LOCATION
================================ */
async function getLocationFromIP(ip) {
  try {
    if (!ip || ip === "127.0.0.1" || ip === "::1") return "Localhost";

    const res = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`
    );

    return res.data.status === "success"
      ? `${res.data.city}, ${res.data.regionName}, ${res.data.country}`
      : "Unknown";
  } catch {
    return "Unknown";
  }
}

/* ===============================
   RECEIVE LEAD
================================ */
app.post("/api/leads", async (req, res) => {
  try {
    const { fullName, email, phone, interest, bhkType, budget } = req.body;

    if (!fullName || !phone || !interest) {
      return res.status(400).json({ success: false });
    }

    const visitorIP = getUserIP(req);
    const leadLocation = await getLocationFromIP(visitorIP);

    // 🧾 FULL DETAILS → REQUIREMENTS
    const remark =
      `Project: ${interest}\n` +
      `Unit Type: ${bhkType}\n` +
      `Visitor IP: ${visitorIP}\n` +
      `Lead Location: ${leadLocation}`;

    // ✅ CRM PAYLOAD
    const crmPayload = {
      name: fullName,
      email: email || "",
      mobile: phone,

      // 🔥 CRM "Interested In"
      project: interest,

      // 🔥 CRM "Requirements"
      remark: remark,

      outcome: "Digital Lead",
      budget: budget || "",
      anti_spam_id: Date.now()
    };

    const crmRes = await axios.post(CRM_URL, crmPayload, {
      headers: { "Content-Type": "application/json" }
    });

    res.json({ success: true, crm: crmRes.data });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ===============================
   START SERVER
================================ */
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
