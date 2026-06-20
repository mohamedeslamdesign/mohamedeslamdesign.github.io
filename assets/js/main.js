(function () {
  const config = window.MED_CONFIG || {};
  const settingsVersion = config.settingsVersion || "default";

  if (localStorage.getItem("med-settings-version") !== settingsVersion) {
    localStorage.removeItem("med-language");
    localStorage.removeItem("med-theme");
    localStorage.setItem("med-settings-version", settingsVersion);
  }

  const state = {
    lang: localStorage.getItem("med-language") || config.defaultLanguage || "en",
    theme: localStorage.getItem("med-theme") || config.defaultTheme || "light",
    heroIndex: 0,
    portfolioFilter: "featured",
    visiblePortfolio: [],
    lightboxIndex: 0,
    selectedDate: "",
    selectedSlot: "",
    calendarMonth: startOfMonth(new Date()),
    countersStarted: false,
    storyAutoTimers: new Map(),
    storyAutoObserver: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    applyLanguage();
    applyTheme();
    bindHeader();
    bindToggles();
    renderAll();
    bindBookingForm();
    bindLightbox();
    setupLoader();
    setupReveal();
    setupCounters();
    setupQuickActionsVisibility();
    startHero();
    refreshIcons();
  }

  function renderAll() {
    renderStaticText();
    renderHero();
    renderAbout();
    renderServices();
    renderStats();
    renderPortfolioStories();
    renderProcess();
    renderWhy();
    renderTestimonials();
    renderPayment();
    renderContact();
    renderSocialLinks();
    renderFaq();
    renderFormOptions();
    renderCalendar();
    renderSlots();
    renderWhatsAppLinks();
    renderPhoneLinks();
    refreshIcons();
    setupReveal();
  }

  function t(path) {
    const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), config.content?.[state.lang]);
    return value === undefined ? "" : value;
  }

  function localize(value) {
    if (!value || typeof value !== "object") return value || "";
    return value[state.lang] || value.en || "";
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
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function applyLanguage() {
    const isArabic = state.lang === "ar";
    document.documentElement.lang = state.lang;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.body.classList.toggle("is-rtl", isArabic);
    const toggle = $("[data-language-toggle]");
    if (toggle) toggle.textContent = isArabic ? "EN" : "AR";
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", state.theme === "dark" ? "#0B0B0B" : "#F3EEE4");
    const button = $("[data-theme-toggle]");
    if (button) {
      const iconName = state.theme === "dark" ? "sun" : "moon";
      button.innerHTML = icon(iconName);
      button.setAttribute("aria-label", state.theme === "dark" ? "Toggle light mode" : "Toggle dark mode");
    }
  }

  function renderStaticText() {
    $$("[data-i18n]").forEach((element) => {
      const value = t(element.dataset.i18n);
      if (value) element.textContent = value;
    });
    const fee = $("[data-fee]");
    if (fee) fee.textContent = config.payment?.inspectionFee || "";
  }

  function renderHero() {
    const slides = $("#heroSlides");
    if (slides && !slides.children.length) {
      slides.innerHTML = (config.heroImages || [])
        .map((image, index) => `
          <div class="hero-slide ${index === 0 ? "is-active" : ""}">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(localize(image.alt))}" style="object-position: ${escapeHtml(image.position || "center center")}">
          </div>
        `)
        .join("");
    } else {
      $$(".hero-slide img", slides).forEach((img, index) => {
        const image = config.heroImages?.[index];
        if (image) img.alt = localize(image.alt);
      });
    }

    const rail = $("#heroRail");
    if (rail) {
      rail.innerHTML = (t("hero.rail") || [])
        .map((item) => `<span>${escapeHtml(item)}</span>`)
        .join("");
    }
  }

  function startHero() {
    const slides = $$(".hero-slide");
    if (slides.length < 2) return;
    const progress = $(".hero-progress span");
    window.setInterval(() => {
      slides[state.heroIndex].classList.remove("is-active");
      state.heroIndex = (state.heroIndex + 1) % slides.length;
      slides[state.heroIndex].classList.add("is-active");
      if (progress) {
        progress.style.animation = "none";
        progress.offsetHeight;
        progress.style.animation = "";
      }
    }, 6200);
  }

  function renderAbout() {
    const points = $("#aboutPoints");
    if (!points) return;
    points.innerHTML = (t("about.points") || [])
      .map((point) => `<span>${icon("check-circle-2")} ${escapeHtml(point)}</span>`)
      .join("");
  }

  function renderServices() {
    const grid = $("#servicesGrid");
    if (!grid) return;
    grid.innerHTML = (config.services || [])
      .map((service) => `
        <article class="service-card">
          <div>${icon(service.icon || "square")}<h3>${escapeHtml(localize(service.title))}</h3></div>
          <p>${escapeHtml(localize(service.text))}</p>
        </article>
      `)
      .join("");
  }

  function renderStats() {
    const grid = $("#statsGrid");
    if (!grid) return;
    grid.innerHTML = (config.stats || [])
      .map((stat) => {
        const valueMarkup = stat.displayValue
          ? escapeHtml(stat.displayValue)
          : `<span data-counter="${Number(stat.value) || 0}">0</span>${escapeHtml(stat.suffix || "")}`;
        return `
          <article class="stat-card">
            <strong dir="ltr">${valueMarkup}</strong>
            <span>${escapeHtml(localize(stat.label))}</span>
          </article>
        `;
      })
      .join("");
  }

  function renderPortfolioStories() {
    const holder = $("#portfolioStories");
    if (!holder) return;
    const stories = config.portfolioStories || [];
    holder.innerHTML = stories
      .map((story, storyIndex) => {
        const items = getStoryItems(story);
        const cover = items[0] || {};
        const thumbs = items.slice(0, 4);
        return `
          <article class="portfolio-story ${storyIndex === 0 ? "is-featured" : ""}">
            <div class="story-cover" data-story-cover="${storyIndex}">
              <img class="story-cover-bg" src="${escapeHtml(cover.image || "")}" alt="" loading="${storyIndex === 0 ? "eager" : "lazy"}" decoding="async" aria-hidden="true">
              <img class="story-cover-main" src="${escapeHtml(cover.image || "")}" alt="${escapeHtml(localize(cover.title || story.title))}" loading="${storyIndex === 0 ? "eager" : "lazy"}" decoding="async">
              <span>${String(storyIndex + 1).padStart(2, "0")}</span>
              <div class="story-cover-thumbs" aria-label="Story images">
                ${thumbs.map((item, thumbIndex) => `
                  <button class="${thumbIndex === 0 ? "is-active" : ""}" type="button" data-story-thumb="${storyIndex}" data-story-image="${thumbIndex}" aria-pressed="${thumbIndex === 0 ? "true" : "false"}" aria-label="${escapeHtml(localize(item.title))}">
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(localize(item.title))}" loading="${storyIndex === 0 ? "eager" : "lazy"}" decoding="async">
                  </button>
                `).join("")}
              </div>
            </div>
            <div class="story-body">
              <small>${escapeHtml(localize(story.label))}</small>
              <h3>${escapeHtml(localize(story.title))}</h3>
              <p>${escapeHtml(localize(story.summary))}</p>
              <div class="story-proof">
                ${(localizeList(story.proof) || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
              </div>
              <div class="story-thumbs">
                ${thumbs.map((item, thumbIndex) => `
                  <button class="${thumbIndex === 0 ? "is-active" : ""}" type="button" data-story-thumb="${storyIndex}" data-story-image="${thumbIndex}" aria-pressed="${thumbIndex === 0 ? "true" : "false"}" aria-label="${escapeHtml(localize(item.title))}">
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(localize(item.title))}" loading="${storyIndex === 0 ? "eager" : "lazy"}" decoding="async">
                  </button>
                `).join("")}
              </div>
              <button class="story-open" type="button" data-story-open="${storyIndex}">
                ${icon("plus")}
                <span>${state.lang === "ar" ? "افتح القصة" : "Open story"}</span>
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    $$("[data-story-thumb]", holder).forEach((button) => {
      button.addEventListener("click", () => {
        const storyIndex = Number(button.dataset.storyThumb) || 0;
        const story = stories[storyIndex] || stories[0];
        const storyCard = button.closest(".portfolio-story");
        const items = getStoryItems(story);
        const selectedIndex = Number(button.dataset.storyImage) || 0;
        const selected = items[selectedIndex] || items[0];
        updateStoryCover(storyCard, selected, story);
        syncStoryThumbs(storyCard, selectedIndex);
        resetStoryAutoCycle(storyCard);
      });
    });

    $$("[data-story-open]", holder).forEach((button) => {
      button.addEventListener("click", () => {
        const storyIndex = Number(button.dataset.storyOpen) || 0;
        const story = stories[storyIndex] || stories[0];
        const activeThumb = button.closest(".portfolio-story")?.querySelector("[data-story-thumb].is-active");
        state.visiblePortfolio = getStoryItems(story);
        openLightbox(Number(activeThumb?.dataset.storyImage) || 0);
      });
    });

    $$(".story-cover-main", holder).forEach(markStoryCoverFit);
    setupStoryAutoCycle();
  }

  function syncStoryThumbs(storyCard, selectedIndex) {
    $$("[data-story-thumb]", storyCard).forEach((thumb) => {
      const isActive = Number(thumb.dataset.storyImage) === selectedIndex;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateStoryCover(storyCard, selected, story) {
    const coverImg = storyCard?.querySelector(".story-cover-main");
    const coverBg = storyCard?.querySelector(".story-cover-bg");
    if (!coverImg || !selected) return;
    const nextSrc = selected.image;
    coverImg.alt = localize(selected.title || story.title);
    if (coverImg.getAttribute("src") === nextSrc) {
      markStoryCoverFit(coverImg);
      return;
    }
    coverImg.closest(".story-cover")?.classList.add("is-loading");
    coverImg.addEventListener("load", () => markStoryCoverFit(coverImg), { once: true });
    if (coverBg) coverBg.src = nextSrc;
    coverImg.src = nextSrc;
  }

  function markStoryCoverFit(img) {
    const cover = img.closest(".story-cover");
    if (!cover) return;
    const apply = () => {
      const isPortrait = img.naturalHeight > img.naturalWidth * 1.08;
      cover.classList.toggle("is-portrait", isPortrait);
      cover.classList.toggle("is-landscape", !isPortrait);
      cover.classList.remove("is-loading");
    };
    if (img.complete && img.naturalWidth) {
      apply();
    } else {
      img.addEventListener("load", apply, { once: true });
    }
  }

  function setupStoryAutoCycle() {
    clearStoryAutoCycle();
    const holder = $("#portfolioStories");
    const shouldCycle = window.matchMedia("(max-width: 820px)").matches;
    if (!holder || !shouldCycle || !("IntersectionObserver" in window)) return;

    state.storyAutoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const storyCard = entry.target;
        if (entry.isIntersecting) {
          startStoryAutoCycle(storyCard);
        } else {
          stopStoryAutoCycle(storyCard);
        }
      });
    }, { threshold: 0.56 });

    $$(".portfolio-story", holder).forEach((storyCard) => state.storyAutoObserver.observe(storyCard));
  }

  function clearStoryAutoCycle() {
    state.storyAutoObserver?.disconnect();
    state.storyAutoObserver = null;
    state.storyAutoTimers.forEach((timer) => window.clearInterval(timer));
    state.storyAutoTimers.clear();
  }

  function startStoryAutoCycle(storyCard) {
    if (!storyCard || state.storyAutoTimers.has(storyCard)) return;
    const timer = window.setInterval(() => advanceStoryCover(storyCard), 4200);
    state.storyAutoTimers.set(storyCard, timer);
  }

  function stopStoryAutoCycle(storyCard) {
    const timer = state.storyAutoTimers.get(storyCard);
    if (!timer) return;
    window.clearInterval(timer);
    state.storyAutoTimers.delete(storyCard);
  }

  function resetStoryAutoCycle(storyCard) {
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    stopStoryAutoCycle(storyCard);
    startStoryAutoCycle(storyCard);
  }

  function advanceStoryCover(storyCard) {
    const storyIndex = Number(storyCard?.querySelector("[data-story-cover]")?.dataset.storyCover) || 0;
    const story = (config.portfolioStories || [])[storyIndex];
    const items = getStoryItems(story).slice(0, 4);
    if (!storyCard || !items.length) return;
    const activeThumb = storyCard.querySelector("[data-story-thumb].is-active");
    const currentIndex = Number(activeThumb?.dataset.storyImage) || 0;
    const nextIndex = (currentIndex + 1) % items.length;
    updateStoryCover(storyCard, items[nextIndex], story);
    syncStoryThumbs(storyCard, nextIndex);
  }

  function localizeList(value) {
    if (!value || typeof value !== "object") return [];
    return value[state.lang] || value.en || [];
  }

  function getStoryItems(story) {
    return (story?.images || []).map((image) => {
      const existing = (config.portfolio || []).find((item) => item.image === image);
      return existing || {
        category: story.key || "story",
        image,
        title: story.title,
        meta: story.label
      };
    });
  }

  function renderPortfolioFilters() {
    const row = $("#portfolioFilters");
    if (!row) return;
    row.innerHTML = (config.portfolioCategories || [])
      .map((category) => `
        <button class="filter-button ${state.portfolioFilter === category.key ? "is-active" : ""}" type="button" data-filter="${escapeHtml(category.key)}">
          ${escapeHtml(localize(category.label))}
        </button>
      `)
      .join("");

    $$("[data-filter]", row).forEach((button) => {
      button.addEventListener("click", () => {
        state.portfolioFilter = button.dataset.filter || "all";
        renderPortfolioCategoryOverview();
        renderPortfolioFilters();
        renderPortfolio();
        refreshIcons();
      });
    });
  }

  function renderPortfolioCategoryOverview() {
    const overview = $("#categoryOverview");
    if (!overview) return;
    const categories = (config.portfolioCategories || []).filter((category) => category.key !== "all");
    overview.innerHTML = categories
      .map((category) => {
        const items = getPortfolioItemsForFilter(category.key);
        const cover = items[0] || (config.portfolio || [])[0] || {};
        return `
          <button class="category-card ${state.portfolioFilter === category.key ? "is-active" : ""}" type="button" data-category-card="${escapeHtml(category.key)}">
            <img src="${escapeHtml(cover.image || "")}" alt="${escapeHtml(localize(category.label))}" loading="lazy" decoding="async">
            <span>
              <strong>${escapeHtml(localize(category.label))}</strong>
              <small>${items.length} ${state.lang === "ar" ? "صور" : "photos"}</small>
            </span>
          </button>
        `;
      })
      .join("");

    $$("[data-category-card]", overview).forEach((button) => {
      button.addEventListener("click", () => {
        state.portfolioFilter = button.dataset.categoryCard || "featured";
        renderPortfolioCategoryOverview();
        renderPortfolioFilters();
        renderPortfolio();
      });
    });
  }

  function getPortfolioItemsForFilter(filter) {
    const items = config.portfolio || [];
    if (filter === "all") return items;
    if (filter === "featured") {
      const featured = items.filter((item) => item.featured);
      return featured.length ? featured : items.slice(0, 10);
    }
    return items.filter((item) => item.category === filter);
  }

  function renderPortfolio() {
    const grid = $("#portfolioGrid");
    if (!grid) return;
    state.visiblePortfolio = getPortfolioItemsForFilter(state.portfolioFilter);

    grid.innerHTML = state.visiblePortfolio
      .map((item, index) => `
        <button class="portfolio-card" type="button" data-portfolio-index="${index}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(localize(item.title))}" loading="lazy" decoding="async">
          <span class="portfolio-caption">
            <strong>${escapeHtml(localize(item.title))}</strong>
            <small>${escapeHtml(localize(item.meta))}</small>
          </span>
        </button>
      `)
      .join("");

    $$("[data-portfolio-index]", grid).forEach((button) => {
      button.addEventListener("click", () => openLightbox(Number(button.dataset.portfolioIndex)));
    });
  }

  function renderProcess() {
    const line = $("#processLine");
    if (!line) return;
    line.innerHTML = (t("process.steps") || [])
      .map((step, index) => `
        <article class="process-step">
          <b>${index + 1}</b>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.text)}</p>
        </article>
      `)
      .join("");
  }

  function renderWhy() {
    const grid = $("#whyGrid");
    if (!grid) return;
    grid.innerHTML = (t("why.items") || [])
      .map((item) => `
        <article class="why-card">
          ${icon("badge-check")}
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `)
      .join("");
  }

  function renderTestimonials() {
    const grid = $("#testimonialsGrid");
    if (!grid) return;
    grid.innerHTML = (t("testimonials.items") || [])
      .map((item) => `
        <article class="testimonial-card">
          <blockquote>${escapeHtml(item.quote)}</blockquote>
          <cite>${escapeHtml(item.author)}</cite>
        </article>
      `)
      .join("");
  }

  function renderPayment() {
    const details = $("#paymentDetails");
    if (!details) return;
    const rows = [
      [t("payment.vodafoneCash"), config.payment?.vodafoneCash],
      [t("payment.instapay"), config.payment?.instapay],
      [t("payment.bankTransfer"), config.payment?.bankTransfer]
    ];
    details.innerHTML = rows
      .map(([label, value]) => `
        <div class="payment-row">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || "")}</strong>
        </div>
      `)
      .join("");
  }

  function renderContact() {
    const list = $("#contactList");
    if (!list) return;
    const rows = [
      ["phone", t("contact.phone"), config.contact?.phone],
      ["message-circle", t("contact.whatsapp"), config.contact?.whatsapp],
      ["mail", t("contact.email"), config.contact?.email],
      ["map-pin", t("contact.location"), config.contact?.address || config.company?.city]
    ].filter(([, , value]) => Boolean(value));
    list.innerHTML = rows
      .map(([iconName, label, value]) => `
        <a class="contact-row" href="${escapeHtml(getContactHref(iconName, value))}" ${["map-pin", "message-circle"].includes(iconName) ? 'target="_blank" rel="noopener"' : ""}>
          ${icon(iconName)}
          <span>
            <small>${escapeHtml(label)}</small>
            <strong>${escapeHtml(iconName === "message-circle" ? formatWhatsAppDisplay(value) : value || "")}</strong>
          </span>
        </a>
      `)
      .join("");
  }

  function getContactHref(iconName, value) {
    const raw = String(value || "");
    if (iconName === "phone") return `tel:${raw.replace(/[^\d+]/g, "")}`;
    if (iconName === "message-circle") return `https://wa.me/${getWhatsAppNumber(raw)}`;
    if (iconName === "mail") return `mailto:${raw}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
  }

  function renderSocialLinks() {
    const social = config.contact?.social || {};
    const items = [
      ["facebook", "Facebook", "FB", social.facebook],
      ["instagram", "Instagram", "IG", social.instagram],
      ["tiktok", "TikTok", "TK", social.tiktok]
    ].map(([key, label, shortLabel, value]) => getSocialProfile(key, label, shortLabel, value))
      .filter((item) => Boolean(item.url));

    const markup = items
      .map((item) => `
        <a class="social-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(item.label)}">
          <span>${escapeHtml(item.shortLabel)}</span>
          <strong>${escapeHtml(item.label)}</strong>
          ${item.metric ? `<em>${escapeHtml(item.metric)}</em>` : ""}
        </a>
      `)
      .join("");

    ["#socialLinks", "#footerSocialLinks"].forEach((selector) => {
      const holder = $(selector);
      if (holder) holder.innerHTML = markup;
    });
  }

  function getSocialProfile(key, fallbackLabel, shortLabel, value) {
    if (!value) return { key, label: fallbackLabel, shortLabel, url: "", metric: "" };
    if (typeof value === "string") {
      return { key, label: fallbackLabel, shortLabel, url: value, metric: "" };
    }
    return {
      key,
      label: value.label ? localize(value.label) : fallbackLabel,
      shortLabel,
      url: value.url || "",
      metric: localize(value.metric) || value.handle || ""
    };
  }

  function renderFaq() {
    const list = $("#faqList");
    if (!list) return;
    list.innerHTML = (t("faq.items") || [])
      .map((item, index) => `
        <details class="faq-item" ${index === 0 ? "open" : ""}>
          <summary>${escapeHtml(item.q)}</summary>
          <p>${escapeHtml(item.a)}</p>
        </details>
      `)
      .join("");
  }

  function renderFormOptions() {
    const form = $("#bookingForm");
    if (!form) return;
    populateSelect(form.elements.unitType, t("form.unitOptions"));
    populateSelect(form.elements.requestType, t("form.requestOptions"));
  }

  function populateSelect(select, options) {
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="">${escapeHtml(select.closest("label")?.querySelector("span")?.textContent || "")}</option>`;
    (options || []).forEach((option) => {
      const element = document.createElement("option");
      element.value = option;
      element.textContent = option;
      select.appendChild(element);
    });
    if ([...select.options].some((option) => option.value === current)) {
      select.value = current;
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

  function bindToggles() {
    $("[data-theme-toggle]")?.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("med-theme", state.theme);
      applyTheme();
      refreshIcons();
    });

    $("[data-language-toggle]")?.addEventListener("click", () => {
      state.lang = state.lang === "ar" ? "en" : "ar";
      localStorage.setItem("med-language", state.lang);
      applyLanguage();
      renderAll();
    });
  }

  function renderCalendar() {
    const title = $("[data-calendar-title]");
    const weekdays = $("[data-weekdays]");
    const grid = $("[data-calendar-grid]");
    if (!title || !weekdays || !grid) return;

    const month = state.calendarMonth.getMonth();
    const year = state.calendarMonth.getFullYear();
    title.textContent = `${t("calendar.months")[month]} ${year}`;
    weekdays.innerHTML = (t("calendar.weekdays") || [])
      .map((day) => `<span>${escapeHtml(day)}</span>`)
      .join("");

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyCells = firstDay.getDay();
    const cells = [];

    for (let index = 0; index < emptyCells; index += 1) {
      cells.push('<span class="calendar-day is-empty"></span>');
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const iso = toISO(date);
      const available = isDateAvailable(date);
      const today = iso === toISO(new Date());
      const selected = iso === state.selectedDate;
      const label = `${day}`;
      cells.push(`
        <button
          class="calendar-day ${available ? "" : "is-disabled"} ${today ? "is-today" : ""} ${selected ? "is-selected" : ""}"
          type="button"
          data-date="${iso}"
          ${available ? "" : "disabled"}
          aria-label="${escapeHtml(label)}"
        >${day}</button>
      `);
    }

    grid.innerHTML = cells.join("");
    $$("[data-date]", grid).forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedDate = button.dataset.date || "";
        state.selectedSlot = "";
        const form = $("#bookingForm");
        if (form) {
          form.elements.date.value = state.selectedDate;
          form.elements.slot.value = "";
        }
        renderCalendar();
        renderSlots();
      });
    });

    $("[data-prev-month]")?.toggleAttribute("disabled", isSameMonth(state.calendarMonth, startOfMonth(new Date())));
  }

  function renderSlots() {
    const grid = $("[data-slot-grid]");
    const form = $("#bookingForm");
    if (!grid) return;

    if (!state.selectedDate) {
      grid.innerHTML = `<p>${escapeHtml(t("booking.noSlots"))}</p>`;
      return;
    }

    const slots = getSlotsForDate(state.selectedDate);
    if (!slots.length) {
      grid.innerHTML = `<p>${escapeHtml(t("booking.noSlots"))}</p>`;
      return;
    }

    grid.innerHTML = slots
      .map((slot) => `
        <button class="slot-button ${slot === state.selectedSlot ? "is-active" : ""}" type="button" data-slot="${escapeHtml(slot)}">
          ${escapeHtml(slot)}
        </button>
      `)
      .join("");

    $$("[data-slot]", grid).forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedSlot = button.dataset.slot || "";
        if (form) form.elements.slot.value = state.selectedSlot;
        renderSlots();
      });
    });
  }

  function bindBookingForm() {
    const form = $("#bookingForm");
    if (!form) return;

    $("[data-prev-month]")?.addEventListener("click", () => {
      const previous = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() - 1, 1);
      if (previous >= startOfMonth(new Date())) {
        state.calendarMonth = previous;
        renderCalendar();
      }
    });

    $("[data-next-month]")?.addEventListener("click", () => {
      state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + 1, 1);
      renderCalendar();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = $("[data-form-status]");
      const submit = $(".submit-button", form);
      if (!form.checkValidity() || !form.elements.date.value || !form.elements.slot.value) {
        form.reportValidity();
        status.textContent = t("form.required");
        status.classList.remove("is-success");
        return;
      }

      const url = buildWhatsAppUrl(new FormData(form));
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.innerHTML = `${icon("loader-circle")}<span>${escapeHtml(t("form.preparing"))}</span>`;
      status.textContent = t("form.success");
      status.classList.add("is-success");
      refreshIcons();
      window.open(url, "_blank", "noopener");
      window.setTimeout(() => {
        submit.disabled = false;
        submit.innerHTML = original;
        refreshIcons();
      }, 900);
    });
  }

  function buildWhatsAppUrl(formData) {
    const fields = t("form.messageFields");
    const lines = [
      `*${t("form.messageTitle")}*`,
      "",
      `${fields.fullName}: ${formData.get("fullName")}`,
      `${fields.phone}: ${formData.get("phone")}`,
      `${fields.whatsapp}: ${formData.get("whatsapp") || formData.get("phone")}`,
      `${fields.city}: ${formData.get("city")}`,
      `${fields.address}: ${formData.get("address")}`,
      `${fields.unitType}: ${formData.get("unitType")}`,
      `${fields.requestType}: ${formData.get("requestType")}`,
      `${fields.area}: ${formData.get("area") || "-"}`,
      `${fields.notes}: ${formData.get("notes") || "-"}`,
      `${fields.date}: ${formData.get("date")}`,
      `${fields.slot}: ${formData.get("slot")}`,
      `${fields.status}: ${t("form.pendingConfirmation")}`
    ];
    return `https://wa.me/${getWhatsAppNumber(config.contact?.whatsapp)}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  function renderWhatsAppLinks() {
    const message = state.lang === "ar"
      ? "مرحبًا، أريد الاستفسار عن خدمات Mohamed Eslam Design."
      : "Hello, I would like to ask about Mohamed Eslam Design services.";
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

  function formatWhatsAppDisplay(value) {
    const digits = getWhatsAppNumber(value);
    if (digits.startsWith("20") && digits.length === 12) {
      return `+20 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
    return value || "";
  }

  function bindLightbox() {
    $("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
    $("[data-lightbox-prev]")?.addEventListener("click", () => moveLightbox(-1));
    $("[data-lightbox-next]")?.addEventListener("click", () => moveLightbox(1));
    $("[data-lightbox]")?.addEventListener("click", (event) => {
      if (event.target.matches("[data-lightbox]")) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      const box = $("[data-lightbox]");
      if (!box?.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(document.documentElement.dir === "rtl" ? 1 : -1);
      if (event.key === "ArrowRight") moveLightbox(document.documentElement.dir === "rtl" ? -1 : 1);
    });
  }

  function setupLoader() {
    window.setTimeout(() => {
      document.body.classList.add("page-ready");
      $("[data-loader]")?.setAttribute("aria-hidden", "true");
    }, 500);
  }

  function setupQuickActionsVisibility() {
    const quickActions = $(".quick-actions");
    const zones = [$("#home"), $(".stats-section"), $("#booking"), $("#contact")].filter(Boolean);
    if (!quickActions || !zones.length || !("IntersectionObserver" in window)) return;
    const visibleZones = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleZones.add(entry.target);
        } else {
          visibleZones.delete(entry.target);
        }
      });
      quickActions.classList.toggle("is-hidden", visibleZones.size > 0);
    }, { threshold: 0.12 });

    zones.forEach((zone) => observer.observe(zone));
  }

  function openLightbox(index) {
    state.lightboxIndex = index;
    updateLightbox();
    const box = $("[data-lightbox]");
    box?.classList.add("is-open");
    box?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const box = $("[data-lightbox]");
    box?.classList.remove("is-open");
    box?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function moveLightbox(direction) {
    if (!state.visiblePortfolio.length) return;
    state.lightboxIndex = (state.lightboxIndex + direction + state.visiblePortfolio.length) % state.visiblePortfolio.length;
    updateLightbox();
  }

  function updateLightbox() {
    const item = state.visiblePortfolio[state.lightboxIndex];
    if (!item) return;
    const image = $("[data-lightbox-image]");
    const caption = $("[data-lightbox-caption]");
    if (image) {
      image.src = item.image;
      image.alt = localize(item.title);
    }
    if (caption) {
      caption.textContent = `${localize(item.title)} | ${localize(item.meta)}`;
    }
  }

  function setupReveal() {
    const items = $$(".section-heading, .section-grid, .faq-column, .service-card, .portfolio-story, .portfolio-card, .process-step, .why-card, .testimonial-card, .booking-form, .calendar-panel, .contact-panel, .faq-item, .stat-card");
    items.forEach((item) => item.classList.add("reveal"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    items.forEach((item) => observer.observe(item));
  }

  function setupCounters() {
    const stats = $(".stats-section");
    if (!stats || !("IntersectionObserver" in window)) {
      animateCounters();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(stats);
  }

  function animateCounters() {
    if (state.countersStarted) return;
    state.countersStarted = true;
    $$("[data-counter]").forEach((element) => {
      const target = Number(element.dataset.counter) || 0;
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased).toLocaleString("en-US");
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function isSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function toISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isDateAvailable(date) {
    const availability = config.availability || {};
    const iso = toISO(date);
    const today = startOfDay(new Date());
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + (availability.calendarWindowDays || 90));
    const weekdayAllowed = (availability.availableWeekdays || []).includes(date.getDay());
    const dateAllowed = !(availability.unavailableDates || []).includes(iso);
    return startOfDay(date) >= today && startOfDay(date) <= maxDate && weekdayAllowed && dateAllowed && getSlotsForDate(iso).length > 0;
  }

  function getSlotsForDate(iso) {
    const availability = config.availability || {};
    const slots = availability.dateSlots?.[iso] || availability.defaultSlots || [];
    const blocked = availability.blockedSlots?.[iso] || [];
    return slots.filter((slot) => !blocked.includes(slot));
  }
})();
