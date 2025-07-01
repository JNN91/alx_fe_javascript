 // Initial quotes
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious, keep learning.", category: "Education" },
  { text: "Every moment is a fresh beginning.", category: "Inspiration" }
];

  // Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

  // Load quotes from localStorage
function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) quotes = JSON.parse(saved);
}

  // Function to display a random quote (as required by checker)
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available.</em>";
    return;
  }
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.innerHTML = `"${random.text}" - [${random.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

  // Add a new quote and update the DOM
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  showRandomQuote(); // Show the new quote
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

  //  Dynamically create the quote input form
function createAddQuoteForm() {
  const form = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addBtn);

  document.body.appendChild(form);
}

  //  Initialize the app
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();

   //  Event listener for Show New Quote button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

   //  Optionally show a quote when the page loads
  showRandomQuote();
};