// load from localStorage or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit is your mind.", category: "Motivation" },
    { text: "Creativity takes courage.", category: "Inspiration" },
    { text: "Learning never exhausts the mind.", category: "Education" }
  ];
  
  // Save quotes
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // show random
  function showRandomQuote() {
    const selected = document.getElementById("categoryFilter").value;
    let filtered = quotes;
    if (selected !== "all") {
      filtered = quotes.filter(q => q.category === selected);
    }
    if (filtered.length === 0) {
      alert("No quotes in this category.");
      return;
    }
    const q = filtered[Math.floor(Math.random() * filtered.length)];
    document.getElementById("quoteDisplay").innerHTML = `
      <blockquote>"${q.text}"<footer>Category: ${q.category}</footer></blockquote>
    `;
    sessionStorage.setItem("lastQuote", JSON.stringify(q));
  }
  
  // add quote
  async function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      alert("Quote added successfully!");
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      await postQuoteToServer(newQuote);
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // build form
  function createAddQuoteForm() {
    const c = document.getElementById("addQuoteContainer");
    const input1 = document.createElement("input");
    input1.id = "newQuoteText";
    input1.placeholder = "Enter a new quote";
    const input2 = document.createElement("input");
    input2.id = "newQuoteCategory";
    input2.placeholder = "Enter quote category";
    const btn = document.createElement("button");
    btn.textContent = "Add Quote";
    btn.addEventListener("click", addQuote);
    c.appendChild(input1);
    c.appendChild(input2);
    c.appendChild(btn);
  }
  
  // populate categories
  function populateCategories() {
    const sel = document.getElementById("categoryFilter");
    sel.innerHTML = `<option value="all">All Categories</option>`;
    const cats = [...new Set(quotes.map(q => q.category))];
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    });
    const last = localStorage.getItem("lastFilter");
    if (last) sel.value = last;
  }
  
  // filter
  function filterQuotes() {
    const sel = document.getElementById("categoryFilter").value;
    localStorage.setItem("lastFilter", sel);
    const filtered = sel === "all" ? quotes : quotes.filter(q => q.category === sel);
    if (filtered.length === 0) {
      document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
      return;
    }
    const q = filtered[0];
    document.getElementById("quoteDisplay").innerHTML = `
      <blockquote>"${q.text}"<footer>Category: ${q.category}</footer></blockquote>
    `;
  }
  
  // export
  function exportToJsonFile() {
    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  
  // import
  function importFromJsonFile(event) {
    const r = new FileReader();
    r.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          quotes.push(...imported);
          saveQuotes();
          populateCategories();
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid JSON format.");
        }
      } catch {
        alert("Error parsing JSON.");
      }
    };
    r.readAsText(event.target.files[0]);
  }
  
  // post to mock server
  async function postQuoteToServer(q) {
    try {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(q)
      });
      console.log("Posted quote to server");
    } catch(err) {
      console.error("POST failed", err);
    }
  }
  
  // fetch from server
  async function fetchQuotesFromServer() {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      await res.json();
  
      // simulated server data
      const serverQuotes = [
        { text: "Server quote example", category: "Server" }
      ];
  
      // conflict resolution
      if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        document.getElementById("syncNotification").textContent = "Quotes synced with server!";
      } else {
        document.getElementById("syncNotification").textContent = "Quotes synced with server!";
      }
    } catch (err) {
      console.error("Sync failed", err);
      document.getElementById("syncNotification").textContent = "Sync failed.";
    }
  }
  
  // periodic sync
  function syncQuotes() {
    fetchQuotesFromServer();
  }
  setInterval(syncQuotes, 30000); // every 30s
  
  // event listeners
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  
  // init
  createAddQuoteForm();
  populateCategories();
  
  // restore last viewed
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `
      <blockquote>"${q.text}"<footer>Category: ${q.category}</footer></blockquote>
    `;
  }
  
  // initial sync
  syncQuotes();