document.addEventListener("DOMContentLoaded", () => {
  // Tambahkan class aktif ke item yang diklik
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      menuItems.forEach((menu) => menu.classList.remove("active"));
      item.classList.add("active");
    });
  });
});

// Efek Parallax: Gerakkan background lebih lambat dari scroll
// Parallax Effect for Banner
window.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY;
  const bannerBackground = document.querySelector(".banner-background");

  // Move background based on scroll position (adjust multiplier for speed)
  bannerBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Adjust multiplier (0.3) to control speed
});

// Menyimpan posisi scroll terakhir
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    navbar.classList.add("hidden");
    navbar.classList.remove("transparent");
  } else {
    navbar.classList.remove("hidden");
    if (currentScroll > 50) {
      navbar.classList.add("transparent");
    } else {
      navbar.classList.remove("transparent");
    }
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Cards
// Sample Data (for demo purposes)
const posts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  date: new Date(2025, 0, (i % 30) + 1).toISOString().split("T")[0], // Random dates
}));

// Global Image Pool (Array of images for random selection)
const imagePool = [
  "img/card1.jpg",
  "img/card2.jpg",
  "img/card3.jpg",
  "img/card4.jpg",
  "img/card5.jpg",
];

// Global Title Pool (Array of titles for random selection)
const titlePool = [
  "Exciting News: Big Announcement!",
  "The Journey Continues: Latest Updates",
  "Discover What's New in the World of Tech",
  "How to Maximize Your Productivity",
  "Programming Trends in 2025: How New Technologies Like AI and Blockchain Are Changing the Way We Write Code",
  "Behind the Scenes: A Look at Our Process",
];

// State
let currentPage = 1;
let itemsPerPage = 10;
let sortBy = "newest";

// DOM Elements
const cardList = document.getElementById("card-list");
const pagination = document.getElementById("pagination");
const showPerPageSelect = document.getElementById("show-per-page");
const sortBySelect = document.getElementById("sort-by");
const currentRange = document.getElementById("current-range");
const totalItems = document.getElementById("total-items");

// Initialize
function init() {
  totalItems.textContent = posts.length;
  loadPage();
  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  showPerPageSelect.addEventListener("change", (e) => {
    itemsPerPage = +e.target.value;
    currentPage = 1;
    saveState();
    loadPage();
  });

  sortBySelect.addEventListener("change", (e) => {
    sortBy = e.target.value;
    currentPage = 1;
    saveState();
    loadPage();
  });

  pagination.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      currentPage = +e.target.dataset.page;
      saveState();
      loadPage();
    }
  });
}

// Save State to URL
function saveState() {
  const params = new URLSearchParams({
    page: currentPage,
    itemsPerPage,
    sortBy,
  });
  history.replaceState(null, "", "?" + params.toString());
}

// Load State from URL
function loadState() {
  const params = new URLSearchParams(window.location.search);
  currentPage = +params.get("page") || 1;
  itemsPerPage = +params.get("itemsPerPage") || 10;
  sortBy = params.get("sortBy") || "newest";
  showPerPageSelect.value = itemsPerPage;
  sortBySelect.value = sortBy;
}

// Load Page
function loadPage() {
  const sortedPosts = [...posts].sort((a, b) => {
    return sortBy === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentPosts = sortedPosts.slice(start, end);

  renderCards(currentPosts);
  renderPagination(sortedPosts.length);
  currentRange.textContent = `${start + 1} - ${Math.min(
    end,
    sortedPosts.length
  )}`;
}

// Render Cards (Updated to show one random image and title per card)
function renderCards(posts) {
  cardList.innerHTML = posts
    .map((post) => {
      // Randomly select one image from the imagePool
      const randomImage = getRandomImage(imagePool);
      // Randomly select one title from the titlePool
      const randomTitle = getRandomTitle(titlePool);

      return `
            <div class="card">
              <img src="${randomImage}" loading="lazy" alt="${randomTitle}" />
              <div class="card-content">
                <p class="card-meta">${post.date}</p>
                <h3 class="card-title">${randomTitle}</h3>
              </div>
            </div>
          `;
    })
    .join("");
}

// Helper function to get a random image from the pool
function getRandomImage(pool) {
  const randomIndex = Math.floor(Math.random() * pool.length); // Get a random index
  return pool[randomIndex]; // Return the image at the random index
}

// Helper function to get a random title from the pool
function getRandomTitle(pool) {
  const randomIndex = Math.floor(Math.random() * pool.length); // Get a random index
  return pool[randomIndex]; // Return the title at the random index
}

// Render Pagination
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = Array.from(
    { length: totalPages },
    (_, i) => `
      <button class="${i + 1 === currentPage ? "active" : ""}" data-page="${
      i + 1
    }">${i + 1}</button>
    `
  ).join("");
}

// Run
loadState();
init();
