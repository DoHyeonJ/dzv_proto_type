const ActivityApp = {
  init() {
    if (!DZV.guardHqPage("../server/")) return;

    this.populateAccountFilter();
    this.renderStats();
    this.renderLog();
    this.bindEvents();
    DZV.applyRoleBasedNav();
  },

  bindEvents() {
    document.getElementById("btnRefreshActivity")?.addEventListener("click", () => {
      this.renderStats();
      this.renderLog();
      DZV.showToast("활동 로그를 갱신했습니다", "info");
    });
    document.getElementById("filterCategory")?.addEventListener("change", () => this.renderLog());
    document.getElementById("filterAccount")?.addEventListener("change", () => this.renderLog());
    document.getElementById("filterActivitySearch")?.addEventListener("input", () => this.renderLog());
  },

  populateAccountFilter() {
    const select = document.getElementById("filterAccount");
    if (!select) return;

    const accounts = DZV.getAccounts();
    select.innerHTML =
      '<option value="all">전체 계정</option>' +
      accounts
        .map((a) => `<option value="${a.id}">${a.name} (@${a.loginId})</option>`)
        .join("");
  },

  getFilteredActivities() {
    const category = document.getElementById("filterCategory")?.value || "all";
    const accountId = document.getElementById("filterAccount")?.value || "all";
    const search = (document.getElementById("filterActivitySearch")?.value || "").trim().toLowerCase();

    return DZV.getActivities().filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (accountId !== "all" && item.accountId !== accountId) return false;
      if (
        search &&
        !item.action.toLowerCase().includes(search) &&
        !item.detail.toLowerCase().includes(search) &&
        !(item.target || "").toLowerCase().includes(search) &&
        !item.accountName.toLowerCase().includes(search) &&
        !item.loginId.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });
  },

  renderStats() {
    const logs = DZV.getActivities();
    const today = new Date().toISOString().slice(0, 10);
    const todayLogs = logs.filter((l) => l.createdAt.startsWith(today));
    const accountIds = new Set(logs.map((l) => l.accountId));
    const contentCount = logs.filter((l) => l.category === "content").length;

    document.getElementById("statTotalActivity").textContent = logs.length;
    document.getElementById("statTodayActivity").textContent = todayLogs.length;
    document.getElementById("statActiveAccounts").textContent = accountIds.size;
    document.getElementById("statContentActivity").textContent = contentCount;
  },

  renderLog() {
    const container = document.getElementById("activityLog");
    const list = this.getFilteredActivities();

    if (list.length === 0) {
      container.innerHTML = '<div class="activity-empty">조회된 활동이 없습니다</div>';
      return;
    }

    container.innerHTML = list
      .map((item) => {
        const cat = DZV.activityCategories[item.category] || { label: item.category, badge: "" };
        const roleLabel = DZV.roleLabels[item.role] || item.role;
        return `
        <article class="activity-item">
          <div class="activity-item-icon activity-item-icon--${item.category}" aria-hidden="true"></div>
          <div class="activity-item-body">
            <div class="activity-item-top">
              <div class="activity-item-user">
                <span class="activity-item-name">${item.accountName}</span>
                <code class="activity-item-login">@${item.loginId}</code>
                <span class="activity-item-role activity-item-role--${item.role}">${roleLabel}</span>
              </div>
              <time class="activity-item-time">${DZV.formatActivityDate(item.createdAt)}</time>
            </div>
            <div class="activity-item-action">
              <span class="activity-badge ${cat.badge}">${cat.label}</span>
              <strong>${item.action}</strong>
            </div>
            <p class="activity-item-detail">${item.detail}</p>
            ${item.target ? `<div class="activity-item-target">${item.target}</div>` : ""}
            ${item.branch && item.role !== "hq" ? `<div class="activity-item-branch">${item.branch}</div>` : ""}
          </div>
        </article>`;
      })
      .join("");
  }
};

document.addEventListener("DOMContentLoaded", () => ActivityApp.init());
