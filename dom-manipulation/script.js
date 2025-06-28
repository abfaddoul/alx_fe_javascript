// quotes list
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "motivation", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "leadership", author: "Steve Jobs" },
    { text: "Life is what happens to you while you're busy making other plans.", category: "life", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "dreams", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "inspiration", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", category: "motivation", author: "Tony Robbins" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "perseverance", author: "Winston Churchill" },
    { text: "The way to get started is to quit talking and begin doing.", category: "action", author: "Walt Disney" },
    { text: "Don't let yesterday take up too much of today.", category: "life", author: "Will Rogers" },
    { text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.", category: "failure", author: "Unknown" }
  ];
  
  let currentCategory = 'all';
  let currentQuoteIndex = -1;
  
  // DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const toggleFormBtn = document.getElementById('toggleForm');
  const addQuoteForm = document.getElementById('addQuoteForm');
  const categoryFilter = document.getElementById('categoryFilter');
  const exportBtn = document.getElementById('exportQuotes');
  const importBtn = document.getElementById('importQuotes');
  
  // Init
  function init() {
    updateStats();
    updateCategoryFilter();
    showRandomQuote();
    setupEventListeners();
  }
  
  // Listeners
  function setupEventListeners() {
    newQuoteBtn.addEventListener('click', showRandomQuote);
    toggleFormBtn.addEventListener('click', toggleAddQuoteForm);
    exportBtn.addEventListener('click', exportQuotes);
    importBtn.addEventListener('click', importQuotes);
  }
  
  // Display quote
  function showRandomQuote() {
    const filtered = currentCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category.toLowerCase() === currentCategory.toLowerCase());
  
    if (!filtered.length) {
      displayQuote({ text: "No quotes available in this category.", category: "info", author: "" });
      return;
    }
  
    let index;
    do {
      index = Math.floor(Math.random() * filtered.length);
    } while (index === currentQuoteIndex && filtered.length > 1);
  
    currentQuoteIndex = index;
    displayQuote(filtered[index]);
  }
  
  function displayQuote(quote) {
    quoteDisplay.innerHTML = `
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-category">
        ${quote.author ? `— ${quote.author} | ` : ''}${quote.category.toUpperCase()}
      </div>
    `;
  }
  
  // Add Quote
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    const author = document.getElementById('newQuoteAuthor').value.trim();
  
    if (!text || !category) {
      alert("Fill in both text and category");
      return;
    }
  
    const newQ = { text, category: category.toLowerCase(), author: author || 'Unknown' };
    quotes.push(newQ);
    updateStats();
    updateCategoryFilter();
    displayQuote(newQ);
    addQuoteForm.classList.remove('show');
    toggleFormBtn.textContent = 'Add New Quote';
    clearForm();
  }
  
  function toggleAddQuoteForm() {
    addQuoteForm.classList.toggle('show');
    toggleFormBtn.textContent = addQuoteForm.classList.contains('show') ? 'Hide Form' : 'Add New Quote';
  }
  
  function cancelAddQuote() {
    addQuoteForm.classList.remove('show');
    toggleFormBtn.textContent = 'Add New Quote';
    clearForm();
  }
  
  function clearForm() {
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';
  }
  
  // Categories
  function updateCategoryFilter() {
    const cats = ['all', ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = cats.map(cat => `
      <button class="category-btn ${cat === currentCategory ? 'active' : ''}"
        data-category="${cat}"
        onclick="filterByCategory('${cat}')">
        ${cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>
    `).join('');
  }
  
  function filterByCategory(cat) {
    currentCategory = cat;
    currentQuoteIndex = -1;
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === cat);
    });
    showRandomQuote();
  }
  
  // Stats
  function updateStats() {
    document.getElementById('totalQuotes').textContent = quotes.length;
    document.getElementById('totalCategories').textContent = new Set(quotes.map(q => q.category)).size;
  }
  
  // Export
  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Import
  function importQuotes() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
  
    input.onchange = function (e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            quotes = [...quotes, ...data];
            updateStats();
            updateCategoryFilter();
            showRandomQuote();
          } else {
            alert('Invalid file format');
          }
        } catch {
          alert('Error reading file');
        }
      };
  
      reader.readAsText(file);
    };
  
    input.click();
  }
  
  init();
  