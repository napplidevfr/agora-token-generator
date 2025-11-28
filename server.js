const express = require("express");
const cors = require("cors");

// Import đúng file Agora (CommonJS)
const { RtcTokenBuilder, Role: RtcRole } = require("./RtcTokenBuilder2.js");

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

app.post("/agora-token", (req, res) => {
  try {
    const { uid, channelName } = req.body;

    if (!uid || !channelName) {
      return res.status(400).json({ error: "Missing uid or channelName" });
    }

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      channelName,
      Number(uid),
      RtcRole.PUBLISHER,
      3600,
      3600
    );

    console.log("Generated token:", token);

    return res.json({ token });
  } catch (e) {
    console.error("Token error:", e);
    return res.status(500).json({ error: e.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Token v2 server running on port " + PORT));
