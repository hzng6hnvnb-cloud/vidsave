const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("VidSave Server يعمل ✅");
});

app.get("/video", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url || !/^https?:\/\//i.test(url)) {
      return res.status(400).send("الرابط غير صحيح");
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(400).send("تعذر جلب الفيديو");
    }

    const type = response.headers.get("content-type") || "";

    if (!type.startsWith("video/")) {
      return res.status(400).send("الرابط ليس ملف فيديو مباشر");
    }

    res.setHeader("Content-Type", type);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="VidSave-video.mp4"'
    );

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);

  } catch (error) {
    res.status(500).send("حدث خطأ أثناء جلب الفيديو");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VidSave يعمل على المنفذ ${PORT}`);
});
