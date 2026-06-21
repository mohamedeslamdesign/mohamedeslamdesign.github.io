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
    designFilter: "all",
    visibleDesigns: [],
    lightboxIndex: 0
  };

  const copy = {
    en: {
      common: {
        primaryNav: "Primary navigation",
        quickContact: "Quick contact",
        bookInspection: "Book inspection",
        whatsapp: "WhatsApp",
        call: "Call",
        switchLanguage: "Switch language",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        toggleDark: "Toggle dark mode",
        toggleLight: "Toggle light mode",
        toggleTheme: "Toggle theme"
      },
      lightbox: {
        close: "Close image",
        prev: "Previous image",
        next: "Next image",
        thumbs: "Album images",
        count: "Image {current} of {total}"
      },
      designs: {
        meta: {
          title: "Design Portfolio | Mohamed Eslam Design",
          description: "Design portfolio and rendered concepts from Mohamed Eslam Design, organized by room type and use case."
        },
        hero: {
          crumb: "Back to main portfolio",
          eyebrow: "Design Portfolio",
          title: "A focused gallery for design concepts and rendered spaces.",
          copy: "Explore residential design directions organized by room type, so each client can find references that match their space and lifestyle.",
          primaryCta: "Ask about your design",
          secondaryCta: "Facebook page"
        },
        collections: {
          kicker: "Organized Collections",
          title: "Every space has its own needs, so the gallery is grouped by use.",
          copy: "Browse bedrooms, living rooms, bathrooms, kitchens, dressing areas, and dining spaces through clear albums built for quick comparison."
        },
        gallery: {
          kicker: "Full Gallery",
          title: "Filter the design library or open a focused album.",
          copy: "Use the filters to compare design styles by room type, then open any image to browse the selected album in a larger view."
        },
        downloads: {
          kicker: "Portfolio Files",
          title: "Curated PDF presentations are available for review.",
          copy: "Download selected design presentations to review the studio profile, visual direction, and additional project references.",
          profileTitle: "Design Experience Profile",
          profileCopy: "Main design portfolio presentation",
          presentationOneTitle: "Selected Design Presentation",
          presentationOneCopy: "Additional residential references",
          presentationTwoTitle: "Compact Design Preview",
          presentationTwoCopy: "Short visual presentation"
        },
        footer: {
          facebook: "Design Facebook"
        },
        allLabel: "All designs",
        allIntro: "The complete rendered design library in one album.",
        count: "{count} designs",
        openAlbum: "Open album",
        imageTitle: "{category} design {number}",
        whatsapp: "Hello, I would like to ask about the design portfolio and Mohamed Eslam Design services."
      },
      giant: {
        meta: {
          title: "Giant Finishing App | Mohamed Eslam Design",
          description: "Giant Finishing connects serious clients with trusted finishing companies and provides instant estimates and management tools for finishing teams."
        },
        hero: {
          crumb: "Back to home",
          eyebrow: "Giant Finishing App",
          title: "One platform connecting serious clients with trusted finishing companies.",
          copy: "Giant Finishing helps clients estimate their unit cost with a detailed instant BOQ, and helps finishing companies manage clients, projects, teams, and financials in one place.",
          screensLabel: "Key Giant Finishing app screens",
          screenOne: "Trusted companies",
          screenTwo: "Dashboard",
          screenThree: "Instant estimate",
          screenOneAlt: "Trusted finishing companies list in Giant Finishing",
          screenTwoAlt: "Main Giant Finishing dashboard",
          screenThreeAlt: "Quick estimate and new project actions in Giant Finishing"
        },
        proof: {
          kicker: "Real Demand",
          title: "A structured opportunity for serious finishing companies.",
          copy: "Giant is a dedicated finishing ecosystem. It connects ready clients with reviewed companies based on portfolio strength, professional history, and the ability to deliver reliable service."
        },
        metrics: {
          daily: "Daily customer visits",
          companies: "Registered finishing companies",
          downloads: "App downloads",
          stores: "Available on official stores"
        },
        customer: {
          kicker: "For Clients",
          title: "Instead of guessing the cost of a 120 sqm apartment, clients can build their own estimate.",
          copy: "The client enters their details, unit area, and preferred finishing specifications, then receives a detailed printable estimate with clear line items and material quantities.",
          cardOneTitle: "Client portal",
          cardOneCopy: "A detailed estimate based on area and selected specifications, ready to print or share with the right company for inspection or contracting.",
          cardOneA: "Client and unit details first.",
          cardOneB: "Selected finishing specifications.",
          cardOneC: "Detailed result with clear items and materials.",
          cardTwoTitle: "Company selection",
          cardTwoCopy: "Clients can browse finishing companies, portfolios, contact data, and social pages, then call or send WhatsApp directly for inspection or contracting.",
          cardTwoA: "Carefully selected company list.",
          cardTwoB: "Direct call or WhatsApp contact.",
          cardTwoC: "A choice built on visible information."
        },
        company: {
          kicker: "For Finishing Companies",
          title: "Manage the engineering business from first lead to financial reporting."
        },
        modules: {
          estimatesTitle: "Estimates and proposals",
          estimatesCopy: "Create an estimate with the client during inspection in minutes, then prepare a printable or shareable proposal.",
          projectsTitle: "Projects and clients",
          projectsCopy: "Organize projects, client records, portfolios, invoices, and design files in one structured workspace.",
          financeTitle: "Financial tracking",
          financeCopy: "Track client payments, expenses, custody items, supervision percentages, and project settlements.",
          teamTitle: "Team and attendance",
          teamCopy: "Manage attendance, leave, salaries, and engineer location checks within the project site range.",
          alertsTitle: "Alerts and dashboards",
          alertsCopy: "Receive budget alerts and view concise financial dashboards for company and project status.",
          importTitle: "Existing account import",
          importCopy: "Move organized Excel data into the app, then extract reports, profit views, and financial positions."
        },
        market: {
          imageAlt: "Giant Finishing as a platform for finishing companies and real clients",
          kicker: "Marketplace Direction",
          title: "Giant is building a dedicated finishing marketplace in Egypt.",
          copy: "Finishing companies, suppliers, and contractors can apply to display their services, with documents, licenses, and portfolio quality reviewed before approval.",
          contact: "Apply through technical support:"
        },
        cta: {
          kicker: "Download The App",
          title: "Start from the store that matches your device.",
          copy: "The official store links open the app pages directly on App Store and Google Play, with Facebook available for updates and joining opportunities."
        },
        whatsapp: "Hello, I would like to ask about the Giant Finishing app."
      }
    },
    ar: {
      common: {
        primaryNav: "التنقل الرئيسي",
        quickContact: "تواصل سريع",
        bookInspection: "حجز معاينة",
        whatsapp: "واتساب",
        call: "اتصال",
        switchLanguage: "تبديل اللغة",
        openMenu: "فتح القائمة",
        closeMenu: "إغلاق القائمة",
        toggleDark: "تفعيل الوضع الداكن",
        toggleLight: "تفعيل الوضع الفاتح",
        toggleTheme: "تبديل الثيم"
      },
      lightbox: {
        close: "إغلاق الصورة",
        prev: "الصورة السابقة",
        next: "الصورة التالية",
        thumbs: "صور الألبوم",
        count: "الصورة {current} من {total}"
      },
      designs: {
        meta: {
          title: "سابقة التصميمات | Mohamed Eslam Design",
          description: "سابقة أعمال التصميمات والرندرات من Mohamed Eslam Design مصنفة حسب نوع المساحة والاستخدام."
        },
        hero: {
          crumb: "العودة للأعمال الرئيسية",
          eyebrow: "سابقة التصميمات",
          title: "معرض متخصص للتصميمات والرندرات الداخلية.",
          copy: "استعرض اتجاهات تصميم سكنية مرتبة حسب نوع الغرفة، ليسهل على كل عميل الوصول إلى مراجع قريبة من مساحته وأسلوب حياته.",
          primaryCta: "اسأل عن تصميم مساحتك",
          secondaryCta: "صفحة فيسبوك"
        },
        collections: {
          kicker: "مجموعات منظمة",
          title: "كل مساحة لها احتياج مختلف، لذلك تم ترتيب المعرض حسب الاستخدام.",
          copy: "تصفح غرف النوم، المعيشة، الحمامات، المطابخ، الدريسنج، ومساحات الطعام من خلال ألبومات واضحة للمقارنة السريعة."
        },
        gallery: {
          kicker: "المعرض الكامل",
          title: "صف التصميمات أو افتح ألبوما مركزا حسب نوع الغرفة.",
          copy: "استخدم التصنيفات لمقارنة اتجاهات التصميم حسب نوع المساحة، ثم افتح أي صورة لتصفح الألبوم بحجم أكبر."
        },
        downloads: {
          kicker: "ملفات البورتفوليو",
          title: "عروض PDF مختارة متاحة للمراجعة.",
          copy: "حمل عروض تصميم مختارة لمراجعة بروفايل الاستوديو، الاتجاه البصري، ومراجع إضافية من الأعمال.",
          profileTitle: "بروفايل خبرة التصميم",
          profileCopy: "العرض الرئيسي لبورتفوليو التصميم",
          presentationOneTitle: "عرض تصميمات مختارة",
          presentationOneCopy: "مراجع سكنية إضافية",
          presentationTwoTitle: "معاينة تصميم مختصرة",
          presentationTwoCopy: "عرض بصري مختصر"
        },
        footer: {
          facebook: "فيسبوك التصميمات"
        },
        allLabel: "كل التصميمات",
        allIntro: "مكتبة الرندرات الكاملة في ألبوم واحد.",
        count: "{count} تصميم",
        openAlbum: "فتح الألبوم",
        imageTitle: "{category} تصميم {number}",
        whatsapp: "مرحبًا، أريد الاستفسار عن التصميمات وخدمات Mohamed Eslam Design."
      },
      giant: {
        meta: {
          title: "تطبيق Giant Finishing | Mohamed Eslam Design",
          description: "Giant Finishing يربط العملاء الجادين بشركات التشطيب الموثوقة، ويوفر مقايسات فورية وأدوات إدارة لشركات التشطيبات."
        },
        hero: {
          crumb: "العودة للرئيسية",
          eyebrow: "تطبيق Giant Finishing",
          title: "منصة واحدة تربط العميل الجاد بشركة التشطيب الموثوقة.",
          copy: "Giant Finishing يساعد العميل على تقدير تكلفة وحدته بمقايسة فورية مفصلة، ويساعد شركات التشطيب على إدارة العملاء والمشاريع والفريق والحسابات من مكان واحد.",
          screensLabel: "أهم واجهات تطبيق Giant Finishing",
          screenOne: "شركات موثوقة",
          screenTwo: "لوحة القيادة",
          screenThree: "مقايسة فورية",
          screenOneAlt: "قائمة شركات التشطيب الموثوقة في تطبيق Giant Finishing",
          screenTwoAlt: "لوحة قيادة Giant Finishing الرئيسية",
          screenThreeAlt: "إجراءات سريعة لإنشاء مقايسة ومشروع جديد في Giant Finishing"
        },
        proof: {
          kicker: "طلب حقيقي",
          title: "فرصة منظمة لشركات التشطيب الجادة.",
          copy: "Giant منظومة مخصصة للتشطيبات، تربط العملاء الجاهزين بشركات تمت مراجعتها بناء على قوة سابقة الأعمال والتاريخ المهني والقدرة على تقديم خدمة موثوقة."
        },
        metrics: {
          daily: "زيارات عملاء يومية",
          companies: "شركة تشطيب مسجلة",
          downloads: "تحميل للتطبيق",
          stores: "متاح على المتاجر الرسمية"
        },
        customer: {
          kicker: "للعميل",
          title: "بدل التخمين في تكلفة شقة 120 متر، العميل يجهز مقايسة بنفسه.",
          copy: "يسجل العميل بياناته، ومساحة وحدته، ومواصفات التشطيب المفضلة، ثم يحصل على مقايسة تفصيلية قابلة للطباعة ببنود وكميات خامات واضحة.",
          cardOneTitle: "بوابة العملاء",
          cardOneCopy: "مقايسة تفصيلية حسب المساحة والمواصفات، جاهزة للطباعة أو المشاركة مع الشركة المناسبة للمعاينة أو التعاقد.",
          cardOneA: "بيانات العميل والوحدة أولا.",
          cardOneB: "اختيار مواصفات التشطيب المطلوبة.",
          cardOneC: "نتيجة مفصلة ببنود وخامات واضحة.",
          cardTwoTitle: "اختيار الشركة",
          cardTwoCopy: "يمكن للعميل تصفح شركات التشطيب وسابقة الأعمال وبيانات التواصل وصفحات السوشيال، ثم التواصل مباشرة بالاتصال أو واتساب.",
          cardTwoA: "قائمة شركات مختارة بعناية.",
          cardTwoB: "تواصل مباشر بالاتصال أو واتساب.",
          cardTwoC: "اختيار مبني على معلومات ظاهرة."
        },
        company: {
          kicker: "لشركات التشطيب",
          title: "إدارة الكيان الهندسي من أول عميل حتى التقرير المالي."
        },
        modules: {
          estimatesTitle: "المقايسات والعروض",
          estimatesCopy: "إنشاء مقايسة مع العميل أثناء المعاينة خلال دقائق، ثم تجهيز عرض قابل للطباعة أو المشاركة.",
          projectsTitle: "المشاريع والعملاء",
          projectsCopy: "تنظيم المشاريع وبيانات العملاء وسابقة الأعمال والفواتير والتصميمات في مساحة عمل واحدة.",
          financeTitle: "المتابعة المالية",
          financeCopy: "تسجيل دفعات العملاء والمصروفات والعهد ونسب الإشراف والتسويات المالية لكل مشروع.",
          teamTitle: "الفريق والحضور",
          teamCopy: "إدارة الحضور والانصراف والإجازات والمرتبات ومراجعة وجود المهندس داخل نطاق موقع المشروع.",
          alertsTitle: "تنبيهات ولوحات قيادة",
          alertsCopy: "تنبيهات عند اقتراب الميزانية من النفاد، ولوحات مالية مختصرة لحالة الشركة والمشاريع.",
          importTitle: "نقل الحسابات القديمة",
          importCopy: "إدخال بيانات Excel المنظمة داخل التطبيق، ثم استخراج تقارير وربحية وموقف مالي."
        },
        market: {
          imageAlt: "Giant Finishing كمنصة لشركات التشطيب والعملاء الجادين",
          kicker: "اتجاه السوق",
          title: "Giant يبني سوقا متخصصا للتشطيبات في مصر.",
          copy: "يمكن لشركات التشطيب والموردين والمقاولين التقديم لعرض خدماتهم، مع مراجعة الأوراق والتراخيص وجودة سابقة الأعمال قبل القبول.",
          contact: "للتقديم من خلال الدعم الفني:"
        },
        cta: {
          kicker: "تحميل التطبيق",
          title: "ابدأ من المتجر المناسب لجهازك.",
          copy: "روابط المتاجر الرسمية تفتح صفحة التطبيق مباشرة على App Store وGoogle Play، مع صفحة فيسبوك للتحديثات وفرص الانضمام."
        },
        whatsapp: "مرحبًا، أريد الاستفسار عن تطبيق Giant Finishing."
      }
    }
  };

  const categories = [
    {
      key: "bedrooms",
      label: { en: "Bedrooms", ar: "غرف النوم" },
      intro: {
        en: "Master bedrooms, calm private rooms, and dressing spaces connected to daily use.",
        ar: "ماستر، غرف هادئة، ودريسنج مرتبط بالاستخدام اليومي."
      },
      cover: 200,
      numbers: [124, 125, 127, 130, 131, 134, 138, 141, 144, 145, 148, 149, 151, 152, 153, 154, 155, 175, 179, 180, 190, 193, 198, 199, 200, 201, 204, 205, 209, 212, 213]
    },
    {
      key: "living",
      label: { en: "Living & Reception", ar: "ريسبشن ومعيشة" },
      intro: {
        en: "Seating areas, TV walls, reception layouts, and clear circulation routes.",
        ar: "جلسات، حوائط تلفزيون، استقبال، ومسارات حركة واضحة."
      },
      cover: 202,
      numbers: [126, 129, 132, 133, 136, 139, 140, 143, 147, 158, 160, 168, 169, 171, 177, 182, 184, 185, 186, 187, 188, 191, 192, 194, 196, 207]
    },
    {
      key: "bathrooms",
      label: { en: "Bathrooms", ar: "الحمامات" },
      intro: {
        en: "Wet-area materials, niche lighting, wash zones, and precise finishing details.",
        ar: "خامات رطبة، إضاءات نتش، ومناطق غسيل بتفاصيل دقيقة."
      },
      cover: 208,
      numbers: [128, 135, 137, 156, 161, 162, 164, 165, 166, 170, 173, 174, 176, 178, 181, 183, 189, 197, 206, 208, 211]
    },
    {
      key: "kitchens",
      label: { en: "Kitchens", ar: "المطابخ" },
      intro: {
        en: "Kitchen cabinetry, counters, storage units, and practical material choices.",
        ar: "مطابخ، كاونترات، وحدات تخزين، وخامات عملية."
      },
      cover: 210,
      numbers: [142, 146, 150, 157, 159, 163, 167, 172, 195, 210]
    },
    {
      key: "dressing",
      label: { en: "Dressing & Storage", ar: "دريسنج وتخزين" },
      intro: {
        en: "Integrated storage solutions with calm lighting and refined materials.",
        ar: "حلول تخزين مدمجة مع إضاءة وخامات هادئة."
      },
      cover: 204,
      numbers: [124, 131, 144, 179, 190, 193, 204]
    },
    {
      key: "dining",
      label: { en: "Dining & Open Spaces", ar: "سفرة وأوبن سبيس" },
      intro: {
        en: "Dining axes and open spaces connected to living areas.",
        ar: "محاور طعام ومساحات مفتوحة مرتبطة بالمعيشة."
      },
      cover: 203,
      numbers: [196, 202, 203]
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let designItems = [];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    designItems = buildDesignItems();
    applyLanguage();
    applyTheme();
    bindHeader();
    bindToggles();
    bindLightbox();
    renderAll();
  }

  function renderAll() {
    renderStaticText();
    renderDesignCollections();
    renderDesignFilters();
    renderDesignGallery();
    renderWhatsAppLinks();
    renderPhoneLinks();
    refreshIcons();
  }

  function pageKey() {
    return document.body.classList.contains("giant-page") ? "giant" : "designs";
  }

  function t(path) {
    const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), config.content?.[state.lang]);
    return value === undefined ? "" : value;
  }

  function sc(path) {
    const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), copy[state.lang]);
    return value === undefined ? "" : value;
  }

  function localize(value) {
    if (!value || typeof value !== "object") return value || "";
    return value[state.lang] || value.en || "";
  }

  function format(template, replacements) {
    return Object.entries(replacements || {}).reduce(
      (text, [key, value]) => text.replaceAll(`{${key}}`, value),
      template || ""
    );
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

  function applyLanguage() {
    const isArabic = state.lang === "ar";
    document.documentElement.lang = state.lang;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.body.classList.toggle("is-rtl", isArabic);
    const toggle = $("[data-language-toggle]");
    if (toggle) {
      toggle.textContent = isArabic ? "EN" : "AR";
      toggle.setAttribute("aria-label", sc("common.switchLanguage"));
    }
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", state.theme === "dark" ? "#0B0B0B" : "#F3EEE4");
    const button = $("[data-theme-toggle]");
    if (button) {
      const nextIcon = state.theme === "dark" ? "sun" : "moon";
      button.innerHTML = icon(nextIcon);
      button.setAttribute("aria-label", state.theme === "dark" ? sc("common.toggleLight") : sc("common.toggleDark"));
      button.setAttribute("title", sc("common.toggleTheme"));
    }
  }

  function renderStaticText() {
    $$("[data-i18n]").forEach((element) => {
      const value = t(element.dataset.i18n);
      if (value) element.textContent = value;
    });

    $$("[data-showcase-i18n]").forEach((element) => {
      const value = sc(element.dataset.showcaseI18n);
      if (value) element.textContent = value;
    });

    $$("[data-showcase-aria]").forEach((element) => {
      const value = sc(element.dataset.showcaseAria);
      if (value) element.setAttribute("aria-label", value);
    });

    $$("[data-showcase-alt]").forEach((element) => {
      const value = sc(element.dataset.showcaseAlt);
      if (value) element.setAttribute("alt", value);
    });

    const key = pageKey();
    const title = sc(`${key}.meta.title`);
    const description = sc(`${key}.meta.description`);
    if (title) document.title = title;
    const metaDescription = $('meta[name="description"]');
    if (metaDescription && description) metaDescription.setAttribute("content", description);

    const menuToggle = $("[data-menu-toggle]");
    if (menuToggle) menuToggle.setAttribute("aria-label", document.body.classList.contains("nav-open") ? sc("common.closeMenu") : sc("common.openMenu"));
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
      menuToggle.setAttribute("aria-label", isOpen ? sc("common.closeMenu") : sc("common.openMenu"));
      menuToggle.innerHTML = icon(isOpen ? "x" : "menu");
      refreshIcons();
    });

    $$("[data-nav] a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", sc("common.openMenu"));
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
      applyTheme();
      renderAll();
    });
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
            category: category.key,
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

  function categoryByKey(key) {
    return categories.find((category) => category.key === key);
  }

  function itemCategory(item) {
    return categoryByKey(item.category) || categories[0];
  }

  function itemTitle(item) {
    const category = itemCategory(item);
    return format(sc("designs.imageTitle"), {
      category: localize(category.label),
      number: String(item.number).padStart(4, "0")
    });
  }

  function renderDesignCollections() {
    const holder = $("#designCollections");
    if (!holder) return;
    const albumCards = [
      {
        key: "all",
        label: sc("designs.allLabel"),
        intro: sc("designs.allIntro"),
        cover: 202,
        count: designItems.length
      },
      ...categories.map((category) => ({
        ...category,
        label: localize(category.label),
        intro: localize(category.intro),
        count: category.numbers.length
      }))
    ];

    holder.innerHTML = albumCards.map((category) => `
      <button class="collection-card ${category.key === "all" ? "is-all" : ""} ${state.designFilter === category.key ? "is-active" : ""}" type="button" data-design-category="${escapeHtml(category.key)}">
        <img src="${escapeHtml(imagePath(category.cover))}" alt="${escapeHtml(category.label)}" loading="lazy" decoding="async">
        <span>
          <small>${escapeHtml(format(sc("designs.count"), { count: category.count }))}</small>
          <strong>${escapeHtml(category.label)}</strong>
          <em>${escapeHtml(category.intro)}</em>
          <b>${icon("images")} ${escapeHtml(sc("designs.openAlbum"))}</b>
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
    const filters = [
      { key: "all", label: sc("designs.allLabel") },
      ...categories.map(({ key, label }) => ({ key, label: localize(label) }))
    ];
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
    const label = activeCategory ? localize(activeCategory.label) : sc("designs.allLabel");
    const intro = activeCategory ? localize(activeCategory.intro) : sc("designs.allIntro");
    const count = getVisibleDesigns().length;
    holder.innerHTML = `
      <div>
        <small>${escapeHtml(format(sc("designs.count"), { count }))}</small>
        <strong>${escapeHtml(label)}</strong>
        <p>${escapeHtml(intro)}</p>
      </div>
      <button class="secondary-button" type="button" data-open-design-album>
        ${icon("images")}
        <span>${escapeHtml(sc("designs.openAlbum"))}</span>
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
    holder.innerHTML = state.visibleDesigns.map((item, index) => {
      const category = itemCategory(item);
      const title = itemTitle(item);
      return `
        <button class="design-card" type="button" data-design-index="${index}" aria-label="${escapeHtml(title)}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async">
          <span>
            <small>${escapeHtml(localize(category.label))}</small>
            <strong>${escapeHtml(title)}</strong>
          </span>
        </button>
      `;
    }).join("");

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
    $("[data-showcase-prev]")?.addEventListener("click", () => moveLightbox(document.documentElement.dir === "rtl" ? 1 : -1));
    $("[data-showcase-next]")?.addEventListener("click", () => moveLightbox(document.documentElement.dir === "rtl" ? -1 : 1));
    $("[data-showcase-lightbox]")?.addEventListener("click", (event) => {
      if (event.target.matches("[data-showcase-lightbox]")) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      const box = $("[data-showcase-lightbox]");
      if (!box?.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(document.documentElement.dir === "rtl" ? 1 : -1);
      if (event.key === "ArrowRight") moveLightbox(document.documentElement.dir === "rtl" ? -1 : 1);
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
    const activeCategory = getActiveCategory();
    const itemCategoryLabel = localize(itemCategory(item).label);
    const title = itemTitle(item);
    if (image) {
      image.src = item.image;
      image.alt = title;
    }
    if (album) album.textContent = state.designFilter === "all" ? sc("designs.allLabel") : localize(activeCategory?.label) || itemCategoryLabel || sc("designs.allLabel");
    if (caption) caption.textContent = title;
    if (count) count.textContent = format(sc("lightbox.count"), { current: state.lightboxIndex + 1, total: state.visibleDesigns.length });
    if (thumbs) {
      thumbs.innerHTML = state.visibleDesigns.map((thumb, index) => {
        const thumbTitle = itemTitle(thumb);
        return `
          <button class="${index === state.lightboxIndex ? "is-active" : ""}" type="button" data-lightbox-thumb="${index}" aria-label="${escapeHtml(thumbTitle)}">
            <img src="${escapeHtml(thumb.image)}" alt="" loading="eager" decoding="async">
          </button>
        `;
      }).join("");
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
    const message = sc(`${pageKey()}.whatsapp`);
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
