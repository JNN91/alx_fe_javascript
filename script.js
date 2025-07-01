let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Be yourself; everyone else is already taken.", category: "Life" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");
const notificationArea = document.getElementById("notificationArea");

// Simulated server
let mockServerQuotes = [
  { id: 1, text: "Server wisdom is universal.", category: "Server" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes in this category.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerText = `"${random.text}" — ${random.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastSelected = localStorage.getItem("lastCategory");
  if (lastSelected) {
    categoryFilter.value = lastSelected;
  }
}

function filterQuotes() {
  localStorage.setItem("lastCategory", categoryFilter.value);
  showRandomQuote();
}

async function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Enter both quote and category.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  alert("Quote added!");

  await postToServer([newQuote]);
}

function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showNotification("Quotes imported successfully!");
      } else {
        alert("Invalid file.");
      }
    } catch (e) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

function showNotification(message) {
  const note = document.createElement("div");
  note.innerText = message;
  note.style.background = "#e0ffe0";
  note.style.border = "1px solid #aaa";
  note.style.padding = "10px";
  note.style.marginTop = "10px";
  notificationArea.appendChild(note);
  setTimeout(() => note.remove(), 4000);
}

// Simulated server fetch/post
function fetchFromServer() {
  return new Promise(res => setTimeout(() => res([...mockServerQuotes]), 1000));
}

function postToServer(newQuotes) {
  return new Promise(res => {
    setTimeout(() => {
      newQuotes.forEach(q => {
        if (!mockServerQuotes.some(sq => sq.text === q.text)) {
          mockServerQuotes.push({ ...q, id: Date.now() + Math.random() });
        }
      });
      res("Posted");
    }, 1000);
  });
}

function startSync() {
  setInterval(async () => {
    const serverQuotes = await fetchFromServer();
    const local = JSON.parse(localStorage.getItem("quotes")) || [];
    let updated = false;

    serverQuotes.forEach(serverQ => {
      if (!local.some(lq => lq.text === serverQ.text)) {
        local.push(serverQ);
        updated = true;
      }
    });

    if (updated) {
      quotes = local;
      saveQuotes();
      populateCategories();
      showNotification("Synced with server. Updates applied.");
    }
  }, 30000);
}

async function manualServerSync() {
  const serverQuotes = await fetchFromServer();
  let newItems = 0;

  serverQuotes.forEach(sq => {
    if (!quotes.some(q => q.text === sq.text)) {
      quotes.push(sq);
      newItems++;
    }
  });

  saveQuotes();
  populateCategories();
  showNotification(`${newItems} new quotes synced from server.`);
}

window.onload = function () {
  populateCategories();
  showRandomQuote();

  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  exportBtn.addEventListener("click", exportQuotes);
  importFile.addEventListener("change", importFromJsonFile);

  const last = sessionStorage.getItem("lastQuote");
  if (last) quoteDisplay.innerText = `"${JSON.parse(last).text}"`;

  startSync();
};
