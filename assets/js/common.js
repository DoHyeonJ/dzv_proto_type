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
      telegram: svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'),
      activity: svg('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>')
    };
    return icons[name] || icons.home;
  },

  resolveNavIcon(item) {
    if (item.dataset.icon) return item.dataset.icon;
    if (item.dataset.section) return item.dataset.section;
    const href = item.getAttribute("href") || "";
    if (href.includes("accounts")) return "accounts";
    if (href.includes("activity")) return "activity";
    if (href.includes("blog")) return "studio";
    if (href.includes("server")) return "monitor";
    if (href === "../" || href === "./" || href === "/") return "home";
    return "home";
  },

  roleLabels: {
    hq: "본사 관리자",
    owner: "점주",
    manager: "지점 매니저"
  },

  defaultCurrentUser: {
    id: "acc-1",
    name: "김본사",
    loginId: "admin",
    role: "hq",
    branch: "본사"
  },

  accountDefaults: [
    { id: "acc-1", name: "김본사", loginId: "admin", password: "1234", role: "hq", branch: "본사", status: "active", lastLogin: "2026-07-06 09:12" },
    { id: "acc-2", name: "이관리", loginId: "hq_staff", password: "1234", role: "hq", branch: "본사", status: "active", lastLogin: "2026-07-06 08:45" },
    { id: "acc-3", name: "박점주", loginId: "gangnam", password: "1234", role: "owner", branch: "강남역점", status: "active", lastLogin: "2026-07-05 18:30" },
    { id: "acc-4", name: "최점주", loginId: "yeoksam", password: "1234", role: "owner", branch: "역삼점", status: "active", lastLogin: "2026-07-06 07:20" },
    { id: "acc-5", name: "정매니저", loginId: "bundang", password: "1234", role: "manager", branch: "분당정자점", status: "active", lastLogin: "2026-07-04 14:00" },
    { id: "acc-6", name: "한매니저", loginId: "ilsan", password: "1234", role: "manager", branch: "일산점", status: "inactive", lastLogin: "2026-06-28 11:15" }
  ],

  ensureAccounts() {
    if (!this.loadState("accounts", null)) {
      this.saveAccounts(JSON.parse(JSON.stringify(this.accountDefaults)));
    }
  },

  normalizeAccount(account) {
    const copy = { ...account };
    if (copy.email && !copy.loginId) {
      copy.loginId = copy.email.split("@")[0];
      delete copy.email;
    }
    if (!copy.password) copy.password = "1234";
    return copy;
  },

  getAccounts() {
    this.ensureAccounts();
    const raw = this.loadState("accounts", []);
    const accounts = raw.map((a) => this.normalizeAccount(a));
    if (raw.some((a) => a.email)) {
      this.saveAccounts(accounts);
    }
    return accounts;
  },

  saveAccounts(accounts) {
    this.saveState("accounts", accounts);
  },

  getAccountById(id) {
    return this.getAccounts().find((a) => a.id === id);
  },

  isLoginIdAvailable(loginId, excludeId = null) {
    const normalized = loginId.trim().toLowerCase();
    return !this.getAccounts().some(
      (a) => a.loginId.toLowerCase() === normalized && a.id !== excludeId
    );
  },

  changePassword(accountId, currentPassword, newPassword) {
    const accounts = this.getAccounts();
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return { ok: false, message: "계정을 찾을 수 없습니다" };
    if (account.password !== currentPassword) {
      return { ok: false, message: "현재 비밀번호가 일치하지 않습니다" };
    }
    if (newPassword.length < 4) {
      return { ok: false, message: "새 비밀번호는 4자 이상이어야 합니다" };
    }
    account.password = newPassword;
    this.saveAccounts(accounts);
    return { ok: true };
  },

  getCurrentUser() {
    const stored = this.loadState("current_user", {});
    const user = { ...this.defaultCurrentUser, ...stored };
    if (user.email && !user.loginId) {
      user.loginId = user.email.split("@")[0];
      delete user.email;
      this.saveState("current_user", user);
    }
    const account = this.getAccountById(user.id);
    if (account) {
      user.name = account.name;
      user.loginId = account.loginId;
      user.role = account.role;
      user.branch = account.branch;
    }
    return user;
  },

  setCurrentUser(user) {
    this.saveState("current_user", user);
    this.renderSidebarAccount();
  },

  getAccountsHref() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/blog/")) return "../server/accounts.html";
    if (path.includes("/server/")) return "accounts.html";
    return "server/accounts.html";
  },

  getActivityHref() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/blog/")) return "../server/activity.html";
    if (path.includes("/server/")) return "activity.html";
    return "server/activity.html";
  },

  isHqAdmin() {
    return this.getCurrentUser().role === "hq";
  },

  activityCategories: {
    account: { label: "계정", badge: "activity-badge--account" },
    content: { label: "콘텐츠", badge: "activity-badge--content" },
    monitor: { label: "모니터링", badge: "activity-badge--monitor" },
    telegram: { label: "텔레그램", badge: "activity-badge--telegram" },
    auth: { label: "인증", badge: "activity-badge--auth" }
  },

  activityDefaults: [
    { id: "act-1", accountId: "acc-1", accountName: "김본사", loginId: "admin", role: "hq", branch: "본사", category: "telegram", action: "텔레그램 설정 저장", detail: "여론·키워드·카페 자동 발송 조건을 수정했습니다", target: "항목별 자동 발송", createdAt: "2026-07-07T09:15:00.000Z" },
    { id: "act-2", accountId: "acc-2", accountName: "이관리", loginId: "hq_staff", role: "hq", branch: "본사", category: "monitor", action: "모니터링 새로고침", detail: "실시간 모니터링 데이터를 수동 갱신했습니다", target: "통합 관제", createdAt: "2026-07-07T08:52:00.000Z" },
    { id: "act-3", accountId: "acc-3", accountName: "박점주", loginId: "gangnam", role: "owner", branch: "강남역점", category: "content", action: "게시글 생성", detail: "강남역점 홍보 게시글을 AI로 생성했습니다", target: "지점별 홍보용", createdAt: "2026-07-07T08:30:00.000Z" },
    { id: "act-4", accountId: "acc-3", accountName: "박점주", loginId: "gangnam", role: "owner", branch: "강남역점", category: "content", action: "게시글 업로드", detail: "생성한 게시글을 블로그에 업로드했습니다", target: "강남 휴대폰 성지 후기", createdAt: "2026-07-07T08:35:00.000Z" },
    { id: "act-5", accountId: "acc-4", accountName: "최점주", loginId: "yeoksam", role: "owner", branch: "역삼점", category: "monitor", action: "카페 게시글 열람", detail: "부정글 모니터링 상세를 확인했습니다", target: "옆커폰 간판을 달고있더라도", createdAt: "2026-07-07T07:48:00.000Z" },
    { id: "act-6", accountId: "acc-1", accountName: "김본사", loginId: "admin", role: "hq", branch: "본사", category: "account", action: "계정 수정", detail: "정매니저 계정 권한 정보를 수정했습니다", target: "@bundang", createdAt: "2026-07-06T18:20:00.000Z" },
    { id: "act-7", accountId: "acc-5", accountName: "정매니저", loginId: "bundang", role: "manager", branch: "분당정자점", category: "content", action: "형식 학습", detail: "블로그 URL로 게시글 형식을 학습했습니다", target: "네이버 블로그 샘플", createdAt: "2026-07-06T16:10:00.000Z" },
    { id: "act-8", accountId: "acc-5", accountName: "정매니저", loginId: "bundang", role: "manager", branch: "분당정자점", category: "content", action: "게시글 생성", detail: "분당정자점 방문 후기 게시글을 생성했습니다", target: "방문 후기", createdAt: "2026-07-06T16:25:00.000Z" },
    { id: "act-9", accountId: "acc-2", accountName: "이관리", loginId: "hq_staff", role: "hq", branch: "본사", category: "telegram", action: "일일 보고서 발송", detail: "일일 종합 보고서를 텔레그램으로 발송했습니다", target: "본사 관제방", createdAt: "2026-07-06T09:05:00.000Z" },
    { id: "act-10", accountId: "acc-4", accountName: "최점주", loginId: "yeoksam", role: "owner", branch: "역삼점", category: "content", action: "게시글 생성", detail: "역삼점 아이폰16 홍보 게시글을 생성했습니다", target: "지점별 홍보용", createdAt: "2026-07-05T14:40:00.000Z" },
    { id: "act-11", accountId: "acc-1", accountName: "김본사", loginId: "admin", role: "hq", branch: "본사", category: "auth", action: "비밀번호 변경", detail: "계정 비밀번호를 변경했습니다", target: "@admin", createdAt: "2026-07-05T11:00:00.000Z" },
    { id: "act-12", accountId: "acc-6", accountName: "한매니저", loginId: "ilsan", role: "manager", branch: "일산점", category: "monitor", action: "키워드 노출 조회", detail: "일산 번호이동 키워드 순위를 확인했습니다", target: "통합검색", createdAt: "2026-07-04T10:22:00.000Z" }
  ],

  ensureActivities() {
    if (this.loadState("activity_logs", null)) return;

    const legacy = this.loadState("server_activity", []);
    const migrated = legacy.map((item, i) => ({
      id: `act-mig-${Date.now()}-${i}`,
      accountId: "acc-3",
      accountName: "박점주",
      loginId: "gangnam",
      role: "owner",
      branch: "강남역점",
      category: "content",
      action: "게시글 업로드",
      detail: item.title ? `"${item.title}" 게시글을 업로드했습니다` : "게시글을 업로드했습니다",
      target: item.branch || item.style || "",
      createdAt: item.time || new Date().toISOString()
    }));

    this.saveState("activity_logs", [...migrated, ...JSON.parse(JSON.stringify(this.activityDefaults))]);
  },

  getActivities() {
    this.ensureActivities();
    return this.loadState("activity_logs", []);
  },

  logActivity({ category, action, detail, target = "", accountId = null }) {
    const account = accountId ? this.getAccountById(accountId) : this.getCurrentUser();
    if (!account) return;

    const entry = {
      id: `act-${Date.now()}`,
      accountId: account.id,
      accountName: account.name,
      loginId: account.loginId,
      role: account.role,
      branch: account.branch,
      category,
      action,
      detail,
      target,
      createdAt: new Date().toISOString()
    };

    const logs = this.getActivities();
    logs.unshift(entry);
    this.saveState("activity_logs", logs.slice(0, 200));
    return entry;
  },

  formatActivityDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  },

  applyRoleBasedNav() {
    const isHq = this.isHqAdmin();
    document.querySelectorAll("[data-hq-only]").forEach((el) => {
      el.classList.toggle("nav-item--hidden", !isHq);
    });
    document.querySelectorAll("[data-hq-only-header]").forEach((el) => {
      el.classList.toggle("site-header-nav--hidden", !isHq);
    });
  },

  guardHqPage(redirectHref = null) {
    if (this.isHqAdmin()) return true;
    const path = window.location.pathname.replace(/\\/g, "/");
    const fallback = redirectHref || (path.includes("/blog/") ? "../server/" : path.includes("/server/") ? "./" : "server/");
    window.location.replace(fallback);
    return false;
  },

  getUserInitials(name) {
    if (!name) return "?";
    return name.trim().charAt(0);
  },

  renderSidebarAccount() {
    const footer = document.querySelector(".sidebar-footer");
    if (!footer) return;

    let wrap = document.getElementById("sidebarAccountWrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "sidebar-account-wrap";
      wrap.id = "sidebarAccountWrap";
      footer.insertBefore(wrap, footer.firstChild);
    }

    const user = this.getCurrentUser();
    const roleLabel = this.roleLabels[user.role] || "사용자";
    const branchLabel = user.role !== "hq" && user.branch ? user.branch : "";
    const accountsHref = this.getAccountsHref();

    wrap.innerHTML = `
      <a class="sidebar-account" id="sidebarAccount" href="${accountsHref}" title="${user.name} · ${roleLabel}">
        <div class="sidebar-account-avatar sidebar-account-avatar--${user.role}" aria-hidden="true">${this.getUserInitials(user.name)}</div>
        <div class="sidebar-account-details">
          <div class="sidebar-account-name">${user.name}</div>
          <div class="sidebar-account-meta">
            <span class="sidebar-account-role sidebar-account-role--${user.role}">${roleLabel}</span>
            ${branchLabel ? `<span class="sidebar-account-branch">${branchLabel}</span>` : ""}
          </div>
          <div class="sidebar-account-login">@${user.loginId}</div>
        </div>
      </a>
      <button type="button" class="sidebar-account-action" id="sidebarPasswordBtn" aria-label="비밀번호 변경">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span class="sidebar-account-action-text">비밀번호 변경</span>
      </button>`;

    document.getElementById("sidebarPasswordBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.openPasswordModal();
    });
  },

  initPasswordModal() {
    if (document.getElementById("passwordModal")) return;

    const modal = document.createElement("div");
    modal.className = "app-modal hidden";
    modal.id = "passwordModal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="app-modal-backdrop" data-close-password-modal></div>
      <div class="app-modal-dialog" role="dialog" aria-modal="true">
        <div class="app-modal-header">
          <h3>비밀번호 변경</h3>
          <button type="button" class="app-modal-close" data-close-password-modal aria-label="닫기">×</button>
        </div>
        <form id="passwordForm" class="app-modal-body">
          <p class="app-modal-desc" id="passwordModalDesc"></p>
          <div class="app-form-group">
            <label for="currentPassword">현재 비밀번호</label>
            <input type="password" id="currentPassword" class="form-input" required autocomplete="current-password">
          </div>
          <div class="app-form-group">
            <label for="newPassword">새 비밀번호</label>
            <input type="password" id="newPassword" class="form-input" required minlength="4" autocomplete="new-password" placeholder="4자 이상">
          </div>
          <div class="app-form-group">
            <label for="confirmPassword">새 비밀번호 확인</label>
            <input type="password" id="confirmPassword" class="form-input" required minlength="4" autocomplete="new-password">
          </div>
        </form>
        <div class="app-modal-footer">
          <button type="button" class="btn btn-secondary" data-close-password-modal>취소</button>
          <button type="submit" form="passwordForm" class="btn btn-primary" id="btnSavePassword">변경</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.querySelectorAll("[data-close-password-modal]").forEach((el) => {
      el.addEventListener("click", () => this.closePasswordModal());
    });

    document.getElementById("passwordForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.savePasswordChange();
    });
  },

  openPasswordModal() {
    const user = this.getCurrentUser();
    const modal = document.getElementById("passwordModal");
    if (!modal) return;

    document.getElementById("passwordModalDesc").textContent = `${user.name} (@${user.loginId}) 계정의 비밀번호를 변경합니다.`;
    document.getElementById("passwordForm").reset();
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.getElementById("currentPassword")?.focus();
  },

  closePasswordModal() {
    const modal = document.getElementById("passwordModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  },

  async savePasswordChange() {
    const user = this.getCurrentUser();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      DZV.showToast("새 비밀번호가 일치하지 않습니다", "error");
      return;
    }

    const btn = document.getElementById("btnSavePassword");
    btn.disabled = true;
    btn.textContent = "변경 중...";
    await DZV.delay(400);

    const result = this.changePassword(user.id, currentPassword, newPassword);
    btn.disabled = false;
    btn.textContent = "변경";

    if (!result.ok) {
      DZV.showToast(result.message, "error");
      return;
    }

    this.closePasswordModal();
    DZV.showToast("비밀번호가 변경되었습니다", "success");
    this.logActivity({ category: "auth", action: "비밀번호 변경", detail: "계정 비밀번호를 변경했습니다", target: `@${user.loginId}` });
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

    this.renderSidebarAccount();
    this.applyRoleBasedNav();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  DZV.ensureAccounts();
  DZV.ensureActivities();
  DZV.initPasswordModal();
  DZV.initSidebar();
});
