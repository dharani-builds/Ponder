const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQriQICYRLJAacQ-5gE7l7T4ZoDNbF1lL9uf4iX9SSkim1NW_0YRyemuB-0fG0LJOfcjqghyuvDR8lf/pub?gid=1886438249&single=true&output=csv";

const FALLBACK_QUOTES = [
  { quote: "Do good. Have fun. Be kind.", contributor_name: "", social_link: "" },
  { quote: "Good. Now go fail again.", contributor_name: "", social_link: "" },
  { quote: "Love each other or perish.", contributor_name: "", social_link: "" }
];

function parseCSV(text) {
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",").map(h => h.trim().toLowerCase());
  return rows.slice(1).map(row => {
    const values = row.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || "");
    return obj;
  }).filter(row => row.active === "TRUE" && row.quote);
}

function showQuote(quotes) {
  // Get previously shown indices
  let shownIndices = JSON.parse(localStorage.getItem("ponder_shown") || "[]");

  // If all quotes have been shown, reset
  if (shownIndices.length >= quotes.length) {
    shownIndices = [];
  }

  // Pick a random index that hasn't been shown yet
  const remaining = quotes
    .map((_, i) => i)
    .filter(i => !shownIndices.includes(i));
  const randomIndex = remaining[Math.floor(Math.random() * remaining.length)];

  // Save it
  shownIndices.push(randomIndex);
  localStorage.setItem("ponder_shown", JSON.stringify(shownIndices));

  const current = quotes[randomIndex];

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