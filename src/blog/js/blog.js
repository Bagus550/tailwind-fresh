const cardBlog = document.getElementById("cardBlog");
const sidebarButtons = document.querySelectorAll("[data-filter]");
const categoryItems = document.querySelectorAll("[data-filter]");

let allBlogs = [];

// fetch data
fetch("blog.json")
    .then(res => res.json())
        .then(blog => {
            allBlogs = blog;
            renderBlogs(allBlogs);
    })
    .catch(err => {
        cardBlog.innerHTML = "<p class='text-red-500'>Gagal load artikel.</p>";
        console.error(err);
    });

    // render function
    function renderBlogs(data) {
    cardBlog.innerHTML = "";

    if (data.length === 0) {
        cardBlog.innerHTML = "<p class='text-gray-500'>Artikel tidak ditemukan.</p>";
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

                <span>${item.date}</span>
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

categoryItems.forEach(item => {
  item.addEventListener("click", () => {
        const filter = item.dataset.filter;

        // active state (opsional tapi cakep)
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
