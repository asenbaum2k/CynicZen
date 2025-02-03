const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Loads your OPENAI_API_KEY from .env

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Parse JSON from incoming requests

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

/**
 * Fetches a random quote from the ZenQuotes API.
 * Returns null if there is an error (to trigger fallback).
 */
async function fetchZenQuote() {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    // ZenQuotes returns an array with one object: [{ q: "Quote", a: "Author" }]

    return data[0].q || null;
  } catch (error) {
    console.error("Error fetching from ZenQuotes:", error);
    return null;
  }
}

/**
 * Sends the original quote to ChatGPT via OpenAI API
 * to produce a funny, satirical version.
 * Returns a fallback quote if there's an error.
 */
async function getSatiricalQuote(originalQuote) {
  // If the original quote is null, skip ChatGPT and go straight to fallback
  if (!originalQuote) {
    return randomFallbackQuote();
  }
  console.log(originalQuote);

  const apiKey = process.env.OPENAI_API_KEY; // Make sure it's in your .env

  if (!apiKey) {
    console.error("No OPENAI_API_KEY found in .env. Using fallback quote.");
    return randomFallbackQuote();
  }

  try {
    const openAIResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a moody and sarcastic assistant that turns profound quotes into sarcastic, cynical versions. You want to really ruin my day. Dark humor is your favorite trait. Only use few words. Your sarcastic quote should not be longer than the original! This is very important! If the original quote is positive and engaging, please turn it into a discouraging quote! You can be really daring! My fail is your greatest joy. Just roast me!!!",
            },
            {
              role: "user",
              content: `Read this quote and find the : "${originalQuote}"`,
            },
          ],
        }),
      }
    );

    const openAIData = await openAIResponse.json();

    if (openAIData.choices && openAIData.choices.length > 0) {
      console.log(openAIData.choices[0].message.content.trim());
      return openAIData.choices[0].message.content.trim();
    }
    // If the API response is unexpected, fallback
    return randomFallbackQuote();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return randomFallbackQuote();
  }
}

/** Returns one random fallback quote */
function randomFallbackQuote() {
  return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
}

/**
 * GET endpoint: /get-quote
 * 1. Fetch from ZenQuotes
 * 2. Alter it via ChatGPT
 * 3. Return the final satirical quote
 */
app.get("/get-quote", async (req, res) => {
  const zenQuote = await fetchZenQuote();
  const satiricalQuote = await getSatiricalQuote(zenQuote);
  res.json({ quote: satiricalQuote });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
