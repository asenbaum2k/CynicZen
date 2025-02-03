// Fetch a satirical quote from our server endpoint, then display it
async function fetchSatiricalQuote() {
  const quoteElement = document.getElementById("quote");

  try {
    // Make sure the server is running on port 3000
    const response = await fetch("http://localhost:3000/get-quote");
    if (!response.ok) {
      throw new Error("Network response was not OK.");
    }
    const data = await response.json();
    quoteElement.textContent = data.quote;
  } catch (error) {
    console.error("Error fetching satirical quote:", error);
    // If the request fails, show a fallback message
    quoteElement.textContent =
      "Sarcasm failed to load. Enjoy blissful ignorance!";
  }
}

// Run when the page finishes loading
document.addEventListener("DOMContentLoaded", fetchSatiricalQuote);
