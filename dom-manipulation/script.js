// البداية: quotes موجودين
let quotes = [
    { text: "Believe in yourself!", category: "motivation" },
    { text: "Stay hungry, stay foolish.", category: "inspiration" },
    { text: "Less is more.", category: "design" }
  ];
  
  // DOM Elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuote");
  const categorySelect = document.getElementById("categorySelect");
  
  // عرض كوت عشوائي
  function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;
  
    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes found for this category.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  }
  
  // تحديث اللائحة ديال الكاتيجوريز
  function updateCategoryOptions() {
    // نحيد الكاتيجوريز القديمة (بلا "all")
    const existingOptions = Array.from(categorySelect.options).map(opt => opt.value);
    const categories = [...new Set(quotes.map(q => q.category))];
  
    categories.forEach(cat => {
      if (!existingOptions.includes(cat)) {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      }
    });
  }
  
  // إضافة كوت جديدة
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (!quoteText || !quoteCategory) {
      alert("Please fill in both fields.");
      return;
    }
  
    const newQuote = {
      text: quoteText,
      category: quoteCategory
    };
  
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    updateCategoryOptions();
    alert("Quote added successfully!");
  }
  
  // Events
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  
  // أول مرة نحمّلو فيها الصفحة
  updateCategoryOptions();
  showRandomQuote();
  