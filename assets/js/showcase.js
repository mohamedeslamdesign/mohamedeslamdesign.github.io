(function () {
  const config = window.MED_CONFIG || {};
  const state = {
    theme: localStorage.getItem("med-theme") || config.defaultTheme || "light",
    designFilter: "all",
    visibleDesigns: [],
    lightboxIndex: 0
  };

  const categories = [
    {
      key: "bedrooms",
      label: "غرف النوم",
      intro: "ماستر، غرف هادئة، ودريسنج مرتبط بالاستخدام اليومي.",
      cover: 200,
      numbers: [124, 125, 127, 130, 131, 134, 138, 141, 144, 145, 148, 149, 151, 152, 153, 154, 155, 175, 179, 180, 190, 193, 198, 199, 200, 201, 204, 205, 209, 212, 213]
    },
    {
      key: "living",
      label: "ريسبشن ومعيشة",
      intro: "جلسات، حوائط تلفزيون، استقبال، ومسارات حركة واضحة.",
      cover: 202,
      numbers: [126, 129, 132, 133, 136, 139, 140, 143, 147, 158, 160, 168, 169, 171, 177, 182, 184, 185, 186, 187, 188, 191, 192, 194, 196, 207]
    },
    {
      key: "bathrooms",
      label: "الحمامات",
      intro: "خامات رطبة، إضاءات نِتش، ومناطق غسيل بتفاصيل دقيقة.",
      cover: 208,
      numbers: [128, 135, 137, 156, 161, 162, 164, 165, 166, 170, 173, 174, 176, 178, 181, 183, 189, 197, 206, 208, 211]
    },
    {
      key: "kitchens",
      label: "المطابخ",
      intro: "مطابخ، كاونترات، وحدات تخزين، وخامات عملية.",
      cover: 210,
      numbers: [142, 146, 150, 157, 159, 163, 167, 172, 195, 210]
    },
    {
      key: "dressing",
      label: "دريسنج وتخزين",
      intro: "حلول تخزين مدمجة مع إضاءة وخامات هادئة.",
      cover: 204,
      numbers: [124, 131, 144, 179, 190, 193, 204]
    },
    {
      key: "dining",
      label: "سفرة وأوبن سبيس",
      intro: "محاور طعام ومساحات مفتوحة مرتبطة بالمعيشة.",
      cover: 203,
      numbers: [196, 202, 203]
    }
  ];

  const designItems = buildDesignItems();
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    applyTheme();
    bindHeader();
    bindThemeToggle();
    bindLightbox();
    renderDesignCollections();
    renderDesignFilters();
    renderDesignAlbumBar();
    renderDesignGallery();
    renderWhatsAppLinks();
    renderPhoneLinks();
    refreshIcons();
  }

  function imagePath(number) {
    return `./assets/images/MohamedEslamDesigns/IMG-20260617-WA${String(number).padStart(4, "0")}.jpg`;
  }

  function buildDesignItems() {
    const map = new Map();
    categories.forEach((category) => {
      category.numbers.forEach((number) => {
        if (!map.has(number)) {
          map.set(number, {
            number,
            image: imagePath(number),
            title: `${category.label} | تصميم ${String(number).padStart(4, "0")}`,
            category: category.key,
            categoryLabel: category.label,
            categories: [category.key]
          });
          return;
        }
        const item = map.get(number);
        if (!item.categories.includes(category.key)) item.categories.push(category.key);
      });
    });
    return Array.from(map.values()).sort((a, b) => a.number - b.number);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function icon(name) {
    return `<i data-lucide="${escapeHtml(name)}" aria-hidden="true"></i>`;
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", state.theme === "dark" ? "#0B0B0B" : "#F3EEE4");
    const button = $("[data-theme-toggle]");
    if (button) {
      const nextIcon = state.theme === "dark" ? "sun" : "moon";
      button.innerHTML = icon(nextIcon);
    }
  }

  function bindHeader() {
    const header = $("[data-header]");
    const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const menuToggle = $("[data-menu-toggle]");
    menuToggle?.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = icon(isOpen ? "x" : "menu");
      refreshIcons();
    });

    $$("[data-nav] a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        menuToggle?.setAttribute("aria-expanded", "false");
        if (menuToggle) menuToggle.innerHTML = icon("menu");
        refreshIcons();
      });
    });
  }

  function bindThemeToggle() {
    $("[data-theme-toggle]")?.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("med-theme", state.theme);
      applyTheme();
      refreshIcons();
    });
  }

  function renderDesignCollections() {
    const holder = $("#designCollections");
    if (!holder) return;
    const albumCards = [
      {
        key: "all",
        label: "كل التصميمات",
        intro: "مكتبة الرندرات الكاملة في ألبوم واحد.",
        cover: 202,
        count: designItems.length
      },
      ...categories.map((category) => ({ ...category, count: category.numbers.length }))
    ];
    holder.innerHTML = albumCards.map((category) => `
      <button class="collection-card ${category.key === "all" ? "is-all" : ""} ${state.designFilter === category.key ? "is-active" : ""}" type="button" data-design-category="${escapeHtml(category.key)}">
        <img src="${escapeHtml(imagePath(category.cover))}" alt="${escapeHtml(category.label)}" loading="lazy" decoding="async">
        <span>
          <small>${category.count} تصميم</small>
          <strong>${escapeHtml(category.label)}</strong>
          <em>${escapeHtml(category.intro)}</em>
          <b>${icon("images")} فتح الألبوم</b>
        </span>
      </button>
    `).join("");

    $$("[data-design-category]", holder).forEach((button) => {
      button.addEventListener("click", () => {
        setDesignFilter(button.dataset.designCategory || "all", true);
      });
    });
  }

  function renderDesignFilters() {
    const holder = $("#designFilters");
    if (!holder) return;
    const filters = [{ key: "all", label: "كل التصميمات" }, ...categories.map(({ key, label }) => ({ key, label }))];
    holder.innerHTML = filters.map((filter) => `
      <button class="filter-button ${state.designFilter === filter.key ? "is-active" : ""}" type="button" data-design-filter="${escapeHtml(filter.key)}">
        ${escapeHtml(filter.label)}
      </button>
    `).join("");
    $$("[data-design-filter]", holder).forEach((button) => {
      button.addEventListener("click", () => {
        setDesignFilter(button.dataset.designFilter || "all");
      });
    });
  }

  function renderDesignAlbumBar() {
    const holder = $("#designAlbumBar");
    if (!holder) return;
    const activeCategory = getActiveCategory();
    const label = activeCategory?.label || "كل التصميمات";
    const intro = activeCategory?.intro || "استعرض كل الأعمال أو اختر تصنيفا لفتح ألبوم أكثر تركيزا.";
    const count = getVisibleDesigns().length;
    holder.innerHTML = `
      <div>
        <small>${count} تصميم</small>
        <strong>${escapeHtml(label)}</strong>
        <p>${escapeHtml(intro)}</p>
      </div>
      <button class="secondary-button" type="button" data-open-design-album>
        ${icon("images")}
        <span>فتح الألبوم</span>
      </button>
    `;
    $("[data-open-design-album]", holder)?.addEventListener("click", () => openLightbox(0));
    refreshIcons();
  }

  function renderDesignGallery() {
    state.visibleDesigns = getVisibleDesigns();
    renderDesignAlbumBar();
    const holder = $("#designGallery");
    if (!holder) return;
    holder.innerHTML = state.visibleDesigns.map((item, index) => `
      <button class="design-card" type="button" data-design-index="${index}" aria-label="${escapeHtml(item.title)}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
        <span>
          <small>${escapeHtml(item.categoryLabel)}</small>
          <strong>${escapeHtml(item.title.replace(" | ", " "))}</strong>
        </span>
      </button>
    `).join("");

    $$("[data-design-index]", holder).forEach((button) => {
      button.addEventListener("click", () => openLightbox(Number(button.dataset.designIndex) || 0));
    });
  }

  function getVisibleDesigns() {
    if (state.designFilter === "all") return designItems;
    return designItems.filter((item) => item.categories.includes(state.designFilter));
  }

  function getActiveCategory() {
    return categories.find((category) => category.key === state.designFilter);
  }

  function setDesignFilter(filter, shouldOpenAlbum = false) {
    state.designFilter = filter;
    renderDesignCollections();
    renderDesignFilters();
    renderDesignGallery();
    if (shouldOpenAlbum) openLightbox(0);
  }

  function bindLightbox() {
    $("[data-showcase-close]")?.addEventListener("click", closeLightbox);
    $("[data-showcase-prev]")?.addEventListener("click", () => moveLightbox(-1));
    $("[data-showcase-next]")?.addEventListener("click", () => moveLightbox(1));
    $("[data-showcase-lightbox]")?.addEventListener("click", (event) => {
      if (event.target.matches("[data-showcase-lightbox]")) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      const box = $("[data-showcase-lightbox]");
      if (!box?.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(1);
      if (event.key === "ArrowRight") moveLightbox(-1);
    });
  }

  function openLightbox(index) {
    if (!state.visibleDesigns.length) return;
    state.lightboxIndex = index;
    updateLightbox();
    const box = $("[data-showcase-lightbox]");
    box?.classList.add("is-open");
    box?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const box = $("[data-showcase-lightbox]");
    box?.classList.remove("is-open");
    box?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function moveLightbox(direction) {
    if (!state.visibleDesigns.length) return;
    state.lightboxIndex = (state.lightboxIndex + direction + state.visibleDesigns.length) % state.visibleDesigns.length;
    updateLightbox();
  }

  function updateLightbox() {
    const item = state.visibleDesigns[state.lightboxIndex];
    if (!item) return;
    const image = $("[data-showcase-image]");
    const album = $("[data-showcase-album]");
    const caption = $("[data-showcase-caption]");
    const count = $("[data-showcase-count]");
    const thumbs = $("[data-showcase-thumbs]");
    if (image) {
      image.src = item.image;
      image.alt = item.title;
    }
    const activeCategory = getActiveCategory();
    if (album) album.textContent = state.designFilter === "all" ? "كل التصميمات" : activeCategory?.label || item.categoryLabel || "كل التصميمات";
    if (caption) caption.textContent = item.title;
    if (count) count.textContent = `الصورة ${state.lightboxIndex + 1} من ${state.visibleDesigns.length}`;
    if (thumbs) {
      thumbs.innerHTML = state.visibleDesigns.map((thumb, index) => `
        <button class="${index === state.lightboxIndex ? "is-active" : ""}" type="button" data-lightbox-thumb="${index}" aria-label="${escapeHtml(thumb.title)}">
          <img src="${escapeHtml(thumb.image)}" alt="" loading="eager" decoding="async">
        </button>
      `).join("");
      $$("[data-lightbox-thumb]", thumbs).forEach((button) => {
        button.addEventListener("click", () => {
          state.lightboxIndex = Number(button.dataset.lightboxThumb) || 0;
          updateLightbox();
        });
      });
      thumbs.querySelector(".is-active")?.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }

  function renderWhatsAppLinks() {
    const message = document.body.classList.contains("giant-page")
      ? "مرحبًا، أريد الاستفسار عن تطبيق Giant Finishing."
      : "مرحبًا، أريد الاستفسار عن التصميمات وخدمات Mohamed Eslam Design.";
    $$("[data-whatsapp-link]").forEach((link) => {
      link.href = `https://wa.me/${getWhatsAppNumber(config.contact?.whatsapp)}?text=${encodeURIComponent(message)}`;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  function renderPhoneLinks() {
    const phone = String(config.contact?.phone || "").replace(/[^\d+]/g, "");
    $$("[data-phone-link]").forEach((link) => {
      if (phone) link.href = `tel:${phone}`;
    });
  }

  function getWhatsAppNumber(value) {
    return String(value || "").replace(/\D/g, "");
  }
})();
