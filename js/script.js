/*
  Quotely UI logic (simple and beginner-friendly)
  - Static quote/category data
  - View switching
  - Search + category + author filter
  - Load more, random quote, and copy quote
  - Modal open/close
*/

const quotes = [
  { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation", likes: 1247, saved: true, liked: true },
  { id: 2, text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Leadership", likes: 892, saved: true, liked: false },
  { id: 3, text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life", likes: 2103, saved: true, liked: true },
  { id: 4, text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams", likes: 1567, saved: false, liked: true },
  { id: 5, text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Inspiration", likes: 1834, saved: false, liked: false },
  { id: 6, text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Wisdom", likes: 2456, saved: true, liked: true },
  { id: 7, text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success", likes: 1310, saved: false, liked: false },
  { id: 8, text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt", category: "Courage", likes: 904, saved: true, liked: false },
  { id: 9, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivation", likes: 1112, saved: true, liked: true },
  { id: 10, text: "Dream big and dare to fail.", author: "Norman Vaughan", category: "Dreams", likes: 744, saved: false, liked: false },
  { id: 11, text: "Everything you can imagine is real.", author: "Pablo Picasso", category: "Inspiration", likes: 965, saved: false, liked: true },
  { id: 12, text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "Wisdom", likes: 879, saved: true, liked: false },
  { id: 13, text: "Happiness depends upon ourselves.", author: "Aristotle", category: "Life", likes: 1002, saved: false, liked: false },
  { id: 14, text: "Act as if what you do makes a difference. It does.", author: "William James", category: "Motivation", likes: 832, saved: true, liked: true },
  { id: 15, text: "Quality is not an act, it is a habit.", author: "Aristotle", category: "Success", likes: 768, saved: false, liked: false },
  { id: 16, text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "Motivation", likes: 1321, saved: true, liked: true },
  { id: 17, text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington", category: "Leadership", likes: 654, saved: false, liked: false },
  { id: 18, text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Life", likes: 1238, saved: true, liked: true },
  { id: 19, text: "Do what is right, not what is easy.", author: "Roy T. Bennett", category: "Courage", likes: 577, saved: false, liked: false },
  { id: 20, text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell", category: "Leadership", likes: 833, saved: true, liked: false },
  { id: 21, text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Success", likes: 1468, saved: true, liked: true },
  { id: 22, text: "Don’t wait. The time will never be just right.", author: "Napoleon Hill", category: "Motivation", likes: 907, saved: false, liked: true },
  { id: 23, text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Success", likes: 811, saved: true, liked: false },
  { id: 24, text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "Life", likes: 1602, saved: true, liked: true },
  { id: 25, text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "Wisdom", likes: 1390, saved: false, liked: true },
  { id: 26, text: "Make each day your masterpiece.", author: "John Wooden", category: "Inspiration", likes: 745, saved: false, liked: false },
  { id: 27, text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem", category: "Dreams", likes: 1156, saved: true, liked: true },
  { id: 28, text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Wisdom", likes: 922, saved: false, liked: false },
  { id: 29, text: "Your life does not get better by chance, it gets better by change.", author: "Jim Rohn", category: "Life", likes: 966, saved: true, liked: false },
  { id: 30, text: "Well begun is half done.", author: "Aristotle", category: "Success", likes: 631, saved: false, liked: false },
  { id: 31, text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie", category: "Motivation", likes: 702, saved: true, liked: false },
  { id: 32, text: "You become what you believe.", author: "Oprah Winfrey", category: "Inspiration", likes: 1210, saved: true, liked: true },
  { id: 33, text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh", category: "Leadership", likes: 685, saved: false, liked: false },
  { id: 34, text: "Courage is grace under pressure.", author: "Ernest Hemingway", category: "Courage", likes: 543, saved: false, liked: false },
  { id: 35, text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", category: "Motivation", likes: 976, saved: true, liked: true },
  { id: 36, text: "Nothing will work unless you do.", author: "Maya Angelou", category: "Success", likes: 1109, saved: true, liked: true },
  { id: 37, text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Inspiration", likes: 1743, saved: true, liked: true },
  { id: 38, text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", category: "Wisdom", likes: 894, saved: false, liked: false },
  { id: 39, text: "The best way out is always through.", author: "Robert Frost", category: "Courage", likes: 579, saved: false, liked: false },
  { id: 40, text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupery", category: "Dreams", likes: 808, saved: true, liked: false },
];

const categories = [
  { name: "All", icon: "◌", gradient: "linear-gradient(135deg,#5dd0ff,#50e4c3)" },
  { name: "Motivation", icon: "⚡", gradient: "linear-gradient(135deg,#58b4ff,#4f85ff)" },
  { name: "Life", icon: "♡", gradient: "linear-gradient(135deg,#ff66b8,#9f53ff)" },
  { name: "Wisdom", icon: "⌘", gradient: "linear-gradient(135deg,#ff9d63,#ff5d5d)" },
  { name: "Success", icon: "◉", gradient: "linear-gradient(135deg,#4ad9a7,#49becf)" },
  { name: "Leadership", icon: "✦", gradient: "linear-gradient(135deg,#6cb1ff,#4f8cff)" },
  { name: "Dreams", icon: "☾", gradient: "linear-gradient(135deg,#66d5ff,#7a9cff)" },
  { name: "Inspiration", icon: "✧", gradient: "linear-gradient(135deg,#4bc9ff,#5be8ce)" },
  { name: "Courage", icon: "◇", gradient: "linear-gradient(135deg,#ffa978,#ff7474)" },
];

const state = {
  view: "home",
  selectedCategory: "All",
  selectedAuthor: "All",
  search: "",
  selectedQuoteId: 2,
  profileTab: "saved",
  visibleCount: 9,
  perLoad: 9,
};

const views = {
  home: document.getElementById("view-home"),
  explore: document.getElementById("view-explore"),
  detail: document.getElementById("view-detail"),
  profile: document.getElementById("view-profile"),
};

const homeFeaturedGrid = document.getElementById("home-featured-grid");
const categoriesGrid = document.getElementById("categories-grid");
const filtersRow = document.getElementById("filters-row");
const exploreGrid = document.getElementById("explore-grid");
const resultCount = document.getElementById("result-count");
const loadMoreButton = document.getElementById("load-more-button");
const randomQuoteButton = document.getElementById("random-quote-button");
const authorFilter = document.getElementById("author-filter");
const detailCard = document.getElementById("detail-card");
const profileTabs = document.getElementById("profile-tabs");
const profileGrid = document.getElementById("profile-grid");
const searchInput = document.getElementById("search-input");
const menuItems = document.querySelectorAll(".menu-item");
const jumpButtons = document.querySelectorAll("[data-view-target]");

const authModal = document.getElementById("auth-modal");
const getStartedButton = document.getElementById("get-started-button");
const openAuthFromHero = document.getElementById("open-auth-from-hero");
const closeAuthModal = document.getElementById("close-auth-modal");
const continueWithoutAuth = document.getElementById("continue-without-auth");

function switchView(viewName) {
  state.view = viewName;

  Object.entries(views).forEach(([name, element]) => {
    element.classList.toggle("is-visible", name === viewName);
  });

  menuItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === viewName);
  });
}

function quoteToClipboardText(quote) {
  return `"${quote.text}" — ${quote.author}`;
}

function copyQuote(quote) {
  const text = quoteToClipboardText(quote);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers.
  const temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}

function createQuoteCard(quote, onClick) {
  const card = document.createElement("article");
  card.className = "quote-card glass-card";
  card.innerHTML = `
    <div>
      <p class="quote-text">"${quote.text}"</p>
      <p class="quote-author">— ${quote.author}</p>
    </div>
    <div class="quote-footer">
      <span>${quote.category}</span>
      <div class="quote-actions">
        <span>♡ ${quote.likes}</span>
        <button class="quote-copy-btn" type="button">Copy</button>
      </div>
    </div>
  `;

  const copyButton = card.querySelector(".quote-copy-btn");
  copyButton.addEventListener("click", (event) => {
    event.stopPropagation();
    copyQuote(quote);
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1000);
  });

  if (onClick) {
    card.addEventListener("click", () => onClick(quote));
  }

  return card;
}

function renderHome() {
  homeFeaturedGrid.innerHTML = "";
  quotes.slice(0, 6).forEach((quote) => {
    homeFeaturedGrid.appendChild(createQuoteCard(quote, openDetailFromQuote));
  });

  categoriesGrid.innerHTML = "";
  categories.slice(1, 5).forEach((category) => {
    const card = document.createElement("article");
    card.className = "category-card glass-card";
    card.innerHTML = `
      <div class="category-icon" style="background:${category.gradient}">${category.icon}</div>
      <h3>${category.name}</h3>
    `;

    card.addEventListener("click", () => {
      state.selectedCategory = category.name;
      switchView("explore");
      renderExplore();
    });

    categoriesGrid.appendChild(card);
  });
}

function getUniqueAuthors() {
  const unique = new Set();
  quotes.forEach((quote) => unique.add(quote.author));
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

function renderAuthorFilterOptions() {
  authorFilter.innerHTML = '<option value="All">All Authors</option>';
  getUniqueAuthors().forEach((author) => {
    const option = document.createElement("option");
    option.value = author;
    option.textContent = author;
    authorFilter.appendChild(option);
  });
}

function renderFilters() {
  filtersRow.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.textContent = category.name;
    button.classList.toggle("is-active", state.selectedCategory === category.name);

    button.addEventListener("click", () => {
      state.selectedCategory = category.name;
      state.visibleCount = state.perLoad;
      renderExplore();
    });

    filtersRow.appendChild(button);
  });
}

function filteredExploreQuotes() {
  const keyword = state.search.trim().toLowerCase();
  return quotes.filter((quote) => {
    const byCategory = state.selectedCategory === "All" || quote.category === state.selectedCategory;
    const byAuthor = state.selectedAuthor === "All" || quote.author === state.selectedAuthor;
    const byText = quote.text.toLowerCase().includes(keyword) || quote.author.toLowerCase().includes(keyword);
    return byCategory && byAuthor && byText;
  });
}

function renderExplore() {
  renderFilters();
  const filtered = filteredExploreQuotes();
  const visibleQuotes = filtered.slice(0, state.visibleCount);
  resultCount.textContent = `Showing ${visibleQuotes.length} of ${filtered.length} quotes`;
  exploreGrid.innerHTML = "";

  visibleQuotes.forEach((quote) => {
    exploreGrid.appendChild(createQuoteCard(quote, openDetailFromQuote));
  });

  loadMoreButton.style.display = filtered.length > state.visibleCount ? "inline-flex" : "none";
}

function openDetailFromQuote(quote) {
  state.selectedQuoteId = quote.id;
  renderDetail();
  switchView("detail");
}

function renderDetail() {
  const selected = quotes.find((quote) => quote.id === state.selectedQuoteId) || quotes[0];
  detailCard.innerHTML = `
    <div class="top-border-line"></div>
    <p class="detail-text">"${selected.text}"</p>
    <p class="detail-author">— ${selected.author}</p>
    <div class="detail-actions">
      <span class="action-pill">♡ ${selected.likes} Likes</span>
      <span class="action-pill">Save</span>
      <span class="action-pill">⤴ Share</span>
      <button class="action-pill" id="copy-detail-button" type="button">Copy Quote</button>
    </div>
  `;

  const copyDetailButton = document.getElementById("copy-detail-button");
  copyDetailButton.addEventListener("click", () => {
    copyQuote(selected);
    copyDetailButton.textContent = "Copied";
    setTimeout(() => {
      copyDetailButton.textContent = "Copy Quote";
    }, 1000);
  });
}

function profileCollection() {
  if (state.profileTab === "saved") return quotes.filter((quote) => quote.saved);
  if (state.profileTab === "liked") return quotes.filter((quote) => quote.liked);
  return quotes.slice(0, 3);
}

function renderProfileTabs() {
  const tabs = [
    { id: "saved", label: "Saved", count: quotes.filter((quote) => quote.saved).length },
    { id: "liked", label: "Liked", count: quotes.filter((quote) => quote.liked).length },
    { id: "submitted", label: "Submitted", count: 3 },
  ];

  profileTabs.innerHTML = "";
  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.classList.toggle("is-active", state.profileTab === tab.id);
    button.textContent = `${tab.label} ${tab.count}`;

    button.addEventListener("click", () => {
      state.profileTab = tab.id;
      renderProfile();
    });

    profileTabs.appendChild(button);
  });
}

function renderProfile() {
  renderProfileTabs();
  profileGrid.innerHTML = "";
  profileCollection().forEach((quote) => {
    profileGrid.appendChild(createQuoteCard(quote, openDetailFromQuote));
  });
}

function openAuthModal() {
  authModal.classList.add("is-open");
}

function closeAuth() {
  authModal.classList.remove("is-open");
}

function setupEvents() {
  menuItems.forEach((item) => {
    item.addEventListener("click", () => switchView(item.dataset.view));
  });

  jumpButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.viewTarget);
      if (button.dataset.viewTarget === "explore") {
        state.visibleCount = state.perLoad;
        renderExplore();
      }
    });
  });

  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    state.visibleCount = state.perLoad;
    renderExplore();
  });

  authorFilter.addEventListener("change", (event) => {
    state.selectedAuthor = event.target.value;
    state.visibleCount = state.perLoad;
    renderExplore();
  });

  loadMoreButton.addEventListener("click", () => {
    state.visibleCount += state.perLoad;
    renderExplore();
  });

  randomQuoteButton.addEventListener("click", () => {
    const available = filteredExploreQuotes();
    if (available.length === 0) return;
    const randomIndex = Math.floor(Math.random() * available.length);
    openDetailFromQuote(available[randomIndex]);
  });

  getStartedButton.addEventListener("click", openAuthModal);
  openAuthFromHero.addEventListener("click", openAuthModal);
  closeAuthModal.addEventListener("click", closeAuth);
  continueWithoutAuth.addEventListener("click", closeAuth);

  authModal.addEventListener("click", (event) => {
    if (event.target === authModal) closeAuth();
  });
}

function init() {
  setupEvents();
  renderAuthorFilterOptions();
  renderHome();
  renderExplore();
  renderDetail();
  renderProfile();
  switchView("home");
}

init();
