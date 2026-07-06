const DZV = {
  regionConfig: {
    "서울특별시": {
      "강남구": [],
      "서초구": [],
      "송파구": []
    },
    "인천광역시": {
      "부평구": ["부평점", "삼산점", "동암역점"],
      "계양구": ["계양점"],
      "연수구": ["송도점"],
      "서구": ["청라점"],
      "중구": ["인천역점"]
    }
  },

  getAllBranches() {
    const branches = [];
    Object.values(this.regionConfig).forEach((districts) => {
      Object.values(districts).forEach((list) => {
        branches.push(...list);
      });
    });
    return branches;
  },

  postStyles: {
    promotion: {
      id: "promotion",
      title: "지점별 홍보용",
      desc: "지점 특성을 강조한 홍보 게시글"
    },
    review: {
      id: "review",
      title: "방문 후기",
      desc: "방문자 관점의 생생한 후기 글"
    },
    franchise: {
      id: "franchise",
      title: "창업 유도",
      desc: "창업·가맹 문의 유도 홍보 글"
    }
  },

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  showToast(message, type = "info") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  formatTime(date) {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  },

  formatRelativeTime(minutesAgo) {
    if (minutesAgo < 1) return "방금 전";
    if (minutesAgo < 60) return `${minutesAgo}분 전`;
    const hours = Math.floor(minutesAgo / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  },

  saveState(key, data) {
    try {
      localStorage.setItem(`dzv_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
  },

  loadState(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`dzv_${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  navIconSvg(name) {
    const svg = (paths) =>
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    const icons = {
      home: svg('<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/>'),
      studio: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
      monitor: svg('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
      accounts: svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
      sentiment: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
      keywords: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
      cafe: svg('<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3"/><path d="M10 1v3"/><path d="M14 1v3"/>'),
      content: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>'),
      telegram: svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>')
    };
    return icons[name] || icons.home;
  },

  resolveNavIcon(item) {
    if (item.dataset.icon) return item.dataset.icon;
    if (item.dataset.section) return item.dataset.section;
    const href = item.getAttribute("href") || "";
    if (href.includes("accounts")) return "accounts";
    if (href.includes("blog")) return "studio";
    if (href.includes("server")) return "monitor";
    if (href === "../" || href === "./" || href === "/") return "home";
    return "home";
  },

  initSidebar() {
    const layout = document.querySelector(".app-layout");
    const sidebar = document.querySelector(".sidebar");
    if (!layout || !sidebar) return;

    sidebar.querySelectorAll(".nav-item").forEach((item) => {
      if (!item.querySelector(".nav-item-icon")) {
        const icon = document.createElement("span");
        icon.className = "nav-item-icon";
        icon.innerHTML = this.navIconSvg(this.resolveNavIcon(item));
        item.prepend(icon);
      }

      if (!item.querySelector(".nav-item-text")) {
        const label = [...item.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent)
          .join("")
          .trim();
        item.childNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) n.remove();
        });
        if (label) {
          const span = document.createElement("span");
          span.className = "nav-item-text";
          span.textContent = label;
          item.appendChild(span);
          item.setAttribute("title", label);
        }
      }
    });

    const toggleIcon =
      '<svg class="sidebar-collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';

    let toggle = document.getElementById("sidebarToggle");
    if (!toggle) {
      const toolbar = document.createElement("div");
      toolbar.className = "sidebar-toolbar";

      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "sidebar-collapse-btn";
      toggle.id = "sidebarToggle";
      toggle.innerHTML = toggleIcon;

      toolbar.appendChild(toggle);
      sidebar.insertBefore(toolbar, sidebar.firstChild);
    } else {
      toggle.className = "sidebar-collapse-btn";
      const icon = toggle.querySelector("svg");
      if (icon) icon.classList.add("sidebar-collapse-icon");
    }

    const applyCollapsed = (collapsed) => {
      layout.classList.toggle("sidebar-collapsed", collapsed);
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
      toggle.setAttribute("aria-label", collapsed ? "사이드바 펼치기" : "사이드바 접기");
    };

    applyCollapsed(DZV.loadState("sidebar_collapsed", false));

    toggle.addEventListener("click", () => {
      const collapsed = !layout.classList.contains("sidebar-collapsed");
      applyCollapsed(collapsed);
      DZV.saveState("sidebar_collapsed", collapsed);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => DZV.initSidebar());
