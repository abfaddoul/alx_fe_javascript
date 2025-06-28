
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
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const toggleFormBtn = document.getElementById('toggleForm');
  const addQuoteForm = document.getElementById('addQuoteForm');
  const categoryFilter = document.getElementById('categoryFilter');
  const exportBtn = document.getElementById('exportQuotes');
  const importBtn = document.getElementById('importQuotes');
  
  function init() {
    loadQuotesFromStorage();
    updateStats();
    updateCategoryFilter();
    showRandomQuote();
    setupEventListeners();
  }
  
  function setupEventListeners() {
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    toggleFormBtn.addEventListener('click', toggleAddQuoteForm);
    exportBtn.addEventListener('click', exportQuotes);
    importBtn.addEventListener('click', importQuotes);
    document.getElementById('newQuoteText').addEventListener('input', validateForm);
    document.getElementById('newQuoteCategory').addEventListener('input', validateForm);
  }
  
  function showRandomQuote() {
    const filteredQuotes = currentCategory === 'all' 
      ? quotes 
      : quotes.filter(q => q.category.toLowerCase() === currentCategory.toLowerCase());
  
    if (filteredQuotes.length === 0) {
      displayQuote({ text: "No quotes available in this category.", category: "info", author: "" });
      return;
    }
  
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    } while (randomIndex === currentQuoteIndex && filteredQuotes.length > 1);
  
    currentQuoteIndex = randomIndex;
    displayQuote(filteredQuotes[randomIndex]);
    animateQuoteDisplay();
  }
  
  function displayQuote(quote) {
    quoteDisplay.innerHTML = `
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-category">${quote.author ? `— ${quote.author} | ` : ''}${quote.category.toUpperCase()}</div>
    `;
  }
  
  function animateQuoteDisplay() {
    quoteDisplay.style.transform = 'scale(0.95)';
    quoteDisplay.style.opacity = '0.7';
    setTimeout(() => {
      quoteDisplay.style.transform = 'scale(1)';
      quoteDisplay.style.opacity = '1';
    }, 150);
  }
  
  function toggleAddQuoteForm() {
    addQuoteForm.classList.toggle('show');
    if (addQuoteForm.classList.contains('show')) {
      toggleFormBtn.textContent = 'Hide Form';
      document.getElementById('newQuoteText').focus();
    } else {
      toggleFormBtn.textContent = 'Add New Quote';
      clearForm();
    }
  }
  
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    const author = document.getElementById('newQuoteAuthor').value.trim();
  
    if (!text || !category) {
      alert('Please fill in both quote text and category fields.');
      return;
    }
  
    const newQuote = { text, category: category.toLowerCase(), author: author || 'Unknown' };
    quotes.push(newQuote);
    updateStats();
    updateCategoryFilter();
    displayQuote(newQuote);
    saveQuotesToStorage();
    showSuccessMessage('Quote added successfully!');
    clearForm();
    addQuoteForm.classList.remove('show');
    toggleFormBtn.textContent = 'Add New Quote';
    animateQuoteDisplay();
  }
  
  function cancelAddQuote() {
    clearForm();
    addQuoteForm.classList.remove('show');
    toggleFormBtn.textContent = 'Add New Quote';
  }
  
  function clearForm() {
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';
  }
  
  function validateForm() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    const addButton = document.querySelector('#addQuoteForm button[onclick="addQuote()"]');
    addButton.disabled = !(text && category);
    addButton.style.opacity = addButton.disabled ? '0.6' : '1';
  }
  
  function updateCategoryFilter() {
    const categories = ['all', ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = categories.map(cat => `
      <button class="category-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}" onclick="filterByCategory('${cat}')">
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
  
  function updateStats() {
    document.getElementById('totalQuotes').textContent = quotes.length;
    document.getElementById('totalCategories').textContent = new Set(quotes.map(q => q.category)).size;
  }
  
  function saveQuotesToStorage() {
    try {
      localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }
  
  function loadQuotesFromStorage() {
    try {
      const saved = localStorage.getItem('quotes');
      if (saved) quotes = JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load from localStorage', e);
    }
  }
  
  function exportQuotes() {
    const data = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccessMessage('Quotes exported successfully!');
  }
  
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
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            quotes = [...quotes, ...imported];
            saveQuotesToStorage();
            updateStats();
            updateCategoryFilter();
            showSuccessMessage(`Imported ${imported.length} quotes successfully!`);
          } else {
            alert('Invalid file format.');
          }
        } catch (err) {
          alert('Error reading file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
  
  function showSuccessMessage(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      z-index: 1000;
    `;
    document.body.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3000);
  }
  
  init();
  