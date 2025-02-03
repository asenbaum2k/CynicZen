const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config(); // For storing API keys

const app = express();
const port = 3000;

app.use(cors()); // Allow frontend requests
app.use(express.json()); // Allow JSON requests

// Fallback static quotes
const fallbackQuotes = [
  "Common sense is like deodorant. The people who need it most never use it.",
  "If at first you don’t succeed, then skydiving is probably not for you.",
  "Why do they call it 'rush hour' when nothing moves?",
  "Teamwork is important—it helps you place the blame on someone else.",
  "You never truly appreciate what you have until it’s gone. Toilet paper is a great example.",
  "Don’t worry if plan A doesn’t work. There are 25 more letters in the alphabet.",
  "If you think nobody cares about you, try missing a couple of credit card payments.",
  "Some people graduate with honors, I am just honored to graduate.",
  "Money can’t buy happiness, but it can buy coffee, which is pretty close.",
  "Behind every successful person, there is a lot of coffee.",
  "Life is short. Smile while you still have teeth.",
  "Dreams don't work unless you do, or unless you have rich parents.",
  "Hard work pays off in the long run. Laziness pays off now.",
  "Behind every great man is a woman rolling her eyes.",
  "The road to success is always under construction.",
  "Some people graduate with honors, I am just honored to graduate.",
];

// Function to fetch a ZenQuote
async function fetchZenQuote() {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    return data[0].q; // Extract the quote
  } catch (error) {
    console.error("Error fetching ZenQuote:", error);
    return null; // Return null if it fails
  }
}

// Function to transform quote via ChatGPT
async function getSatiricalQuote(originalQuote) {
  if (!originalQuote) {
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]; // Return fallback quote
  }

  try {
    const openAIResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Store API key in .env
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a very cynical and sarcastic assistant that turns profound quotes into sarcastic and humorous versions. Dark humor is your most favorite trait",
            },
            {
              role: "user",
              content: `Make this quote sarcastic: "${originalQuote}"`,
            },
          ],
        }),
      }
    );

    const openAIData = await openAIResponse.json();
    return openAIData.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching satirical quote:", error);
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]; // Return fallback quote
  }
}

// API endpoint to fetch and return satirical quote
app.get("/get-quote", async (req, res) => {
  const zenQuote = await fetchZenQuote();
  const satiricalQuote = await getSatiricalQuote(zenQuote);
  res.json({ quote: satiricalQuote });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
