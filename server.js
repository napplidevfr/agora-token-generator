import express from "express";
import cors from "cors";
import pkg from "agora-access-token";

const { RtcTokenBuilder, RtcRole } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

if (!APP_ID || !APP_CERT) {
  console.error("❌ Missing AGORA_APP_ID or AGORA_APP_CERTIFICATE");
  process.exit(1);
}

app.post("/agora-token", (req, res) => {
  try {
    const { uid, channelName, role } = req.body;

    if (uid === undefined || uid === null || !channelName) {
      return res.status(400).json({
        error: "Missing uid or channelName",
      });
    }

    const rtcRole =
      role === "SUBSCRIBER" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

    const tokenExpirationInSeconds = 3600;
    const privilegeExpirationInSeconds = 3600;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      channelName,
      Number(uid),
      rtcRole,
      tokenExpirationInSeconds,
      privilegeExpirationInSeconds
    );

    console.log("🎉 Generated RTC Token:", token);

    return res.json({
      token,
      expiresIn: tokenExpirationInSeconds,
    });
  } catch (e) {
    console.error("❌ Token error:", e);
    return res.status(500).json({ error: e.toString() });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Agora Token Server running on port", PORT);
});
