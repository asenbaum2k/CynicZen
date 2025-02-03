async function fetchSatiricalQuote() {
  const quoteElement = document.getElementById("quote");

  try {
    const response = await fetch("http://localhost:3000/get-quote");
    const data = await response.json();
    quoteElement.textContent = data.quote;
  } catch (error) {
    console.error("Error fetching satirical quote:", error);
    quoteElement.textContent = "Sarcasm failed to load. Try again later.";
  }
}

// Load a quote when the page loads
document.addEventListener("DOMContentLoaded", fetchSatiricalQuote);
