import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

dotenv.config();
const API_KEY = process.env.GROQ_API_KEY;
const LLM = process.env.LLM;


/**
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
**/

let history = []; // store last 4 exchanges

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Add user message
  history.push({ role: "user", content: userMessage });

  // Keep only last 8 messages (4 exchanges
  if (history.length > 8 ) history.shift();
  

  const response = await fetch(LLM, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "compound-beta-mini",
      messages: [
        { role: "system", content: "You are a helpful chatbot named Jimbo. Limit answer to 50 words"},
        ...history
      ],
      max_tokens: 300,
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  // Save bot reply
  history.push({ role: "assistant", content: reply });

  res.json({ reply: reply });
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));