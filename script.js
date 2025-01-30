// script.js

// Array of sample cynical quotes
const quotes = [
  "Life is short. Smile while you still have teeth.",
  "Dreams don't work unless you do, or unless you have rich parents.",
  "Hard work pays off in the long run. Laziness pays off now.",
  "Behind every great man is a woman rolling her eyes.",
  "The road to success is always under construction.",
  "Some people graduate with honors, I am just honored to graduate.",
];

// Function to display a random quote
function displayRandomQuote() {
  const quoteElement = document.getElementById("quote");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteElement.textContent = quotes[randomIndex];
}

// Call the function to display a quote when the page loads
displayRandomQuote();
