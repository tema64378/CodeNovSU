const API_BASE = "http://localhost:4000";
const CURRICULUM_URL = "./data/full-curriculum.json";
const THEME_KEY = "theme";
const PLUS_STORAGE_KEY = "codenovsu_plus";

function hasPlusAccess() {
  return localStorage.getItem(PLUS_STORAGE_KEY) === "1";
}

function setPlusAccess(active) {
  if (active) localStorage.setItem(PLUS_STORAGE_KEY, "1");
  else localStorage.removeItem(PLUS_STORAGE_KEY);
}

/** Уровень 1 — бесплатная база; уровни 2+ — подписка Плюс (на клиенте, демо). */
function lessonLevelRequiresPlus(level) {
  const n = parseInt(String(level), 10);
  return Number.isFinite(n) && n > 1;
}

function markdownTeaser(md, maxChunks = 4) {
  const normalized = String(md || "")
    .replace(/\r\n/g, "\n")
    .trim();
  if (!normalized) return "";
  const chunks = normalized.split(/\n{2,}/);
  const head = chunks.slice(0, maxChunks).join("\n\n").trim();
  return head || normalized.slice(0, 1200);
}

function renderLessonPaywallHtml() {
  return `
<div class="lesson-paywall" role="region" aria-label="Подписка Плюс">
  <h3>Продолжение в CodeNovSU Плюс</h3>
  <p>Теория и практика первого уровня бесплатны. Углублённая программа (уровни 2–4), задания и компилятор — по подписке.</p>
  <p class="meta">Оформите демо-доступ в личном кабинете — без реальной оплаты, чтобы посмотреть сценарий.</p>
  <a class="button primary liquid-morph-element" href="./dashboard.html#plus-panel">Перейти в кабинет</a>
</div>`;
}

function refreshPlusPanel() {
  const status = document.getElementById("plus-status");
  const act = document.getElementById("plus-activate-demo");
  const revoke = document.getElementById("plus-revoke-demo");
  if (status) {
    status.textContent = hasPlusAccess()
      ? "Статус: Плюс активен (демо)."
      : "Статус: доступен только бесплатный уровень 1.";
  }
  if (act) act.hidden = hasPlusAccess();
  if (revoke) revoke.hidden = !hasPlusAccess();
}

function initPlusPanelControls() {
  const act = document.getElementById("plus-activate-demo");
  const revoke = document.getElementById("plus-revoke-demo");
  if (act && !act.dataset.bound) {
    act.dataset.bound = "1";
    act.addEventListener("click", () => {
      setPlusAccess(true);
      refreshPlusPanel();
    });
  }
  if (revoke && !revoke.dataset.bound) {
    revoke.dataset.bound = "1";
    revoke.addEventListener("click", () => {
      setPlusAccess(false);
      refreshPlusPanel();
    });
  }
  refreshPlusPanel();
}

function setLessonPlusLocked(locked) {
  if (locked) document.body.dataset.lessonPlusLocked = "1";
  else delete document.body.dataset.lessonPlusLocked;
}

function applyLessonCompilerLock(locked) {
  const panel = document.getElementById("lesson-compiler-panel");
  const hintId = "lesson-compiler-plus-hint";
  const hintPrev = document.getElementById(hintId);
  if (hintPrev) hintPrev.remove();

  const ids = ["se-endpoint", "se-token", "se-cpp-id", "se-csharp-id", "se-python-id", "se-lang", "se-code", "se-save", "se-run"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = locked;
  });

  if (locked && panel) {
    const wrap = panel.querySelector(".grid.two") || panel;
    const hint = document.createElement("div");
    hint.id = hintId;
    hint.className = "lesson-plus-lock-panel";
    hint.innerHTML =
      "<p><strong>Компилятор недоступен</strong> без подписки Плюс на этом уровне. Базовый уровень 1 — полностью бесплатен.</p><p class=\"meta\"><a href=\"./dashboard.html#plus-panel\">Открыть кабинет и активировать демо-доступ</a></p>";
    wrap.insertAdjacentElement("afterbegin", hint);
  }
}
const DRAFT_STORAGE_PREFIX = "draft::";
let taskDraftDebounce = null;
let lessonDraftDebounce = null;
let motionObserver = null;
const CATALOG_PAGE_SIZE = 6;
let catalogVisibleCount = CATALOG_PAGE_SIZE;
const CATALOG_ITEMS = [
  {
    id: "cat-1",
    title: "C++ Developer",
    category: "programming",
    format: "profession",
    level: "beginner",
    duration: "10 месяцев",
    durationMonths: 10,
    monthlyPrice: 8900,
    oldMonthlyPrice: 10900,
    popularity: 96,
    description: "Алгоритмы, структуры данных, STL, многопоточность и системное мышление.",
    link: "./cpp.html",
    badge: "Программирование"
  },
  {
    id: "cat-2",
    title: "C# Backend Engineer",
    category: "programming",
    format: "profession",
    level: "middle",
    duration: "9 месяцев",
    durationMonths: 9,
    monthlyPrice: 9500,
    oldMonthlyPrice: 11500,
    popularity: 92,
    description: "ASP.NET Core, архитектура сервисов, БД, очереди и production-практики.",
    link: "./csharp.html",
    badge: "Программирование"
  },
  {
    id: "cat-3",
    title: "Frontend Developer",
    category: "programming",
    format: "profession",
    level: "beginner",
    duration: "10 месяцев",
    durationMonths: 10,
    monthlyPrice: 7900,
    oldMonthlyPrice: 9900,
    popularity: 97,
    description: "HTML, CSS, JavaScript, SPA-подход и создание интерфейсов для продакшна.",
    link: "./frontend.html",
    badge: "Программирование"
  },
  {
    id: "cat-4",
    title: "Аналитик данных",
    category: "data",
    format: "profession",
    level: "beginner",
    duration: "9 месяцев",
    durationMonths: 9,
    monthlyPrice: 8400,
    oldMonthlyPrice: 9900,
    popularity: 95,
    description: "SQL, Python, продуктовые метрики, A/B-тесты и аналитика бизнес-решений.",
    link: "./data-analysis.html",
    badge: "Анализ данных"
  },
  {
    id: "cat-5",
    title: "Продуктовая аналитика",
    category: "data",
    format: "course",
    level: "middle",
    duration: "4 месяца",
    durationMonths: 4,
    monthlyPrice: 7100,
    oldMonthlyPrice: 8100,
    popularity: 90,
    description: "Воронки, retention, когорты, сегментация и аналитика роста продукта.",
    link: "./data-analysis.html",
    badge: "Анализ данных"
  },
  {
    id: "cat-6",
    title: "A/B-тесты и эксперименты",
    category: "data",
    format: "intensive",
    level: "middle",
    duration: "6 недель",
    durationMonths: 1.5,
    monthlyPrice: 5900,
    oldMonthlyPrice: 6900,
    popularity: 86,
    description: "Дизайн экспериментов, оценка эффекта, причинно-следственные выводы.",
    link: "./data-analysis.html",
    badge: "Анализ данных"
  },
  {
    id: "cat-7",
    title: "UI/UX Designer",
    category: "design",
    format: "profession",
    level: "beginner",
    duration: "8 месяцев",
    durationMonths: 8,
    monthlyPrice: 7500,
    oldMonthlyPrice: 9200,
    popularity: 89,
    description: "Исследования, прототипы, продуктовые сценарии и работа с дизайн-системами.",
    link: "./frontend.html",
    badge: "Дизайн"
  },
  {
    id: "cat-8",
    title: "Дизайн цифровых сервисов",
    category: "design",
    format: "course",
    level: "middle",
    duration: "3 месяца",
    durationMonths: 3,
    monthlyPrice: 6800,
    oldMonthlyPrice: 7800,
    popularity: 84,
    description: "Проработка пользовательского опыта и интерфейсов под бизнес-цели.",
    link: "./frontend.html",
    badge: "Дизайн"
  },
  {
    id: "cat-9",
    title: "Product Manager",
    category: "management",
    format: "profession",
    level: "beginner",
    duration: "8 месяцев",
    durationMonths: 8,
    monthlyPrice: 8200,
    oldMonthlyPrice: 9800,
    popularity: 87,
    description: "Roadmap, гипотезы роста, метрики и управление командой продукта.",
    link: "./dashboard.html",
    badge: "Менеджмент"
  },
  {
    id: "cat-10",
    title: "Управление IT-командами",
    category: "management",
    format: "course",
    level: "advanced",
    duration: "3 месяца",
    durationMonths: 3,
    monthlyPrice: 7900,
    oldMonthlyPrice: 8900,
    popularity: 82,
    description: "Процессы, people management, performance review и стратегия развития.",
    link: "./dashboard.html",
    badge: "Менеджмент"
  },
  {
    id: "cat-11",
    title: "Performance Marketing",
    category: "marketing",
    format: "course",
    level: "beginner",
    duration: "3 месяца",
    durationMonths: 3,
    monthlyPrice: 5700,
    oldMonthlyPrice: 6500,
    popularity: 80,
    description: "Воронка привлечения, каналы, ROMI и сквозная аналитика маркетинга.",
    link: "./catalog.html",
    badge: "Маркетинг"
  },
  {
    id: "cat-12",
    title: "Практика с AI-инструментами",
    category: "ai",
    format: "intensive",
    level: "beginner",
    duration: "5 недель",
    durationMonths: 1.25,
    monthlyPrice: 4900,
    oldMonthlyPrice: 5900,
    popularity: 91,
    description: "ИИ-сервисы для обучения, автоматизации и ускорения продуктовой работы.",
    link: "./catalog.html",
    badge: "ИИ"
  }
];

const FORUM_THREADS_KEY = "codenovsu-forum-threads";

function escapeHtmlText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadForumThreads() {
  try {
    const raw = localStorage.getItem(FORUM_THREADS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveForumThreads(items) {
  localStorage.setItem(FORUM_THREADS_KEY, JSON.stringify(items));
}

function seedForumThreadsIfEmpty() {
  const existing = loadForumThreads();
  if (existing) return existing;
  const seed = [
    {
      id: "seed-cpp-perf",
      title: "Оптимизация алгоритмов в C++",
      body: "Профилирование, оценка сложности, разбор задач.",
      createdAt: new Date().toISOString()
    },
    {
      id: "seed-csharp-async",
      title: "async/await в C#",
      body: "Task, ConfigureAwait, типичные ошибки в сервисах.",
      createdAt: new Date().toISOString()
    },
    {
      id: "seed-interview-trees",
      title: "Собеседование: деревья",
      body: "Обходы, балансировка, практика без лишней теории.",
      createdAt: new Date().toISOString()
    }
  ];
  saveForumThreads(seed);
  return seed;
}

function initForumPage() {
  const list = document.getElementById("forum-thread-list");
  const btn = document.getElementById("forum-create-btn");
  if (!list || !btn || btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";

  const render = () => {
    const items = loadForumThreads() || seedForumThreadsIfEmpty();
    list.innerHTML = "";
    for (const thread of items) {
      const li = document.createElement("li");
      const preview = String(thread.body || "").replace(/\s+/g, " ").trim();
      const short = preview.length > 140 ? `${preview.slice(0, 140)}…` : preview;
      li.innerHTML = `<strong>${escapeHtmlText(thread.title)}</strong><br><span class="meta">${escapeHtmlText(short)}</span>`;
      list.appendChild(li);
    }
  };

  btn.addEventListener("click", () => {
    const titleInput = document.getElementById("forum-thread-title");
    const bodyInput = document.getElementById("forum-thread-body");
    const status = document.getElementById("forum-create-status");
    const title = titleInput?.value.trim() || "";
    const body = bodyInput?.value.trim() || "";
    if (!title || !body) {
      if (status) {
        status.hidden = false;
        status.textContent = "Нужны заголовок и текст.";
      }
      return;
    }
    const items = loadForumThreads() || seedForumThreadsIfEmpty();
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `t-${Date.now()}`;
    items.unshift({ id, title, body, createdAt: new Date().toISOString() });
    saveForumThreads(items);
    if (titleInput) titleInput.value = "";
    if (bodyInput) bodyInput.value = "";
    if (status) {
      status.hidden = false;
      status.textContent = "Тема сохранена локально в браузере.";
    }
    render();
  });

  render();
}

function appendVerifiedSources(track, container) {
  if (!container || !track) return;
  container.querySelector(".lesson-sources")?.remove();

  const catalog = {
    cpp: [
      { href: "https://en.cppreference.com/w/", label: "cppreference — справочник по C/C++" },
      { href: "https://isocpp.org/get-started", label: "ISO C++ — с чего начать" }
    ],
    csharp: [{ href: "https://learn.microsoft.com/dotnet/csharp/", label: "Microsoft Learn — C#" }],
    frontend: [{ href: "https://developer.mozilla.org/", label: "MDN Web Docs" }],
    data: [
      { href: "https://docs.python.org/3/tutorial/", label: "Python.org — официальный туториал" },
      { href: "https://pandas.pydata.org/docs/", label: "pandas — документация проекта" }
    ]
  };

  const links = catalog[track];
  if (!links?.length) return;

  const aside = document.createElement("aside");
  aside.className = "lesson-sources";
  aside.setAttribute("aria-label", "Проверенные источники");

  const head = document.createElement("div");
  head.className = "lesson-sources-title";
  head.textContent = "Проверенные источники";

  const ul = document.createElement("ul");
  ul.className = "lesson-sources-list";

  for (const item of links) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = item.label;
    li.appendChild(a);
    ul.appendChild(li);
  }

  aside.appendChild(head);
  aside.appendChild(ul);
  container.appendChild(aside);
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  const toggle = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-toggle-label");
  if (toggle) {
    const isDark = next === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("title", isDark ? "Переключить на светлую тему" : "Переключить на темную тему");
  }
  if (label) label.textContent = next === "dark" ? "Dark" : "Light";
}

function initThemeToggle() {
  const cta = document.querySelector(".cta");
  if (!cta) return;
  if (!document.getElementById("theme-toggle")) {
    const wrap = document.createElement("div");
    wrap.className = "theme-toggle-wrap";
    wrap.innerHTML = `
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Переключить тему" aria-pressed="false">
        <span class="theme-toggle-track">
          <span class="theme-toggle-clouds"></span>
          <span class="theme-toggle-stars"></span>
          <span class="theme-toggle-thumb"></span>
        </span>
      </button>
      <span id="theme-toggle-label" class="theme-toggle-label">Light</span>
    `;
    cta.prepend(wrap);
    const btn = wrap.querySelector("#theme-toggle");
    btn.addEventListener("click", () => {
      const current = getTheme();
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
  setTheme(getTheme());
}

function applyMotionReveal(root = document) {
  const selector = ".hero, .section-head, .page-title, .panel, .course-card, .hero-media, .hero-card, .ticker, .notification-item, .admin-user, .admin-metric, .admin-event, .home-free, .home-career, .home-ai, .home-goal, .home-employers, .home-community, .home-stories, .home-faq, .story-card, .employer-card, .faq-item";
  const items = [];

  if (root instanceof Element && root.matches(selector)) {
    items.push(root);
  }
  if (root.querySelectorAll) {
    items.push(...root.querySelectorAll(selector));
  }

  let index = 0;
  items.forEach((item) => {
    if (item.dataset.motionBound === "1") return;
    item.dataset.motionBound = "1";
    item.classList.add("motion-enter");
    item.style.setProperty("--motion-delay", `${(index % 8) * 55}ms`);
    index += 1;

    if (motionObserver) {
      motionObserver.observe(item);
    } else {
      item.classList.add("motion-in");
    }
  });
}

function initMotionSystem() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    motionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("motion-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
  }

  applyMotionReveal(document);

  const watcher = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        applyMotionReveal(node);
      });
    });
  });

  if (document.body) {
    watcher.observe(document.body, { childList: true, subtree: true });
  }
}

function initHeroSpotlight() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const setPoint = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--pointer-x", `${Math.max(0, Math.min(100, x))}%`);
    hero.style.setProperty("--pointer-y", `${Math.max(0, Math.min(100, y))}%`);
  };

  hero.addEventListener("pointermove", (event) => {
    setPoint(event.clientX, event.clientY);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--pointer-x", "72%");
    hero.style.setProperty("--pointer-y", "28%");
  });
}

function cleanMenuHref(href) {
  return String(href || "")
    .replace(/[?#].*$/, "")
    .replace(/^\.\//, "");
}

function resolveActiveMenuTarget(currentPage) {
  if (currentPage !== "lesson.html") return currentPage;
  const track = new URLSearchParams(window.location.search).get("track");
  if (track === "cpp") return "cpp.html";
  if (track === "csharp") return "csharp.html";
  if (track === "frontend") return "frontend.html";
  if (track === "data") return "data-analysis.html";
  return "catalog.html";
}

function highlightActiveMenu() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const path = window.location.pathname.split("/").pop() || "index.html";
  const target = resolveActiveMenuTarget(path);
  Array.from(nav.children).forEach((child) => {
    if (!(child instanceof HTMLAnchorElement)) return;
    const href = cleanMenuHref(child.getAttribute("href"));
    child.classList.toggle("active-menu", href === target);
  });

  nav.querySelectorAll("[data-nav-dropdown]").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-trigger");
    if (!trigger) return;
    const hasActiveLink = Array.from(dropdown.querySelectorAll(".nav-panel a")).some((link) => {
      const href = cleanMenuHref(link.getAttribute("href"));
      return href === target;
    });
    trigger.classList.toggle("active-menu", hasActiveLink);
  });
}

function initHeaderDropdowns() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const dropdowns = Array.from(nav.querySelectorAll("[data-nav-dropdown]"));
  if (!dropdowns.length) return;

  const closeDropdown = (dropdown) => {
    dropdown.classList.remove("is-open");
    const button = dropdown.querySelector("[data-menu-toggle]");
    const panel = dropdown.querySelector(".nav-panel");
    if (button) button.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
  };

  const openDropdown = (dropdown) => {
    dropdown.classList.add("is-open");
    const button = dropdown.querySelector("[data-menu-toggle]");
    const panel = dropdown.querySelector(".nav-panel");
    if (button) button.setAttribute("aria-expanded", "true");
    if (panel) panel.hidden = false;
  };

  const closeAllDropdowns = (exceptDropdown) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown === exceptDropdown) return;
      closeDropdown(dropdown);
    });
  };

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector("[data-menu-toggle]");
    const panel = dropdown.querySelector(".nav-panel");
    if (!button || !panel) return;

    closeDropdown(dropdown);

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldOpen = !dropdown.classList.contains("is-open");
      closeAllDropdowns(dropdown);
      if (shouldOpen) openDropdown(dropdown);
      else closeDropdown(dropdown);
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeAllDropdowns();
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    if (!nav.contains(event.target)) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllDropdowns();
  });
}

function initMainMenu() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  nav.classList.add("main-menu");
  highlightActiveMenu();
  initHeaderDropdowns();
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map((item) => item.value);
}

function normalizeLevelLabel(level) {
  if (level === "beginner") return "С нуля";
  if (level === "middle") return "Для практиков";
  return "Продвинутый";
}

function normalizeFormatLabel(format) {
  if (format === "profession") return "Профессия";
  if (format === "course") return "Курс";
  return "Интенсив";
}

function formatRub(value) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽/мес`;
}

function getSalePercent(item) {
  const oldPrice = Number(item.oldMonthlyPrice);
  const price = Number(item.monthlyPrice);
  if (!Number.isFinite(oldPrice) || !Number.isFinite(price) || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function sortCatalogItems(items, sortType) {
  const sorted = items.slice();
  if (sortType === "price-asc") {
    sorted.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
    return sorted;
  }
  if (sortType === "price-desc") {
    sorted.sort((a, b) => b.monthlyPrice - a.monthlyPrice);
    return sorted;
  }
  if (sortType === "duration-asc") {
    sorted.sort((a, b) => a.durationMonths - b.durationMonths);
    return sorted;
  }
  sorted.sort((a, b) => b.popularity - a.popularity);
  return sorted;
}

function updateCatalogPagination(total, shown) {
  const info = document.getElementById("catalog-showing");
  const moreBtn = document.getElementById("catalog-show-more-btn");
  if (info) info.textContent = total ? `Показано ${shown} из ${total}` : "";
  if (!moreBtn) return;
  moreBtn.hidden = shown >= total;
  moreBtn.disabled = shown >= total;
}

function renderCatalogCards(items) {
  const grid = document.getElementById("catalog-grid");
  const count = document.getElementById("catalog-count");
  if (!grid || !count) return;

  count.textContent = `Курсы: ${items.length}`;
  grid.innerHTML = "";

  if (!items.length) {
    grid.innerHTML = "<div class=\"panel\">По текущим фильтрам курсов не найдено.</div>";
    updateCatalogPagination(0, 0);
    return;
  }

  const visibleItems = items.slice(0, catalogVisibleCount);
  visibleItems.forEach((item) => {
    const salePercent = getSalePercent(item);
    const card = document.createElement("article");
    card.className = "course-card catalog-card";
    card.innerHTML = `
      <div class="catalog-card-top">
        <span class="badge">${item.badge}</span>
        <div class="catalog-card-flags">
          ${salePercent ? `<span class="catalog-sale">-${salePercent}%</span>` : ""}
          <span class="catalog-format">${normalizeFormatLabel(item.format)}</span>
        </div>
      </div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="catalog-meta">
        <span>${normalizeLevelLabel(item.level)}</span>
        <span>${item.duration}</span>
      </div>
      <div class="catalog-price-block">
        <div class="catalog-price">от ${formatRub(item.monthlyPrice)}</div>
        ${salePercent ? `<div class="catalog-old-price">вместо ${formatRub(item.oldMonthlyPrice)}</div>` : ""}
      </div>
      <div class="catalog-actions">
        <a class="button primary small" href="${item.link}">Подробнее</a>
        <a class="button ghost small" href="./login.html">Записаться</a>
      </div>
    `;
    grid.appendChild(card);
  });

  updateCatalogPagination(items.length, visibleItems.length);
}

function applyCatalogFilters() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  const activeTab = document.querySelector(".catalog-tab.active");
  const activeCategory = activeTab?.getAttribute("data-catalog-category") || "all";
  const activeFormats = getCheckedValues("catalog-format");
  const activeLevels = getCheckedValues("catalog-level");
  const query = (document.getElementById("catalog-query")?.value || "").trim().toLowerCase();
  const sortType = document.getElementById("catalog-sort")?.value || "popular";

  const filtered = CATALOG_ITEMS.filter((item) => {
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (activeFormats.length && !activeFormats.includes(item.format)) return false;
    if (activeLevels.length && !activeLevels.includes(item.level)) return false;
    if (!query) return true;

    const haystack = `${item.title} ${item.description} ${item.badge}`.toLowerCase();
    return haystack.includes(query);
  });

  const sorted = sortCatalogItems(filtered, sortType);
  renderCatalogCards(sorted);
}

function initCatalogPage() {
  const catalogRoot = document.getElementById("catalog-grid");
  if (!catalogRoot) return;

  document.querySelectorAll(".catalog-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".catalog-tab").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      catalogVisibleCount = CATALOG_PAGE_SIZE;
      applyCatalogFilters();
    });
  });

  document.querySelectorAll('input[name="catalog-format"], input[name="catalog-level"]').forEach((input) => {
    input.addEventListener("change", () => {
      catalogVisibleCount = CATALOG_PAGE_SIZE;
      applyCatalogFilters();
    });
  });

  const search = document.getElementById("catalog-query");
  const searchBtn = document.getElementById("catalog-search-btn");
  search?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      catalogVisibleCount = CATALOG_PAGE_SIZE;
      applyCatalogFilters();
    }
  });
  searchBtn?.addEventListener("click", () => {
    catalogVisibleCount = CATALOG_PAGE_SIZE;
    applyCatalogFilters();
  });

  const sort = document.getElementById("catalog-sort");
  sort?.addEventListener("change", () => {
    catalogVisibleCount = CATALOG_PAGE_SIZE;
    applyCatalogFilters();
  });

  const resetBtn = document.getElementById("catalog-reset-btn");
  resetBtn?.addEventListener("click", () => {
    document.querySelectorAll(".catalog-tab").forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-catalog-category") === "all");
    });
    document.querySelectorAll('input[name="catalog-format"], input[name="catalog-level"]').forEach((input) => {
      input.checked = true;
    });
    if (search) search.value = "";
    if (sort) sort.value = "popular";
    catalogVisibleCount = CATALOG_PAGE_SIZE;
    applyCatalogFilters();
  });

  const showMoreBtn = document.getElementById("catalog-show-more-btn");
  showMoreBtn?.addEventListener("click", () => {
    catalogVisibleCount += CATALOG_PAGE_SIZE;
    applyCatalogFilters();
  });

  applyCatalogFilters();
}

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function setUser(user) {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

function draftStorageKey(scopeType, scopeId, language = "plain") {
  return `${DRAFT_STORAGE_PREFIX}${scopeType}:${scopeId}:${language}`;
}

function getLocalDraft(scopeType, scopeId, language = "plain") {
  const raw = localStorage.getItem(draftStorageKey(scopeType, scopeId, language));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.code === "string") return parsed;
    return { code: String(raw), updatedAt: null };
  } catch {
    return { code: String(raw), updatedAt: null };
  }
}

function setLocalDraft(scopeType, scopeId, language = "plain", code = "") {
  const payload = { code, updatedAt: new Date().toISOString() };
  localStorage.setItem(draftStorageKey(scopeType, scopeId, language), JSON.stringify(payload));
  return payload;
}

function formatTimestamp(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

async function refreshCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const user = await api("/users/me");
    setUser(user);
    return user;
  } catch {
    setToken(null);
    setUser(null);
    return null;
  }
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

async function fetchCurriculum() {
  const candidates = [
    CURRICULUM_URL,
    "/data/full-curriculum.json",
    "/frontend/prototype/web/data/full-curriculum.json"
  ];

  for (const url of candidates) {
    const res = await fetch(url).catch(() => null);
    if (res && res.ok) return res.json();
  }

  throw new Error("Curriculum load failed");
}

function updateAuthStatus() {
  const status = document.getElementById("auth-status");
  const user = getUser();
  if (status) {
    if (!user) {
      status.textContent = "Гость";
      status.removeAttribute("title");
    } else {
      const localPart = String(user.email || "").split("@")[0] || user.email;
      const shortName = localPart.length > 16 ? `${localPart.slice(0, 16)}…` : localPart;
      status.textContent = `${shortName} (${user.role})`;
      status.title = `${user.email} (${user.role})`;
    }
  }
  ensureAdminNavLink(user);
  highlightActiveMenu();
  loadNotificationBadge();
}

function ensureAdminNavLink(user) {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  let adminLink = document.getElementById("admin-link");
  if (user?.role === "admin") {
    if (!adminLink) {
      adminLink = document.createElement("a");
      adminLink.id = "admin-link";
      adminLink.href = "./admin.html";
      adminLink.textContent = "Админ";
      nav.appendChild(adminLink);
    }
    highlightActiveMenu();
    return;
  }
  if (adminLink) adminLink.remove();
  highlightActiveMenu();
}

async function loadNotificationBadge() {
  const cta = document.querySelector(".cta");
  if (!cta) return;

  let link = document.getElementById("notifications-link");
  const user = getUser();
  if (!user) {
    if (link) link.remove();
    return;
  }

  if (!link) {
    link = document.createElement("a");
    link.id = "notifications-link";
    link.className = "auth-status";
    link.href = "./dashboard.html#notifications-panel";
    cta.prepend(link);
  }

  link.textContent = "Уведомления";
  try {
    const data = await api("/notifications?limit=1");
    const unread = Number(data?.unreadCount) || 0;
    link.textContent = unread > 0 ? `Уведомления (${unread})` : "Уведомления";
  } catch {
    link.textContent = "Уведомления";
  }
}

function renderCourses(courses) {
  const list = document.getElementById("course-list");
  if (!list) return;
  list.innerHTML = "";
  for (const c of courses) {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <div class="badge">${c.language}</div>
      <h3>${c.title}</h3>
      <p>${c.description || ""}</p>
      <div class="meta">Уровень: ${c.level}</div>
      <a class="button primary small" href="./course.html">Открыть</a>
    `;
    list.appendChild(card);
  }
}

async function loadCourses() {
  try {
    const courses = await api("/courses");
    renderCourses(courses);
  } catch {
    renderCourses([]);
  }
}

async function handleSearch() {
  const input = document.getElementById("search-input");
  const panel = document.getElementById("search-results");
  if (!input || !panel) return;
  const q = (input.value || "").trim();
  if (!q) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }
  try {
    const result = await api(`/search?q=${encodeURIComponent(q)}`);
    panel.hidden = false;
    if (!result.results.length) {
      panel.innerHTML = `<div class="panel-title">Ничего не найдено</div>`;
      return;
    }
    const items = result.results
      .map((r) => `
        <div class="meta">${r.type.toUpperCase()}</div>
        <div><strong>${r.item.title || r.item.statement}</strong></div>
      `)
      .join("");
    panel.innerHTML = `<div class="panel-title">Результаты</div>${items}`;
  } catch {
    panel.hidden = false;
    panel.innerHTML = `<div class="panel-title">Ошибка поиска</div>`;
  }
}

function renderRecommendations(items) {
  const list = document.getElementById("reco-list");
  if (!list) return;
  list.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = `${item.title} — ${item.reason}`;
    list.appendChild(li);
  }
}

function renderProgress(progress) {
  const tasks = document.getElementById("stat-tasks");
  const tests = document.getElementById("stat-tests");
  const lessons = document.getElementById("stat-lessons");
  const drafts = document.getElementById("stat-drafts");
  const avg = document.getElementById("stat-average");
  if (!tasks || !tests) return;
  tasks.textContent = progress.tasksSubmitted ?? 0;
  tests.textContent = progress.testsAttempted ?? 0;
  if (lessons) lessons.textContent = progress.lessonsCompleted ?? 0;
  if (drafts) drafts.textContent = progress.savedDrafts ?? 0;
  if (avg) avg.textContent = progress.averageTaskScore ?? "—";
}

function renderSubmissions(items) {
  const list = document.getElementById("submissions-list");
  if (!list) return;
  list.innerHTML = "";
  if (!items.length) {
    list.textContent = "Нет отправок";
    return;
  }
  for (const s of items.slice(0, 5)) {
    const row = document.createElement("div");
    row.className = `meta score-${String(s.result?.status || "").toLowerCase()}`;
    const scorePart = typeof s.score === "number" ? ` • ${s.score}%` : "";
    row.textContent = `Отправка ${s.id.slice(0, 6)} • ${s.result?.status || "PENDING"}${scorePart}`;
    list.appendChild(row);
  }
}

function renderNotifications(items, unreadCount = 0) {
  const list = document.getElementById("notifications-list");
  const unread = document.getElementById("notifications-unread-count");
  if (!list) return;
  if (unread) unread.textContent = String(unreadCount || 0);
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = "<div class=\"meta\">Пока нет уведомлений.</div>";
    return;
  }

  for (const item of items.slice(0, 10)) {
    const row = document.createElement("div");
    row.className = "notification-item";
    row.innerHTML = `
      <div>
        <div><strong>${item.title}</strong></div>
        <div class="meta">${item.message || ""}</div>
        <div class="meta">${new Date(item.createdAt).toLocaleString("ru-RU")}</div>
      </div>
      <div class="admin-inline-actions">
        ${item.link ? `<a class="ghost small" href="${item.link}">Открыть</a>` : ""}
        ${item.isRead ? "<span class=\"meta\">Прочитано</span>" : `<button class="ghost small" data-notification-read="${item.id}">Прочитать</button>`}
      </div>
    `;
    list.appendChild(row);
  }

  list.querySelectorAll("[data-notification-read]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const id = event.currentTarget.getAttribute("data-notification-read");
      if (!id) return;
      try {
        await api(`/notifications/${id}/read`, { method: "PATCH" });
        await loadDashboard();
      } catch {
        // ignore
      }
    });
  });
}

async function loadDashboard() {
  const user = getUser();
  if (!user) return;
  try {
    const progress = await api("/progress");
    renderProgress(progress);
  } catch {
    renderProgress({ tasksSubmitted: 0, testsAttempted: 0 });
  }

  try {
    const recos = await api("/recommendations");
    renderRecommendations(recos.items || []);
  } catch {
    renderRecommendations([]);
  }

  try {
    const submissions = await api("/tasks/submissions");
    renderSubmissions(submissions || []);
  } catch {
    renderSubmissions([]);
  }

  try {
    const notifications = await api("/notifications?limit=20");
    renderNotifications(notifications.items || [], notifications.unreadCount || 0);
  } catch {
    renderNotifications([], 0);
  }

  const markAllBtn = document.getElementById("notifications-read-all");
  if (markAllBtn && !markAllBtn.dataset.bound) {
    markAllBtn.dataset.bound = "1";
    markAllBtn.addEventListener("click", async () => {
      try {
        await api("/notifications/read-all", { method: "POST" });
        await loadDashboard();
      } catch {
        // ignore
      }
    });
  }
}

let taskCatalog = [];
let currentTask = null;

function renderTaskReview(result) {
  const output = document.getElementById("task-feedback");
  if (!output) return;
  output.innerHTML = "";
  if (!result) {
    output.innerHTML = "<div class=\"meta\">Детальный отчет появится после отправки.</div>";
    return;
  }

  const title = document.createElement("div");
  title.className = "panel-title";
  title.textContent = `Отчет проверки: ${result.status} • ${result.score}%`;
  output.appendChild(title);

  const verdict = document.createElement("div");
  verdict.className = "meta";
  verdict.textContent = result.verdict || "";
  output.appendChild(verdict);

  const stats = document.createElement("div");
  stats.className = "meta";
  const lines = result?.stats?.lines ?? 0;
  const chars = result?.stats?.characters ?? 0;
  stats.textContent = `Объем: ${lines} строк, ${chars} символов`;
  output.appendChild(stats);

  const list = document.createElement("div");
  list.className = "review-list";
  (result.checks || []).forEach((check) => {
    const row = document.createElement("div");
    row.className = `review-item review-${check.status}`;
    row.innerHTML = `<strong>${check.title}</strong><span>${check.message}</span>`;
    list.appendChild(row);
  });
  output.appendChild(list);
}

function renderTaskSelect(tasks) {
  taskCatalog = tasks;
  const select = document.getElementById("task-select");
  if (!select) return;
  select.innerHTML = "";
  for (const t of tasks) {
    const option = document.createElement("option");
    option.value = t.id;
    option.textContent = `${t.type.toUpperCase()} • ${t.statement.slice(0, 40)}...`;
    select.appendChild(option);
  }
  if (tasks.length) {
    select.value = tasks[0].id;
    const statement = document.getElementById("task-statement");
    if (statement) statement.textContent = tasks[0].statement;
    currentTask = tasks[0];
  }
}

async function loadTasks() {
  try {
    const tasks = await api("/tasks");
    renderTaskSelect(tasks);
    if (tasks.length) {
      await hydrateTaskDraft(tasks[0]);
      renderTaskReview(null);
    }
  } catch {
    renderTaskSelect([]);
  }
}

function setTaskDraftStatus(message) {
  const node = document.getElementById("task-autosave-status");
  if (node) node.textContent = message;
}

function taskScopeId(taskId) {
  return `task:${taskId}`;
}

function taskLanguage(task) {
  return ((task?.language || "cpp") + "").toLowerCase();
}

async function hydrateTaskDraft(task) {
  const editor = document.getElementById("task-code");
  if (!editor || !task?.id) return;

  const language = taskLanguage(task);
  const scopeId = taskScopeId(task.id);
  const local = getLocalDraft("task", scopeId, language);

  let remote = null;
  if (getUser()) {
    try {
      const response = await api(`/progress/draft?scopeType=task&scopeId=${encodeURIComponent(scopeId)}&language=${encodeURIComponent(language)}`);
      remote = response.item || null;
    } catch {
      remote = null;
    }
  }

  const localTime = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
  const remoteTime = remote?.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
  const source = remoteTime > localTime ? remote : local;

  if (source?.code) {
    editor.value = source.code;
    setTaskDraftStatus(`Черновик загружен (${formatTimestamp(source.updatedAt) || "без времени"})`);
    if (source === remote) setLocalDraft("task", scopeId, language, source.code);
  } else {
    editor.value = "// ваш код здесь";
    setTaskDraftStatus("Черновик не найден");
  }
}

async function saveTaskDraft() {
  const editor = document.getElementById("task-code");
  if (!editor || !currentTask?.id) return;

  const language = taskLanguage(currentTask);
  const scopeId = taskScopeId(currentTask.id);
  const code = editor.value || "";
  const local = setLocalDraft("task", scopeId, language, code);
  setTaskDraftStatus(`Черновик сохранен локально (${formatTimestamp(local.updatedAt)})`);

  if (!getUser()) return;
  try {
    const remote = await api("/progress/draft", {
      method: "PUT",
      body: JSON.stringify({
        scopeType: "task",
        scopeId,
        language,
        code
      })
    });
    setTaskDraftStatus(`Черновик синхронизирован (${formatTimestamp(remote.updatedAt)})`);
  } catch {
    setTaskDraftStatus("Синхронизация недоступна, сохранено локально");
  }
}

function initTaskAutosave() {
  const editor = document.getElementById("task-code");
  if (!editor || editor.dataset.boundAutosave === "1") return;
  editor.dataset.boundAutosave = "1";
  editor.addEventListener("input", () => {
    clearTimeout(taskDraftDebounce);
    taskDraftDebounce = setTimeout(saveTaskDraft, 700);
  });
}

async function handleTaskChange() {
  const select = document.getElementById("task-select");
  const statement = document.getElementById("task-statement");
  if (!select || !statement) return;
  const taskId = select.value;
  if (!taskId) return;
  try {
    const task = taskCatalog.find((item) => item.id === taskId) || await api(`/tasks/${taskId}`);
    currentTask = task;
    statement.textContent = task.statement;
    await hydrateTaskDraft(task);
    renderTaskReview(null);
  } catch {
    statement.textContent = "Ошибка загрузки";
  }
}

async function submitTask() {
  const user = getUser();
  if (!user) {
    alert("Войдите, чтобы отправить решение");
    return;
  }
  const taskId = document.getElementById("task-select")?.value;
  const code = document.getElementById("task-code")?.value || "";
  const resultEl = document.getElementById("task-result");
  if (!taskId || !code.trim()) {
    if (resultEl) resultEl.textContent = "Заполните код";
    return;
  }
  if (resultEl) resultEl.textContent = "Отправка...";
  try {
    await saveTaskDraft();
    const submission = await api(`/tasks/${taskId}/submissions`, {
      method: "POST",
      body: JSON.stringify({ code })
    });
    if (resultEl) resultEl.textContent = `Отправлено: ${submission.id.slice(0, 6)} • ${submission.result?.status || "PENDING"} • ${submission.score ?? "—"}%`;
    renderTaskReview(submission.result);
    await loadDashboard();
    loadNotificationBadge();
  } catch {
    if (resultEl) resultEl.textContent = "Ошибка отправки";
  }
}

function renderTestQuestions(test) {
  const body = document.getElementById("test-questions");
  if (!body) return;
  body.innerHTML = "";
  (test.questions || []).forEach((question, index) => {
    const block = document.createElement("div");
    block.className = "question-block";
    block.innerHTML = `
      <div class="panel-title">Вопрос ${index + 1} из ${(test.questions || []).length}</div>
      <p>${question.text}</p>
      <div class="answers">
        ${(question.options || [])
          .map((option, optionIndex) =>
            `<label><input type="radio" name="test-${question.id}" value="${optionIndex}" /> ${option}</label>`)
          .join("")}
      </div>
    `;
    body.appendChild(block);
  });
}

async function submitTestAttempt(testId) {
  const resultEl = document.getElementById("test-result");
  if (!getUser()) {
    if (resultEl) resultEl.textContent = "Войдите, чтобы отправить тест.";
    return;
  }

  const questionBlocks = Array.from(document.querySelectorAll("[name^='test-']"));
  const grouped = new Map();
  questionBlocks.forEach((input) => {
    const name = input.getAttribute("name") || "";
    const questionId = name.replace("test-", "");
    if (!grouped.has(questionId)) grouped.set(questionId, []);
    grouped.get(questionId).push(input);
  });

  const answers = [];
  grouped.forEach((inputs, questionId) => {
    const checked = inputs.find((input) => input.checked);
    if (checked) answers.push({ questionId, answer: Number(checked.value) });
  });

  if (resultEl) resultEl.textContent = "Проверка...";
  try {
    const attempt = await api(`/tests/${testId}/attempts`, {
      method: "POST",
      body: JSON.stringify({ answers })
    });
    const status = attempt.result?.status || "UNKNOWN";
    const score = attempt.result?.score ?? 0;
    const details = attempt.result?.results || [];
    if (resultEl) {
      const correct = details.filter((item) => item.isCorrect).length;
      resultEl.textContent = `Результат: ${status} • ${score}% (${correct}/${details.length})`;
    }
    await loadDashboard();
    loadNotificationBadge();
  } catch {
    if (resultEl) resultEl.textContent = "Ошибка отправки теста";
  }
}

async function loadTestPage() {
  const root = document.getElementById("test-questions");
  if (!root) return;

  try {
    const tests = await api("/tests");
    if (!tests.length) {
      root.innerHTML = "<div class=\"meta\">Тесты пока не добавлены.</div>";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const currentId = params.get("id") || tests[0].id;
    const test = await api(`/tests/${currentId}`);

    const title = document.getElementById("test-title");
    const time = document.getElementById("test-meta");
    if (title) title.textContent = `Тест: ${test.title}`;
    if (time) time.textContent = `Вопросов: ${(test.questions || []).length}`;

    renderTestQuestions(test);

    const button = document.getElementById("test-submit-btn");
    if (button && button.dataset.bound !== "1") {
      button.dataset.bound = "1";
      button.addEventListener("click", () => submitTestAttempt(test.id));
    }
  } catch {
    root.innerHTML = "<div class=\"meta\">Не удалось загрузить тест.</div>";
  }
}

async function handleLoginForm(event) {
  event.preventDefault();
  const email = document.getElementById("login-email")?.value;
  const password = document.getElementById("login-password")?.value;
  const register = document.getElementById("login-register")?.checked;
  const admin = document.getElementById("login-admin")?.checked;
  const adminCode = document.getElementById("admin-code")?.value;
  const alertBox = document.getElementById("login-alert");
  if (!email || !password) {
    if (alertBox) alertBox.textContent = "Заполните email и пароль";
    return;
  }
  const payload = { email, password };
  if (register && admin) {
    payload.role = "admin";
    payload.adminCode = adminCode || "";
  }
  try {
    const result = await api(register ? "/auth/register" : "/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setToken(result.token);
    setUser(result.user);
    if (alertBox) alertBox.textContent = "Успешно. Переадресация...";
    window.location.href = result.user.role === "admin" ? "./admin.html" : "./dashboard.html";
  } catch (error) {
    const messageMap = {
      INVALID_ADMIN_CODE: "Неверный код администратора",
      INVALID_CREDENTIALS: "Неверный email или пароль",
      EMAIL_EXISTS: "Пользователь уже существует"
    };
    if (alertBox) alertBox.textContent = messageMap[error?.error] || "Ошибка входа или регистрации";
  }
}

function renderCurriculum(trackName) {
  const container = document.getElementById("curriculum-container");
  if (!container) return;

  fetchCurriculum()
    .then((data) => {
      const track = data.tracks.find((t) => t.name === trackName);
      if (!track) {
        container.innerHTML = "<div class=\"panel\">Трек не найден</div>";
        return;
      }

      container.innerHTML = "";
      track.levels.forEach((level) => {
        const details = document.createElement("details");
        details.className = "panel";

        const sampleFile = level.lessons[0]?.file || "";
        const levelNumMatch = sampleFile.match(/level-(\d+)/);
        const levelNum = levelNumMatch ? parseInt(levelNumMatch[1], 10) : 1;
        const levelNeedsPlus = lessonLevelRequiresPlus(levelNum);

        const summary = document.createElement("summary");
        summary.className = "panel-title curriculum-level-summary";
        summary.textContent = `${level.name} · ${level.lessonCount} уроков`;
        if (levelNeedsPlus) {
          const badge = document.createElement("span");
          badge.className = "plus-badge";
          badge.textContent = "Плюс";
          summary.appendChild(document.createTextNode(" "));
          summary.appendChild(badge);
        }

        const list = document.createElement("div");
        list.className = "curriculum-list";

        level.lessons.forEach((lesson, idx) => {
          const item = document.createElement("a");
          const file = lesson.file;
          const parts = file.split("/");
          const trackKey = parts[0];
          const levelKey = parts[1];
          const lessonNum = (parts[2] || "").slice(0, 3);
          const titleText = (parts[2] || "").replace(/\.md$/, "").replace(/^\d{3}-/, "").replace(/-/g, " ");

          item.className = "meta curriculum-lesson-link";
          item.href = `./lesson.html?track=${trackKey}&level=${levelKey.replace("level-", "")}&lesson=${lessonNum}`;
          const label = document.createElement("span");
          label.className = "curriculum-lesson-label";
          label.textContent = `Урок ${lessonNum} — ${titleText}`;
          item.appendChild(label);
          if (levelNeedsPlus) {
            const b = document.createElement("span");
            b.className = "plus-badge";
            b.textContent = "Плюс";
            item.appendChild(b);
          }
          list.appendChild(item);
        });

        details.appendChild(summary);
        details.appendChild(list);
        container.appendChild(details);
      });
    })
    .catch(() => {
      container.innerHTML = "<div class=\"panel\">Ошибка загрузки программы</div>";
    });
}

function parseLessonParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    track: params.get("track"),
    level: params.get("level"),
    lesson: params.get("lesson")
  };
}

function markdownToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let inCode = false;
  let listOpen = false;

  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        out.push("<pre class=\"code-sample\"><code>");
      } else {
        inCode = false;
        out.push("</code></pre>");
      }
      continue;
    }

    if (inCode) {
      out.push(escape(line));
      continue;
    }

    if (line.startsWith("### ")) {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
      out.push(`<h4>${escape(line.replace("### ", ""))}</h4>`);
      continue;
    }

    if (line.startsWith("## ")) {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
      out.push(`<h3>${escape(line.replace("## ", ""))}</h3>`);
      continue;
    }

    if (line.startsWith("# ")) {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
      out.push(`<h2>${escape(line.replace("# ", ""))}</h2>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${escape(line.replace("- ", ""))}</li>`);
      continue;
    }

    if (line.trim() === "") {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
      continue;
    }

    out.push(`<p>${escape(line)}</p>`);
  }

  if (listOpen) out.push("</ul>");
  if (inCode) out.push("</code></pre>");

  return out.join("\n");
}

async function loadLessonPage() {
  const titleEl = document.getElementById("lesson-title");
  const metaEl = document.getElementById("lesson-meta");
  const contentEl = document.getElementById("lesson-content");
  const taskEl = document.getElementById("lesson-task");
  const completeBtn = document.getElementById("lesson-mark-complete");

  if (!contentEl) return;

  const { track, level, lesson } = parseLessonParams();
  if (!track || !level || !lesson) {
    contentEl.innerHTML = "<p>Не указан урок.</p>";
    return;
  }

  const plusLocked = lessonLevelRequiresPlus(level) && !hasPlusAccess();
  setLessonPlusLocked(plusLocked);

  if (metaEl) {
    const tierLabel = lessonLevelRequiresPlus(level) ? (hasPlusAccess() ? "Плюс" : "Плюс (нужна подписка)") : "Бесплатно";
    metaEl.textContent = `Трек: ${track} · Уровень: ${level} · Урок: ${lesson} · ${tierLabel}`;
  }

  try {
    const lessonData = await api(`/curriculum/lesson?track=${track}&level=${level}&lesson=${lesson}`);
    if (titleEl) titleEl.textContent = lessonData.title.replace(/\.md$/, "");
    if (plusLocked) {
      contentEl.innerHTML = `${markdownToHtml(markdownTeaser(lessonData.content))}${renderLessonPaywallHtml()}`;
    } else {
      contentEl.innerHTML = markdownToHtml(lessonData.content);
      appendVerifiedSources(track, contentEl);
    }
  } catch {
    contentEl.innerHTML = "<p>Ошибка загрузки материала.</p>";
  }

  if (plusLocked) {
    if (taskEl) {
      taskEl.innerHTML =
        "<p><strong>Практика по этому уроку</strong> доступна в CodeNovSU Плюс. Уровень 1 остаётся бесплатным целиком.</p><p class=\"meta\"><a href=\"./dashboard.html#plus-panel\">Активировать демо в кабинете</a></p>";
    }
    if (completeBtn) {
      completeBtn.disabled = true;
      completeBtn.title = "Доступно с подпиской Плюс";
    }
    applyLessonCompilerLock(true);
  } else {
    if (completeBtn) {
      completeBtn.disabled = false;
      completeBtn.removeAttribute("title");
    }
    applyLessonCompilerLock(false);
    try {
      const curriculum = await fetchCurriculum();
      const trackName = track === "cpp"
        ? "C++"
        : track === "csharp"
          ? "C#"
          : track === "frontend"
            ? "HTML/CSS/JavaScript"
            : "Data Analysis";
      const trackData = curriculum.tracks.find((t) => t.name === trackName);
      const levelData = trackData?.levels.find((l) => l.name === (level === "1" ? "Beginner" : level === "2" ? "Basic" : level === "3" ? "Intermediate" : "Advanced"));
      const task = levelData?.tasks?.find((t) => String(t.lesson).padStart(3, "0") === String(lesson).padStart(3, "0"));
      if (task && taskEl) {
        taskEl.innerHTML = `<strong>${task.title}</strong><br/>${task.statement}`;
      }
    } catch {
      if (taskEl) taskEl.textContent = "Не удалось загрузить задание.";
    }

    await markLessonViewed(track, level, lesson);
    initLessonProgressActions(track, level, lesson);
    const langSelect = document.getElementById("se-lang");
    if (track === "data" && langSelect) langSelect.value = "python";
    initLessonCompilerDraft(track, level, lesson);
  }
}

async function markLessonViewed(track, level, lesson, status = "viewed") {
  const statusEl = document.getElementById("lesson-progress-status");
  if (!getUser()) {
    if (statusEl) statusEl.textContent = "Войдите, чтобы синхронизировать прогресс";
    return;
  }

  try {
    const progress = await api("/progress/lessons/state", {
      method: "PUT",
      body: JSON.stringify({ track, level, lesson, status })
    });
    if (statusEl) {
      const label = progress.status === "completed" ? "урок завершен" : "урок в процессе";
      statusEl.textContent = `Прогресс сохранен: ${label}`;
    }
  } catch {
    if (statusEl) statusEl.textContent = "Не удалось сохранить прогресс";
  }
}

function initLessonProgressActions(track, level, lesson) {
  const button = document.getElementById("lesson-mark-complete");
  if (!button || button.dataset.bound === "1") return;
  button.dataset.bound = "1";
  button.addEventListener("click", async () => {
    button.disabled = true;
    await markLessonViewed(track, level, lesson, "completed");
    button.disabled = false;
    loadDashboard();
    loadNotificationBadge();
  });
}

function setLessonDraftStatus(text) {
  const status = document.getElementById("se-autosave-status");
  if (status) status.textContent = text;
}

function lessonScopeId(track, level, lesson) {
  return `lesson:${track}:${level}:${String(lesson).padStart(3, "0")}`;
}

async function loadLessonDraft(track, level, lesson, language) {
  const scopeId = lessonScopeId(track, level, lesson);
  const local = getLocalDraft("lesson", scopeId, language);
  let remote = null;

  if (getUser()) {
    try {
      const response = await api(`/progress/draft?scopeType=lesson&scopeId=${encodeURIComponent(scopeId)}&language=${encodeURIComponent(language)}`);
      remote = response.item || null;
    } catch {
      remote = null;
    }
  }

  const localTime = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
  const remoteTime = remote?.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
  if (remoteTime > localTime) {
    setLocalDraft("lesson", scopeId, language, remote.code || "");
    return remote;
  }
  return local;
}

async function saveLessonDraft(track, level, lesson) {
  const editor = document.getElementById("se-code");
  const lang = document.getElementById("se-lang");
  if (!editor || !lang) return;
  const language = lang.value || "cpp";
  const scopeId = lessonScopeId(track, level, lesson);
  const code = editor.value || "";
  const local = setLocalDraft("lesson", scopeId, language, code);
  setLessonDraftStatus(`Черновик сохранен локально (${formatTimestamp(local.updatedAt)})`);

  if (!getUser()) return;
  try {
    const remote = await api("/progress/draft", {
      method: "PUT",
      body: JSON.stringify({
        scopeType: "lesson",
        scopeId,
        language,
        code
      })
    });
    setLessonDraftStatus(`Черновик синхронизирован (${formatTimestamp(remote.updatedAt)})`);
  } catch {
    setLessonDraftStatus("Синхронизация недоступна, сохранено локально");
  }
}

function initLessonCompilerDraft(track, level, lesson) {
  const editor = document.getElementById("se-code");
  const lang = document.getElementById("se-lang");
  if (!editor || !lang) return;

  const hydrate = async () => {
    const draft = await loadLessonDraft(track, level, lesson, lang.value || "cpp");
    if (draft?.code) {
      editor.value = draft.code;
      setLessonDraftStatus(`Черновик загружен (${formatTimestamp(draft.updatedAt) || "без времени"})`);
    } else {
      editor.value = "// write your code here";
      setLessonDraftStatus("Черновик не найден");
    }
  };

  if (editor.dataset.lessonBound !== "1") {
    editor.dataset.lessonBound = "1";
    editor.addEventListener("input", () => {
      clearTimeout(lessonDraftDebounce);
      lessonDraftDebounce = setTimeout(() => saveLessonDraft(track, level, lesson), 700);
    });
  }

  if (lang.dataset.lessonBound !== "1") {
    lang.dataset.lessonBound = "1";
    lang.addEventListener("change", async () => {
      await saveLessonDraft(track, level, lesson);
      await hydrate();
    });
  }

  hydrate();
}

function getSeSettings() {
  return {
    endpoint: localStorage.getItem("se_endpoint") || "",
    token: localStorage.getItem("se_token") || "",
    cppId: localStorage.getItem("se_cpp_id") || "",
    csharpId: localStorage.getItem("se_csharp_id") || "",
    pythonId: localStorage.getItem("se_python_id") || ""
  };
}

function setSeSettings(data) {
  localStorage.setItem("se_endpoint", data.endpoint);
  localStorage.setItem("se_token", data.token);
  localStorage.setItem("se_cpp_id", data.cppId);
  localStorage.setItem("se_csharp_id", data.csharpId);
  localStorage.setItem("se_python_id", data.pythonId);
}

async function runSphereEngine() {
  const status = document.getElementById("se-status");
  if (document.body.dataset.lessonPlusLocked === "1") {
    if (status) status.textContent = "Компилятор доступен с подпиской Плюс на уровнях 2–4";
    return;
  }

  let endpoint = document.getElementById("se-endpoint")?.value.trim();
  const token = document.getElementById("se-token")?.value.trim();
  const cppId = document.getElementById("se-cpp-id")?.value.trim();
  const csharpId = document.getElementById("se-csharp-id")?.value.trim();
  const pythonId = document.getElementById("se-python-id")?.value.trim();
  const lang = document.getElementById("se-lang")?.value;
  const code = document.getElementById("se-code")?.value || "";
  const output = document.getElementById("se-output");

  if (!endpoint || !token) {
    if (status) status.textContent = "Заполните endpoint и token";
    return;
  }

  const compilerId = lang === "cpp" ? cppId : lang === "csharp" ? csharpId : pythonId;
  if (!compilerId) {
    if (status) status.textContent = "Укажите compilerId для выбранного языка";
    return;
  }

  endpoint = endpoint.replace(/\/$/, "");

  if (status) status.textContent = "Отправка...";
  if (output) output.textContent = "";

  try {
    const submitRes = await fetch(`${endpoint}/api/v4/submissions?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        compilerId,
        source: code
      })
    });

    const submitData = await submitRes.json();
    if (!submitRes.ok) throw submitData;

    if (status) status.textContent = "Выполнение...";

    const submissionId = submitData.id;
    await new Promise((r) => setTimeout(r, 1500));

    const resultRes = await fetch(`${endpoint}/api/v4/submissions/${submissionId}?access_token=${token}`);
    const result = await resultRes.json();

    if (!resultRes.ok) throw result;

    const statusDesc = result.result?.status?.name || result.result?.status?.description || "ok";
    if (status) status.textContent = `Статус: ${statusDesc}`;

    const outputUri = result.result?.streams?.output?.uri;
    const errorUri = result.result?.streams?.error?.uri || result.result?.streams?.cmpinfo?.uri;

    let outText = "";
    if (outputUri) {
      const outRes = await fetch(outputUri);
      outText = await outRes.text();
    }
    if (errorUri) {
      const errRes = await fetch(errorUri);
      const errText = await errRes.text();
      if (errText) outText += `\n[stderr]\n${errText}`;
    }
    if (output) output.textContent = outText || "(пустой вывод)";
  } catch (err) {
    if (status) status.textContent = "Ошибка запуска (проверьте доступ и CORS)";
    if (output) output.textContent = JSON.stringify(err, null, 2);
  }
}

function initSphereEngineForm() {
  const settings = getSeSettings();
  const endpoint = document.getElementById("se-endpoint");
  const token = document.getElementById("se-token");
  const cppId = document.getElementById("se-cpp-id");
  const csharpId = document.getElementById("se-csharp-id");
  const pythonId = document.getElementById("se-python-id");

  if (endpoint) endpoint.value = settings.endpoint;
  if (token) token.value = settings.token;
  if (cppId) cppId.value = settings.cppId;
  if (csharpId) csharpId.value = settings.csharpId;
  if (pythonId) pythonId.value = settings.pythonId;

  const saveBtn = document.getElementById("se-save");
  saveBtn?.addEventListener("click", () => {
    setSeSettings({
      endpoint: endpoint?.value.trim() || "",
      token: token?.value.trim() || "",
      cppId: cppId?.value.trim() || "",
      csharpId: csharpId?.value.trim() || "",
      pythonId: pythonId?.value.trim() || ""
    });
    const status = document.getElementById("se-status");
    if (status) status.textContent = "Настройки сохранены";
  });

  const runBtn = document.getElementById("se-run");
  runBtn?.addEventListener("click", runSphereEngine);
}

function initLoginRoleOptions() {
  const registerCheckbox = document.getElementById("login-register");
  const adminCheckbox = document.getElementById("login-admin");
  const adminCodeRow = document.getElementById("admin-code-row");
  if (!registerCheckbox || !adminCheckbox || !adminCodeRow) return;

  const sync = () => {
    const shouldShow = registerCheckbox.checked && adminCheckbox.checked;
    adminCodeRow.classList.toggle("hidden", !shouldShow);
  };

  registerCheckbox.addEventListener("change", sync);
  adminCheckbox.addEventListener("change", sync);
  sync();
}

async function loadAdminPanel() {
  const root = document.getElementById("admin-root");
  if (!root) return;
  const user = getUser();
  if (!user) {
    root.innerHTML = "<div class=\"alert\">Требуется вход. Перейдите на страницу авторизации.</div>";
    return;
  }
  if (user.role !== "admin") {
    root.innerHTML = "<div class=\"alert\">Доступ запрещен. Нужна роль администратора.</div>";
    return;
  }

  try {
    const overview = await api("/admin/overview");
    const content = await api("/admin/content");
    const users = overview.users || [];
    const metrics = overview.metrics || {};
    const events = overview.recentEvents || [];
    const courses = content.courses || [];
    const modules = content.modules || [];
    const lessons = content.lessons || [];
    const levelOptions = ["Beginner", "Basic", "Intermediate", "Advanced"];
    const escapeHtml = (value) => String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    const courseById = new Map(courses.map((item) => [item.id, item]));
    const moduleById = new Map(modules.map((item) => [item.id, item]));

    const courseOptionsHtml = courses
      .map((item) => `<option value="${item.id}">${item.title}</option>`)
      .join("");

    const moduleOptionsHtml = modules
      .map((item) => {
        const course = courseById.get(item.courseId);
        const label = `${course ? course.title : "Unknown"} / ${item.title}`;
        return `<option value="${item.id}">${escapeHtml(label)}</option>`;
      })
      .join("");

    root.innerHTML = `
      <div class="panel-title">Метрики платформы</div>
      <div class="admin-metrics">
        <div class="admin-metric"><div class="meta">Пользователи</div><strong>${metrics.totalUsers ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Новые 7д</div><strong>${metrics.newUsers7d ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Активные 7д</div><strong>${metrics.activeUsers7d ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Курсы</div><strong>${metrics.totalCourses ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Модули</div><strong>${metrics.totalModules ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Уроки</div><strong>${metrics.totalLessons ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Отправки</div><strong>${metrics.totalSubmissions ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Попытки тестов</div><strong>${metrics.totalAttempts ?? 0}</strong></div>
        <div class="admin-metric"><div class="meta">Темы форума</div><strong>${metrics.totalThreads ?? 0}</strong></div>
      </div>
      <div class="panel-title">Последние события</div>
      <div class="admin-events" id="admin-events-list">
        ${events.map((event) => `<div class="admin-event"><strong>${event.type}</strong><span>${event.message}</span><span class="meta">${event.createdAt}</span></div>`).join("")}
      </div>
      <div class="panel-title">Пользователи и роли</div>
      <div class="meta">Всего: ${users.length}</div>
      <div class="admin-list" id="admin-users-list"></div>

      <div class="panel-title">Контент-менеджер</div>
      <div class="admin-content-grid">
        <div class="admin-content-box">
          <div class="meta">Добавить курс</div>
          <form class="form" id="admin-create-course-form">
            <input name="title" placeholder="Название курса" required />
            <input name="language" placeholder="Язык (например C++)" required />
            <select name="level">${levelOptions.map((item) => `<option value="${item}">${item}</option>`).join("")}</select>
            <textarea name="description" placeholder="Описание"></textarea>
            <button class="primary small" type="submit">Создать курс</button>
          </form>
        </div>
        <div class="admin-content-box">
          <div class="meta">Добавить модуль</div>
          <form class="form" id="admin-create-module-form">
            <select name="courseId" required>${courseOptionsHtml}</select>
            <input name="title" placeholder="Название модуля" required />
            <input name="sortOrder" type="number" min="1" value="1" />
            <button class="primary small" type="submit">Создать модуль</button>
          </form>
        </div>
        <div class="admin-content-box">
          <div class="meta">Добавить урок</div>
          <form class="form" id="admin-create-lesson-form">
            <select name="moduleId" required>${moduleOptionsHtml}</select>
            <input name="title" placeholder="Название урока" required />
            <textarea name="content" placeholder="Содержимое урока" required></textarea>
            <input name="videoUrl" placeholder="Ссылка на видео (опционально)" />
            <button class="primary small" type="submit">Создать урок</button>
          </form>
        </div>
      </div>

      <div class="panel-title">Курсы</div>
      <div class="admin-list" id="admin-courses-list"></div>
      <div class="panel-title">Модули</div>
      <div class="admin-list" id="admin-modules-list"></div>
      <div class="panel-title">Уроки</div>
      <div class="admin-list" id="admin-lessons-list"></div>
    `;

    const list = document.getElementById("admin-users-list");
    const roles = ["student", "reviewer", "instructor", "admin"];
    users.forEach((item) => {
      const row = document.createElement("div");
      row.className = "admin-user";
      row.innerHTML = `
        <div>
          <div><strong>${item.email}</strong></div>
          <div class="meta">${item.id}</div>
        </div>
        <select data-user-role="${item.id}">
          ${roles.map((role) => `<option value="${role}" ${item.role === role ? "selected" : ""}>${role}</option>`).join("")}
        </select>
        <button class="ghost small" data-save-role="${item.id}">Сохранить</button>
      `;
      list?.appendChild(row);
    });

    root.querySelectorAll("[data-save-role]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const userId = event.currentTarget.getAttribute("data-save-role");
        const select = root.querySelector(`[data-user-role="${userId}"]`);
        const role = select?.value;
        if (!userId || !role) return;
        const updated = await api(`/users/${userId}/role`, {
          method: "PATCH",
          body: JSON.stringify({ role })
        });
        const current = getUser();
        if (current && current.id === updated.id) {
          setUser(updated);
          updateAuthStatus();
        }
        const status = document.createElement("div");
        status.className = "meta";
        status.textContent = "Роль обновлена";
        root.prepend(status);
        setTimeout(() => status.remove(), 1500);
      });
    });

    const coursesList = document.getElementById("admin-courses-list");
    courses.forEach((item) => {
      const row = document.createElement("div");
      row.className = "admin-user";
      row.innerHTML = `
        <div>
          <div><strong>${item.title}</strong></div>
          <div class="meta">${item.id}</div>
        </div>
        <div class="admin-inline-fields">
          <input data-course-title="${item.id}" value="${item.title}" />
          <input data-course-language="${item.id}" value="${item.language}" />
          <select data-course-level="${item.id}">
            ${levelOptions.map((level) => `<option value="${level}" ${item.level === level ? "selected" : ""}>${level}</option>`).join("")}
          </select>
          <input data-course-description="${item.id}" value="${item.description || ""}" />
        </div>
        <div class="admin-inline-actions">
          <button class="ghost small" data-save-course="${item.id}">Сохранить</button>
          <button class="ghost small" data-delete-course="${item.id}">Удалить</button>
        </div>
      `;
      coursesList?.appendChild(row);
    });

    const modulesList = document.getElementById("admin-modules-list");
    modules.forEach((item) => {
      const row = document.createElement("div");
      row.className = "admin-user";
      row.innerHTML = `
        <div>
          <div><strong>${item.title}</strong></div>
          <div class="meta">${item.id}</div>
        </div>
        <div class="admin-inline-fields">
          <select data-module-course="${item.id}">
            ${courses.map((course) => `<option value="${course.id}" ${course.id === item.courseId ? "selected" : ""}>${course.title}</option>`).join("")}
          </select>
          <input data-module-title="${item.id}" value="${item.title}" />
          <input data-module-sort-order="${item.id}" type="number" value="${item.sortOrder || 1}" />
        </div>
        <div class="admin-inline-actions">
          <button class="ghost small" data-save-module="${item.id}">Сохранить</button>
          <button class="ghost small" data-delete-module="${item.id}">Удалить</button>
        </div>
      `;
      modulesList?.appendChild(row);
    });

    const lessonsList = document.getElementById("admin-lessons-list");
    lessons.forEach((item) => {
      const row = document.createElement("div");
      row.className = "admin-user";
      const currentModule = moduleById.get(item.moduleId);
      const currentCourse = currentModule ? courseById.get(currentModule.courseId) : null;
      const scope = `${currentCourse ? currentCourse.title : "Unknown"} / ${currentModule ? currentModule.title : "Unknown"}`;
      const safeTitle = escapeHtml(item.title || "");
      const safeVideoUrl = escapeHtml(item.videoUrl || "");
      const safeContent = escapeHtml(item.content || "");
      const shortContent = escapeHtml((item.content || "").slice(0, 90));
      row.innerHTML = `
        <div>
          <div><strong>${safeTitle}</strong></div>
          <div class="meta">${item.id}</div>
          <div class="meta">${scope}</div>
        </div>
        <div class="admin-inline-fields">
          <select data-lesson-module="${item.id}">
            ${modules.map((module) => {
              const course = courseById.get(module.courseId);
              const label = `${course ? course.title : "Unknown"} / ${module.title}`;
              return `<option value="${module.id}" ${module.id === item.moduleId ? "selected" : ""}>${label}</option>`;
            }).join("")}
          </select>
          <input data-lesson-title="${item.id}" value="${safeTitle}" />
          <input data-lesson-video-url="${item.id}" value="${safeVideoUrl}" placeholder="video url" />
          <textarea data-lesson-content="${item.id}" rows="2">${shortContent || safeContent}</textarea>
        </div>
        <div class="admin-inline-actions">
          <button class="ghost small" data-save-lesson="${item.id}">Сохранить</button>
          <button class="ghost small" data-delete-lesson="${item.id}">Удалить</button>
        </div>
      `;
      lessonsList?.appendChild(row);
    });

    const createCourseForm = document.getElementById("admin-create-course-form");
    createCourseForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      await api("/admin/content/courses", {
        method: "POST",
        body: JSON.stringify({
          title: form.get("title"),
          language: form.get("language"),
          level: form.get("level"),
          description: form.get("description")
        })
      });
      await loadAdminPanel();
    });

    const createModuleForm = document.getElementById("admin-create-module-form");
    createModuleForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      await api("/admin/content/modules", {
        method: "POST",
        body: JSON.stringify({
          courseId: form.get("courseId"),
          title: form.get("title"),
          sortOrder: Number(form.get("sortOrder")) || 1
        })
      });
      await loadAdminPanel();
    });

    const createLessonForm = document.getElementById("admin-create-lesson-form");
    createLessonForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      await api("/admin/content/lessons", {
        method: "POST",
        body: JSON.stringify({
          moduleId: form.get("moduleId"),
          title: form.get("title"),
          content: form.get("content"),
          videoUrl: form.get("videoUrl")
        })
      });
      await loadAdminPanel();
    });

    root.querySelectorAll("[data-save-course]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const courseId = event.currentTarget.getAttribute("data-save-course");
        if (!courseId) return;
        const title = root.querySelector(`[data-course-title="${courseId}"]`)?.value;
        const language = root.querySelector(`[data-course-language="${courseId}"]`)?.value;
        const level = root.querySelector(`[data-course-level="${courseId}"]`)?.value;
        const description = root.querySelector(`[data-course-description="${courseId}"]`)?.value;
        await api(`/admin/content/courses/${courseId}`, {
          method: "PATCH",
          body: JSON.stringify({ title, language, level, description })
        });
        await loadAdminPanel();
      });
    });

    root.querySelectorAll("[data-delete-course]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const courseId = event.currentTarget.getAttribute("data-delete-course");
        if (!courseId) return;
        await api(`/admin/content/courses/${courseId}`, { method: "DELETE" });
        await loadAdminPanel();
      });
    });

    root.querySelectorAll("[data-save-module]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const moduleId = event.currentTarget.getAttribute("data-save-module");
        if (!moduleId) return;
        const courseId = root.querySelector(`[data-module-course="${moduleId}"]`)?.value;
        const title = root.querySelector(`[data-module-title="${moduleId}"]`)?.value;
        const sortOrder = root.querySelector(`[data-module-sort-order="${moduleId}"]`)?.value;
        await api(`/admin/content/modules/${moduleId}`, {
          method: "PATCH",
          body: JSON.stringify({ courseId, title, sortOrder: Number(sortOrder) || 1 })
        });
        await loadAdminPanel();
      });
    });

    root.querySelectorAll("[data-delete-module]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const moduleId = event.currentTarget.getAttribute("data-delete-module");
        if (!moduleId) return;
        await api(`/admin/content/modules/${moduleId}`, { method: "DELETE" });
        await loadAdminPanel();
      });
    });

    root.querySelectorAll("[data-save-lesson]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const lessonId = event.currentTarget.getAttribute("data-save-lesson");
        if (!lessonId) return;
        const moduleId = root.querySelector(`[data-lesson-module="${lessonId}"]`)?.value;
        const title = root.querySelector(`[data-lesson-title="${lessonId}"]`)?.value;
        const videoUrl = root.querySelector(`[data-lesson-video-url="${lessonId}"]`)?.value;
        const contentValue = root.querySelector(`[data-lesson-content="${lessonId}"]`)?.value;
        await api(`/admin/content/lessons/${lessonId}`, {
          method: "PATCH",
          body: JSON.stringify({ moduleId, title, content: contentValue, videoUrl })
        });
        await loadAdminPanel();
      });
    });

    root.querySelectorAll("[data-delete-lesson]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const lessonId = event.currentTarget.getAttribute("data-delete-lesson");
        if (!lessonId) return;
        await api(`/admin/content/lessons/${lessonId}`, { method: "DELETE" });
        await loadAdminPanel();
      });
    });
  } catch {
    root.innerHTML = "<div class=\"alert\">Не удалось загрузить данные админ-панели.</div>";
  }
}

window.addEventListener("load", async () => {
  initThemeToggle();
  initMotionSystem();
  initHeroSpotlight();
  initMainMenu();
  await refreshCurrentUser();
  updateAuthStatus();
  loadCourses();
  initCatalogPage();
  initPlusPanelControls();
  loadDashboard();
  if (document.getElementById("task-select")) {
    initTaskAutosave();
    loadTasks();
  }

  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  searchBtn?.addEventListener("click", handleSearch);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  const taskSelect = document.getElementById("task-select");
  taskSelect?.addEventListener("change", handleTaskChange);
  const submitBtn = document.getElementById("submit-task-btn");
  submitBtn?.addEventListener("click", submitTask);

  const loginForm = document.getElementById("login-form");
  loginForm?.addEventListener("submit", handleLoginForm);
  initLoginRoleOptions();

  if (document.title.startsWith("C++")) renderCurriculum("C++");
  if (document.title.startsWith("C#")) renderCurriculum("C#");
  if (document.title.startsWith("HTML/CSS/JavaScript")) renderCurriculum("HTML/CSS/JavaScript");
  if (document.title.startsWith("Анализ данных")) renderCurriculum("Data Analysis");

  if (document.title.startsWith("Урок")) {
    initSphereEngineForm();
    loadLessonPage();
  }

  if (document.title.startsWith("Админ")) {
    loadAdminPanel();
  }

  if (document.title.startsWith("Тест")) {
    loadTestPage();
  }

  initForumPage();
});
