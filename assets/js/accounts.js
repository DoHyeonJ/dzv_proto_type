const AccountsApp = {
  roles: {
    hq: {
      label: "본사 관리자",
      badge: "badge-danger",
      desc: "전 지점 모니터링, 계정 관리, 텔레그램 알림 설정, AI 콘텐츠 승인",
      permissions: ["전체 관제", "계정 CRUD", "알림 발송", "콘텐츠 승인"]
    },
    owner: {
      label: "점주",
      badge: "badge-warning",
      desc: "소속 지점 모니터링·콘텐츠 생성, 지점 직원 계정 관리",
      permissions: ["지점 모니터링", "콘텐츠 생성", "카페 답변", "지점 매니저 관리"]
    },
    manager: {
      label: "지점 매니저",
      badge: "badge-info",
      desc: "소속 지점 콘텐츠 생성 및 카페 모니터링 열람",
      permissions: ["콘텐츠 생성", "카페 열람", "여론 조회"]
    }
  },

  deleteTargetId: null,

  init() {
    DZV.ensureAccounts();
    this.renderRoleGuide();
    this.renderStats();
    this.renderTable();
    this.bindEvents();
  },

  get accounts() {
    return DZV.getAccounts();
  },

  bindEvents() {
    document.getElementById("btnAddAccount")?.addEventListener("click", () => this.openModal());
    document.getElementById("accountForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveAccount();
    });
    document.getElementById("filterRole")?.addEventListener("change", () => this.renderTable());
    document.getElementById("filterSearch")?.addEventListener("input", () => this.renderTable());
    document.getElementById("accountRole")?.addEventListener("change", () => this.toggleBranchField());
    document.getElementById("btnConfirmDelete")?.addEventListener("click", () => this.confirmDelete());

    document.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", () => this.closeModals());
    });
  },

  getFilteredAccounts() {
    const role = document.getElementById("filterRole")?.value || "all";
    const search = (document.getElementById("filterSearch")?.value || "").trim().toLowerCase();
    return this.accounts.filter((a) => {
      if (role !== "all" && a.role !== role) return false;
      if (
        search &&
        !a.name.toLowerCase().includes(search) &&
        !a.loginId.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });
  },

  renderStats() {
    document.getElementById("statTotalAccounts").textContent = this.accounts.length;
    document.getElementById("statHq").textContent = this.accounts.filter((a) => a.role === "hq").length;
    document.getElementById("statOwner").textContent = this.accounts.filter((a) => a.role === "owner").length;
    document.getElementById("statManager").textContent = this.accounts.filter((a) => a.role === "manager").length;
  },

  renderRoleGuide() {
    document.getElementById("roleGuide").innerHTML = Object.entries(this.roles)
      .map(
        ([key, r]) => `
      <div class="role-guide-card">
        <div class="role-guide-header">
          <span class="badge ${r.badge}">${r.label}</span>
        </div>
        <p class="role-guide-desc">${r.desc}</p>
        <ul class="role-guide-perms">
          ${r.permissions.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      </div>`
      )
      .join("");
  },

  renderTable() {
    const tbody = document.querySelector("#accountsTable tbody");
    const list = this.getFilteredAccounts();

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:40px">검색 결과가 없습니다</td></tr>`;
      return;
    }

    tbody.innerHTML = list
      .map((a) => {
        const role = this.roles[a.role];
        return `
        <tr>
          <td><strong>${a.name}</strong></td>
          <td><code class="account-login-id">${a.loginId}</code></td>
          <td><span class="badge ${role.badge}">${role.label}</span></td>
          <td>${a.branch}</td>
          <td><span class="badge ${a.status === "active" ? "badge-success" : "badge-neutral"}">${a.status === "active" ? "활성" : "비활성"}</span></td>
          <td class="text-muted">${a.lastLogin}</td>
          <td>
            <div class="account-actions">
              <button type="button" class="btn btn-ghost btn-sm btn-edit" data-id="${a.id}">수정</button>
              <button type="button" class="btn btn-ghost btn-sm btn-delete" data-id="${a.id}">삭제</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => this.openModal(btn.dataset.id));
    });
    tbody.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => this.openDeleteModal(btn.dataset.id));
    });
  },

  openModal(id) {
    const isEdit = Boolean(id);
    const account = isEdit ? this.accounts.find((a) => a.id === id) : null;
    const passwordHint = document.getElementById("accountPasswordHint");
    const passwordInput = document.getElementById("accountPassword");

    document.getElementById("accountModalTitle").textContent = isEdit ? "계정 수정" : "계정 추가";
    document.getElementById("accountId").value = account?.id || "";
    document.getElementById("accountName").value = account?.name || "";
    document.getElementById("accountLoginId").value = account?.loginId || "";
    document.getElementById("accountRole").value = account?.role || "manager";
    document.getElementById("accountBranch").value = account?.branch === "본사" ? "" : account?.branch || "";
    document.getElementById("accountStatus").value = account?.status || "active";
    passwordInput.value = "";
    passwordInput.required = !isEdit;
    if (passwordHint) {
      passwordHint.textContent = isEdit ? "변경할 때만 입력하세요" : "4자 이상";
    }

    this.toggleBranchField();
    document.getElementById("accountModal").classList.remove("hidden");
    document.getElementById("accountModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  },

  toggleBranchField() {
    const role = document.getElementById("accountRole").value;
    const group = document.getElementById("branchGroup");
    group.style.display = role === "hq" ? "none" : "block";
  },

  async saveAccount() {
    const id = document.getElementById("accountId").value;
    const name = document.getElementById("accountName").value.trim();
    const loginId = document.getElementById("accountLoginId").value.trim();
    const password = document.getElementById("accountPassword").value;
    const role = document.getElementById("accountRole").value;
    const branchVal = document.getElementById("accountBranch").value;
    const branch = role === "hq" ? "본사" : branchVal || "미지정";
    const status = document.getElementById("accountStatus").value;

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(loginId)) {
      DZV.showToast("아이디는 영문·숫자·밑줄 3~20자로 입력하세요", "error");
      return;
    }

    if (!DZV.isLoginIdAvailable(loginId, id || null)) {
      DZV.showToast("이미 사용 중인 아이디입니다", "error");
      return;
    }

    if (!id && password.length < 4) {
      DZV.showToast("비밀번호는 4자 이상이어야 합니다", "error");
      return;
    }

    if (id && password && password.length < 4) {
      DZV.showToast("비밀번호는 4자 이상이어야 합니다", "error");
      return;
    }

    const btn = document.getElementById("btnSaveAccount");
    btn.disabled = true;
    btn.textContent = "저장 중...";
    await DZV.delay(500);

    const accounts = [...this.accounts];

    if (id) {
      const account = accounts.find((a) => a.id === id);
      if (account) {
        Object.assign(account, { name, loginId, role, branch, status });
        if (password) account.password = password;
      }
      DZV.showToast("계정이 수정되었습니다", "success");
      DZV.logActivity({
        category: "account",
        action: "계정 수정",
        detail: `${name} (@${loginId}) 계정 정보를 수정했습니다`,
        target: `@${loginId}`
      });
    } else {
      accounts.push({
        id: `acc-${Date.now()}`,
        name,
        loginId,
        password,
        role,
        branch,
        status,
        lastLogin: "-"
      });
      DZV.showToast("계정이 생성되었습니다", "success");
      DZV.logActivity({
        category: "account",
        action: "계정 생성",
        detail: `${name} (@${loginId}) 계정을 생성했습니다`,
        target: `@${loginId}`
      });
    }

    DZV.saveAccounts(accounts);

    const currentUser = DZV.getCurrentUser();
    if (id && currentUser.id === id) {
      DZV.setCurrentUser({
        id,
        name,
        loginId,
        role,
        branch
      });
    }

    btn.disabled = false;
    btn.textContent = "저장";
    this.closeModals();
    this.renderStats();
    this.renderTable();
  },

  openDeleteModal(id) {
    const account = this.accounts.find((a) => a.id === id);
    if (!account) return;
    this.deleteTargetId = id;
    document.getElementById("deleteConfirmText").textContent = `"${account.name}" (@${account.loginId}) 계정을 삭제하시겠습니까?`;
    document.getElementById("deleteModal").classList.remove("hidden");
    document.getElementById("deleteModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  },

  async confirmDelete() {
    if (!this.deleteTargetId) return;
    const btn = document.getElementById("btnConfirmDelete");
    btn.disabled = true;
    await DZV.delay(400);

    const deleted = this.accounts.find((a) => a.id === this.deleteTargetId);
    const accounts = this.accounts.filter((a) => a.id !== this.deleteTargetId);
    DZV.saveAccounts(accounts);
    if (deleted) {
      DZV.logActivity({
        category: "account",
        action: "계정 삭제",
        detail: `${deleted.name} (@${deleted.loginId}) 계정을 삭제했습니다`,
        target: `@${deleted.loginId}`
      });
    }
    this.deleteTargetId = null;
    btn.disabled = false;
    this.closeModals();
    this.renderStats();
    this.renderTable();
    DZV.showToast("계정이 삭제되었습니다", "success");
  },

  closeModals() {
    document.querySelectorAll(".server-modal").forEach((m) => {
      m.classList.add("hidden");
      m.setAttribute("aria-hidden", "true");
    });
    document.body.classList.remove("modal-open");
    this.deleteTargetId = null;
  }
};

document.addEventListener("DOMContentLoaded", () => AccountsApp.init());
