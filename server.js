const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/chat", (req, res) => {
  const message = req.body.message || "";
  let reply = "I didn’t understand that.";

  if (/help|support/i.test(message)) {
    reply = "You can reach support at https://company.com/support";
  } else if (/cancel/i.test(message)) {
    reply = "Your cancellation request has been sent.";
  } else if (/ticket/i.test(message)) {
    reply = "A ticket has been created. Our team will contact you soon.";
  }

  res.json({ reply });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
