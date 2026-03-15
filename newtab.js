const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQriQICYRLJAacQ-5gE7l7T4ZoDNbF1lL9uf4iX9SSkim1NW_0YRyemuB-0fG0LJOfcjqghyuvDR8lf/pub?gid=1886438249&single=true&output=tsv";

const FALLBACK_QUOTES = [
  { quote: "Do good. Have fun. Be kind.", contributor_name: "", social_link: "" },
  { quote: "Good. Now go fail again.", contributor_name: "", social_link: "" },
  { quote: "Love each other or perish.", contributor_name: "", social_link: "" }
];

function parseCSV(text) {
  const rows = text.trim().split("\n");
  const headers = rows[0].split("\t").map(h => h.trim().toLowerCase());
  return rows.slice(1).map(row => {
    const values = row.split("\t").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || "");
    return obj;
  }).filter(row => row.active === "TRUE" && row.quote);
}

function showQuote(quotes) {
  // Get the current shuffled queue
  let queue = JSON.parse(localStorage.getItem("ponder_queue") || "[]");

  // If queue is empty or doesn't match current quotes length, rebuild it
  if (queue.length === 0) {
    // Create a fresh shuffled array of all indices
    queue = quotes.map((_, i) => i);
    // Fisher-Yates shuffle — proper random, no bias
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }

  // Take the first index from the queue
  const index = queue.shift();
  localStorage.setItem("ponder_queue", JSON.stringify(queue));

  const current = quotes[index];

  document.getElementById("quote").textContent = current.quote;
  document.getElementById("quote").classList.add("visible");

  const contributor = document.getElementById("contributor");
  const link = document.getElementById("contributor-link");

  if (current.contributor_name) {
    link.textContent = current.contributor_name;
    link.href = current.social_link || "#";
    contributor.style.display = "block";
    contributor.classList.add("visible");
  }
}

// Show instantly from cache
const cached = localStorage.getItem("ponder_quotes");
if (cached) {
  showQuote(JSON.parse(cached));
} else {
  showQuote(FALLBACK_QUOTES);
}

// Fetch fresh data silently in background
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const quotes = parseCSV(text);
    if (quotes.length > 0) {
      localStorage.setItem("ponder_quotes", JSON.stringify(quotes));
    }
  })
  .catch(() => {});