// Initial array of quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" },
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// Display a random quote (optionally filtered by category)
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase())
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const quoteText = textInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both a quote and category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);

  // Update category dropdown if new category is added
  if (!Array.from(categoryFilter.options).some(opt => opt.value.toLowerCase() === quoteCategory.toLowerCase())) {
    const option = document.createElement("option");
    option.value = quoteCategory;
    option.textContent = quoteCategory;
    categoryFilter.appendChild(option);
  }

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);
