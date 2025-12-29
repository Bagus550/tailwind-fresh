const cardBlog = document.getElementById("cardBlog");
const categoryItems = document.querySelectorAll("[data-filter]");

let allBlogs = [];

/* ===============================
   FUNGSI WAKTU RELATIF
================================ */
function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const minute = 1000 * 60;
  const hour   = minute * 60;
  const day    = hour * 24;
  const week   = day * 7;
  const month  = day * 30;
  const year   = day * 365;

  if (diffMs < minute) return "baru saja";
  if (diffMs < hour)   return `${Math.floor(diffMs / minute)} menit lalu`;
  if (diffMs < day)    return `${Math.floor(diffMs / hour)} jam lalu`;
  if (diffMs < week)   return `${Math.floor(diffMs / day)} hari lalu`;
  if (diffMs < month)  return `${Math.floor(diffMs / week)} minggu lalu`;
  if (diffMs < year)   return `${Math.floor(diffMs / month)} bulan lalu`;

  return `${Math.floor(diffMs / year)} tahun lalu`;
}

/* ===============================
   FETCH DATA BLOG
================================ */
fetch("blog.json")
  .then(res => res.json())
  .then(blog => {
    // simpan data
    allBlogs = blog;

    // SORT TERBARU DI ATAS
    allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderBlogs(allBlogs);
  })
  .catch(err => {
    cardBlog.innerHTML =
      "<p class='text-red-500'>Gagal load artikel.</p>";
    console.error(err);
  });

/* ===============================
   RENDER BLOG
================================ */
function renderBlogs(data) {
  cardBlog.innerHTML = "";

  if (data.length === 0) {
    cardBlog.innerHTML =
      "<p class='text-gray-500'>Artikel tidak ditemukan.</p>";
    return;
  }

  data.forEach(item => {
    const secCategoryBadge = item["sec-category"]
      ? `<span class="px-2 py-1 bg-purple-50 text-purple-600 rounded-full font-medium">
          ${item["sec-category"]}
        </span>`
      : "";

    cardBlog.innerHTML += `
      <article class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group flex flex-col h-full">
        
        <!-- Thumbnail -->
        <div class="overflow-hidden">
          <img 
            src="${item.image}"
            alt="${item.title}"
            class="w-full h-48 object-cover blur-sm group-hover:scale-105 transition duration-500"
            loading="lazy"
            onload="this.classList.remove('blur-sm')"
          >
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col flex-1">
          
          <!-- Meta -->
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
            <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
              ${item.category}
            </span>

            ${secCategoryBadge}

            <span class="text-gray-400">
              ${timeAgo(item.date)}
            </span>
          </div>

          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            ${item.title}
          </h3>

          <p class="text-sm text-gray-600 mb-6 line-clamp-3">
            ${item.desc}
          </p>

          <a 
            href="${item.link}"
            class="mt-auto inline-flex items-center gap-1 text-blue-600 text-sm font-semibold hover:gap-2 transition-all"
          >
            Read more →
          </a>
        </div>
      </article>
    `;
  });
}

/* ===============================
   FILTER KATEGORI
================================ */
categoryItems.forEach(item => {
  item.addEventListener("click", () => {
    const filter = item.dataset.filter;

    // active state
    categoryItems.forEach(i =>
      i.classList.remove("text-blue-600", "font-semibold")
    );
    item.classList.add("text-blue-600", "font-semibold");

    if (filter === "all") {
      renderBlogs(allBlogs);
      return;
    }

    const filteredBlogs = allBlogs.filter(blog =>
      blog.category === filter ||
      blog["sec-category"] === filter
    );

    renderBlogs(filteredBlogs);
  });
});
/* ===============================
   HAMBURGER MENU
================================ */
const btn = document.getElementById("menuBtn");
const menu = document.getElementById("mobileMenu");
const nav  = document.getElementById("navbar");

if (btn && menu) {
  const lines = btn.querySelectorAll("span");

  btn.addEventListener("click", () => {
    // toggle menu
    menu.classList.toggle("max-h-0");
    menu.classList.toggle("max-h-screen");

    // animasi hamburger -> X
    lines[0].classList.toggle("rotate-45");
    lines[0].classList.toggle("translate-y-1.5");

    lines[1].classList.toggle("opacity-0");

    lines[2].classList.toggle("-rotate-45");
    lines[2].classList.toggle("-translate-y-1.5");
  });
}

/* ===============================
   SHADOW NAV SAAT SCROLL
================================ */
window.addEventListener("scroll", () => {
  nav?.classList.toggle("shadow-md", window.scrollY > 10);
});

