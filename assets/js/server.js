const ServerApp = {
  activeKeyword: "gangnam-holy",
  searchMode: "integrated",
  pendingTelegramReport: null,
  telegramHistory: [],
  contentGenerations: [],
  telegramAlertSettings: null,
  tickCount: 0,

  init() {
    this.telegramHistory = [...ServerData.telegramReports];
    this.telegramAlertSettings = this.loadTelegramAlertSettings();
    this.contentGenerations = this.loadContentGenerations();
    this.renderSentimentStats();
    this.renderBranchTable();
    this.renderSentimentFeed();
    this.renderSentimentAlert();
    this.renderKeywordTabs();
    this.renderKeywordRankings();
    this.renderSearchPreview();
    this.renderExposureBar();
    this.renderCafeGrid();
    this.renderCafeTable();
    this.renderContentGenStats();
    this.renderContentGenFilters();
    this.renderContentGenTable();
    this.renderTelegramConfig();
    this.renderTelegramAlertSettings();
    this.renderTelegramHistory();
    this.renderTelegramPreview();
    this.updateLiveClock();
    this.bindEvents();
    this.startLiveSimulation();
  },

  bindEvents() {
    document.querySelectorAll(".sidebar-nav .nav-item[data-section]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        document.querySelectorAll(".sidebar-nav .nav-item[data-section]").forEach((n) => n.classList.remove("active"));
        item.classList.add("active");
        document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.getElementById("btnRefresh")?.addEventListener("click", () => this.manualRefresh());
    document.getElementById("btnTestTelegram")?.addEventListener("click", () => this.sendTestTelegram());
    document.getElementById("btnDailyReport")?.addEventListener("click", () => this.openTelegramModal("daily"));
    document.getElementById("btnSaveTelegramSettings")?.addEventListener("click", () => this.saveTelegramAlertSettings());
    document.getElementById("tgGlobalEnabled")?.addEventListener("change", (e) => {
      this.telegramAlertSettings.globalEnabled = e.target.checked;
      this.renderTelegramAlertSettings();
    });
    document.getElementById("btnConfirmTelegram")?.addEventListener("click", () => this.confirmTelegramSend());

    document.getElementById("contentFilterBranch")?.addEventListener("change", () => this.renderContentGenTable());
    document.getElementById("contentFilterStatus")?.addEventListener("change", () => this.renderContentGenTable());

    document.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", () => this.closeModals());
    });

    document.getElementById("searchModeToggle")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".search-mode-btn");
      if (!btn) return;
      document.querySelectorAll(".search-mode-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      this.searchMode = btn.dataset.mode;
      this.renderKeywordRankings();
      this.renderSearchPreview();
    });
  },

  getSentimentTotals() {
    const posts = ServerData.sentimentPosts;
    const negative = posts.filter((p) => p.sentiment === "negative").length;
    const positive = posts.filter((p) => p.sentiment === "positive").length;
    const alertBranches = ServerData.branches.filter((b) => b.alert).length;
    return { total: 94, positive: 71, negative: 6, alertBranches };
  },

  loadContentGenerations() {
    const stored = DZV.loadState("server_generation_logs", []);
    const seen = new Set();
    const merged = [];

    [...stored, ...ServerData.contentGenerations].forEach((item) => {
      if (seen.has(item.id)) return;
      seen.add(item.id);
      merged.push(item);
    });

    return merged;
  },

  formatDateTime(value) {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    const y = parsed.getFullYear();
    const mo = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${mo}-${d} ${DZV.formatTime(parsed)}`;
  },

  contentStatusBadge(status) {
    const map = {
      generated: { cls: "badge-info", label: "생성 완료" },
      uploaded: { cls: "badge-success", label: "업로드 완료" },
      failed: { cls: "badge-danger", label: "실패" }
    };
    return map[status] || { cls: "badge-neutral", label: status };
  },

  getContentGenStats() {
    const today = new Date().toISOString().slice(0, 10);
    const list = this.contentGenerations;
    const todayCount = list.filter((g) => String(g.createdAt).startsWith(today)).length;
    const uploaded = list.filter((g) => g.status === "uploaded").length;
    const pending = list.filter((g) => g.status === "generated").length;
    return { today: todayCount, uploaded, pending, total: list.length };
  },

  renderContentGenStats() {
    const stats = this.getContentGenStats();
    document.getElementById("contentGenStats").innerHTML = `
      <div class="monitor-stat">
        <div class="monitor-stat-label">오늘 생성</div>
        <div class="monitor-stat-value">${stats.today}<span class="monitor-stat-unit">건</span></div>
      </div>
      <div class="monitor-stat monitor-stat--positive">
        <div class="monitor-stat-label">업로드 완료</div>
        <div class="monitor-stat-value">${stats.uploaded}<span class="monitor-stat-unit">건</span></div>
      </div>
      <div class="monitor-stat monitor-stat--warning">
        <div class="monitor-stat-label">업로드 대기</div>
        <div class="monitor-stat-value">${stats.pending}<span class="monitor-stat-unit">건</span></div>
      </div>
      <div class="monitor-stat">
        <div class="monitor-stat-label">전체 누적</div>
        <div class="monitor-stat-value">${stats.total}<span class="monitor-stat-unit">건</span></div>
      </div>`;
  },

  renderContentGenFilters() {
    const select = document.getElementById("contentFilterBranch");
    if (!select) return;
    const branches = [...new Set(this.contentGenerations.map((g) => g.branch))].sort();
    select.innerHTML = `<option value="all">전체 지점</option>${branches
      .map((b) => `<option value="${b}">${b}</option>`)
      .join("")}`;
  },

  getFilteredContentGenerations() {
    const branch = document.getElementById("contentFilterBranch")?.value || "all";
    const status = document.getElementById("contentFilterStatus")?.value || "all";
    return this.contentGenerations.filter((g) => {
      if (branch !== "all" && g.branch !== branch) return false;
      if (status !== "all" && g.status !== status) return false;
      return true;
    });
  },

  renderContentGenTable() {
    const tbody = document.querySelector("#contentGenTable tbody");
    const list = this.getFilteredContentGenerations();

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:rgba(255,255,255,0.45)">표시할 생성 이력이 없습니다</td></tr>`;
      return;
    }

    tbody.innerHTML = list
      .map((g) => {
        const badge = this.contentStatusBadge(g.status);
        const settings = `${g.city || ""} ${g.district || ""} · 이미지 ${g.imageCount ?? 0}장`.trim();
        return `
        <tr>
          <td class="content-gen-time">${this.formatDateTime(g.createdAt)}</td>
          <td><strong>${g.branch}</strong></td>
          <td>${g.style}</td>
          <td class="content-gen-settings">${settings}</td>
          <td class="content-gen-title">${g.title}</td>
          <td><span class="badge ${badge.cls}">${badge.label}</span></td>
          <td><button type="button" class="btn btn-ghost btn-sm btn-content-detail" data-gen-id="${g.id}">상세</button></td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll(".btn-content-detail").forEach((btn) => {
      btn.addEventListener("click", () => this.openContentGenModal(btn.dataset.genId));
    });
  },

  openContentGenModal(id) {
    const gen = this.contentGenerations.find((g) => g.id === id);
    if (!gen) return;

    const badge = this.contentStatusBadge(gen.status);
    document.getElementById("contentGenModalTitle").textContent = "게시글 생성 상세";
    document.getElementById("contentGenModalBody").innerHTML = `
      <div class="content-gen-modal-header">
        <span class="badge ${badge.cls}">${badge.label}</span>
        <span class="content-gen-modal-time">${this.formatDateTime(gen.createdAt)}</span>
      </div>
      <h4 class="content-gen-modal-post-title">${gen.title}</h4>
      <div class="content-gen-detail-grid">
        <div class="content-gen-detail-group">
          <h5>지역·지점 설정</h5>
          <dl>
            <div><dt>시·도</dt><dd>${gen.city || "-"}</dd></div>
            <div><dt>구·군</dt><dd>${gen.district || "-"}</dd></div>
            <div><dt>지점</dt><dd>${gen.branch}</dd></div>
          </dl>
        </div>
        <div class="content-gen-detail-group">
          <h5>콘텐츠 설정</h5>
          <dl>
            <div><dt>게시글 스타일</dt><dd>${gen.style}</dd></div>
            <div><dt>형식 학습</dt><dd>${gen.formatSource || "샘플 게시글 학습"}</dd></div>
            <div><dt>문체·톤</dt><dd>${gen.formatTone || "-"}</dd></div>
            <div><dt>등록 이미지</dt><dd>${gen.imageCount ?? 0}장</dd></div>
          </dl>
        </div>
        <div class="content-gen-detail-group">
          <h5>작업 정보</h5>
          <dl>
            <div><dt>생성자</dt><dd>${gen.createdBy || "스튜디오 사용자"}</dd></div>
            <div><dt>생성 시각</dt><dd>${this.formatDateTime(gen.createdAt)}</dd></div>
            <div><dt>업로드 시각</dt><dd>${gen.uploadedAt ? this.formatDateTime(gen.uploadedAt) : "-"}</dd></div>
          </dl>
        </div>
      </div>`;

    document.getElementById("contentGenModal").classList.remove("hidden");
    document.getElementById("contentGenModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  },

  renderSentimentStats() {
    const stats = this.getSentimentTotals();
    document.getElementById("sentimentStats").innerHTML = `
      <div class="monitor-stat">
        <div class="monitor-stat-label">분석 게시글</div>
        <div class="monitor-stat-value">${stats.total}<span class="monitor-stat-unit">건</span></div>
      </div>
      <div class="monitor-stat monitor-stat--positive">
        <div class="monitor-stat-label">긍정</div>
        <div class="monitor-stat-value">${stats.positive}<span class="monitor-stat-unit">건</span></div>
      </div>
      <div class="monitor-stat monitor-stat--negative">
        <div class="monitor-stat-label">부정</div>
        <div class="monitor-stat-value">${stats.negative}<span class="monitor-stat-unit">건</span></div>
      </div>
      <div class="monitor-stat monitor-stat--warning">
        <div class="monitor-stat-label">조치 필요</div>
        <div class="monitor-stat-value">${stats.alertBranches}<span class="monitor-stat-unit">지점</span></div>
      </div>`;
  },

  renderBranchTable() {
    const tbody = document.querySelector("#branchSentimentTable tbody");
    tbody.innerHTML = ServerData.branches
      .map((b) => {
        const positiveClass = b.positive >= 70 ? "text-positive" : b.positive < 50 ? "text-negative" : "";
        const rowClass = b.alert ? "monitor-row-alert" : "";
        return `
        <tr class="${rowClass}">
          <td>
            ${b.alert ? '<span class="alert-dot" title="조치 필요"></span>' : ""}
            <strong>${b.name}</strong>
          </td>
          <td>${b.blog}</td>
          <td>${b.cafe}</td>
          <td class="${positiveClass}"><strong>${b.positive}%</strong></td>
          <td class="${b.negative > 0 ? "text-negative" : ""}">${b.negative}</td>
        </tr>`;
      })
      .join("");
  },

  sentimentBadge(sentiment) {
    const map = {
      positive: { cls: "sentiment-positive", label: "긍정" },
      negative: { cls: "sentiment-negative", label: "부정" },
      neutral: { cls: "sentiment-neutral", label: "중립" }
    };
    const s = map[sentiment] || map.neutral;
    return `<span class="sentiment-badge ${s.cls}">${s.label}</span>`;
  },

  renderSentimentFeed() {
    document.getElementById("sentimentFeed").innerHTML = ServerData.sentimentPosts
      .map(
        (p) => `
      <div class="monitor-feed-item ${p.sentiment === "negative" ? "monitor-feed-item--negative" : ""}">
        <div class="monitor-feed-tags">
          <span class="feed-source">${p.sourceLabel}</span>
          ${this.sentimentBadge(p.sentiment)}
        </div>
        <div class="monitor-feed-title">${p.title}</div>
        <div class="monitor-feed-meta">${p.branch} · ${p.topic} · ${p.time}</div>
      </div>`
      )
      .join("");
  },

  renderSentimentAlert() {
    const alertBranch = ServerData.branches.find((b) => b.alert);
    if (!alertBranch) return;
    document.getElementById("sentimentAlertText").innerHTML = `
      <span class="alert-icon">⚠</span>
      <strong>옆커폰 ${alertBranch.name}</strong> 부정 ${alertBranch.negative}건 — 카페/블로그 「보조금·요금표」 관련 게시글`;
  },

  renderKeywordTabs() {
    document.getElementById("keywordTabs").innerHTML = ServerData.keywords
      .map(
        (k) => `
      <button type="button" class="keyword-tab ${k.id === this.activeKeyword ? "active" : ""}" data-keyword="${k.id}">
        ${k.label}
      </button>`
      )
      .join("");

    document.getElementById("keywordTabs").addEventListener("click", (e) => {
      const tab = e.target.closest(".keyword-tab");
      if (!tab) return;
      this.activeKeyword = tab.dataset.keyword;
      document.querySelectorAll(".keyword-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      this.renderKeywordRankings();
      this.renderSearchPreview();
      this.renderExposureBar();
    });
  },

  formatRank(rank, notExposed) {
    if (notExposed && rank === null) return '<span class="text-negative">미노출</span>';
    if (rank === null) return "-";
    return `${rank}위`;
  },

  formatChange(change, dir) {
    if (dir === "same" || change === 0) return '<span class="rank-same">—</span>';
    const cls = dir === "up" ? "rank-up" : "rank-down";
    const sign = dir === "up" ? "▲" : "▼";
    return `<span class="${cls}">${sign}${Math.abs(change)}</span>`;
  },

  renderKeywordRankings() {
    const rows = ServerData.keywordRankings[this.activeKeyword] || [];
    document.querySelector("#keywordRankTable tbody").innerHTML = rows
      .map(
        (r) => `
      <tr class="${r.notExposed ? "monitor-row-alert" : ""}">
        <td>${r.notExposed ? '<span class="alert-dot"></span>' : ""}<strong>${r.branch}</strong></td>
        <td>${this.formatRank(r.integrated, r.notExposed)}</td>
        <td>${this.formatRank(r.blog, false)}</td>
        <td>${this.formatChange(r.change, r.changeDir)}</td>
      </tr>`
      )
      .join("");
  },

  renderSearchPreview() {
    const keyword = ServerData.keywords.find((k) => k.id === this.activeKeyword);
    const results = ServerData.searchPreviews[this.activeKeyword] || ServerData.searchPreviews["gangnam-holy"];
    const alertRow = (ServerData.keywordRankings[this.activeKeyword] || []).find((r) => r.notExposed);

    document.getElementById("searchPreviewQuery").innerHTML = `
      <span class="search-preview-icon">🔍</span>
      <span>${keyword?.label || ""}</span>
      <span class="search-preview-tab">${this.searchMode === "integrated" ? "통합검색" : "블로그"}</span>`;

    document.getElementById("searchPreviewResults").innerHTML = results
      .map(
        (r) => `
      <div class="search-result-item">
        <span class="search-result-rank">${r.rank}</span>
        <div>
          <div class="search-result-title">${r.type === "place" ? "📍 " : ""}${r.title}</div>
          <div class="search-result-desc">${r.desc}</div>
        </div>
      </div>`
      )
      .join("");

    const alertEl = document.getElementById("keywordExposureAlert");
    if (alertRow) {
      alertEl.classList.remove("hidden");
      alertEl.innerHTML = `<strong>${alertRow.branch}</strong> — 통합검색 <span class="text-negative">미노출</span> (30위 밖)`;
    } else {
      alertEl.classList.add("hidden");
    }
  },

  renderExposureBar() {
    const rows = ServerData.keywordRankings[this.activeKeyword] || [];
    const keyword = ServerData.keywords.find((k) => k.id === this.activeKeyword);
    const items = rows.map((r) => {
      if (r.notExposed) return `<span class="exposure-item exposure-item--bad">${r.branch} <em>미노출</em></span>`;
      const rank = r.integrated || r.blog;
      return `<span class="exposure-item">${r.branch} <em>${rank}위</em></span>`;
    });
    document.getElementById("exposureCompareBar").innerHTML = `
      <span class="exposure-compare-label">가맹점별 노출 비교 · 「${keyword?.label}」</span>
      <div class="exposure-compare-items">${items.join("")}</div>`;
  },

  cafeTypeBadge(type) {
    const map = {
      negative: "badge-danger",
      question: "badge-warning",
      positive: "badge-success"
    };
    return map[type] || "badge-neutral";
  },

  renderCafeGrid() {
    document.getElementById("cafePostGrid").innerHTML = ServerData.cafePosts
      .map((p) => {
        const isNegative = p.type === "negative";
        const isQuestion = p.type === "question";
        return `
        <div class="cafe-card ${isNegative ? "cafe-card--negative" : ""} ${isQuestion ? "cafe-card--question" : ""}" data-cafe-id="${p.id}">
          <div class="cafe-card-header">
            <span class="badge ${this.cafeTypeBadge(p.type)}">${p.typeLabel}</span>
            <span class="cafe-card-status ${p.status}">${p.statusLabel}</span>
          </div>
          <h3 class="cafe-card-title">${p.title}</h3>
          <p class="cafe-card-excerpt">${p.excerpt}</p>
          ${isQuestion ? `<div class="cafe-delay-notice">질문 등록 후 <strong>${p.replyDelayDays}일</strong> 뒤 답변 — 빠른 답변으로 구매 전환 유도 필요</div>` : ""}
          ${isNegative ? `<div class="cafe-urgent-notice">부정글 모니터링 — 발생 즉시 대응 가능</div>` : ""}
          <div class="cafe-card-meta">
            <span>${p.branch}</span>
            <span>조회 ${p.views}</span>
            <span>댓글 ${p.replies}</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm btn-cafe-detail" data-cafe-id="${p.id}">상세 보기</button>
        </div>`;
      })
      .join("");

    document.getElementById("cafePostGrid").addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-cafe-detail");
      const card = e.target.closest(".cafe-card");
      const id = btn?.dataset.cafeId || card?.dataset.cafeId;
      if (id) this.openCafeModal(id);
    });
  },

  renderCafeTable() {
    document.querySelector("#cafeMonitorTable tbody").innerHTML = ServerData.cafePosts
      .map(
        (p) => `
      <tr class="${p.type === "negative" ? "table-row-danger" : ""}">
        <td><span class="badge ${this.cafeTypeBadge(p.type)}">${p.typeLabel}</span></td>
        <td class="cafe-table-title">${p.title}</td>
        <td>${p.branch}</td>
        <td><span class="cafe-status-pill ${p.status}">${p.statusLabel}</span></td>
        <td>${p.postedAt.split(" ")[0]}</td>
        <td><button type="button" class="btn btn-ghost btn-sm btn-cafe-detail" data-cafe-id="${p.id}">보기</button></td>
      </tr>`
      )
      .join("");

    document.getElementById("cafeMonitorTable").addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-cafe-detail");
      if (btn) this.openCafeModal(btn.dataset.cafeId);
    });
  },

  openCafeModal(id) {
    const post = ServerData.cafePosts.find((p) => p.id === id);
    if (!post) return;

    document.getElementById("cafeModalTitle").textContent = post.title;
    document.getElementById("cafeModal").dataset.postId = id;
    document.getElementById("cafeModalBody").innerHTML = `
      <div class="cafe-modal-meta">
        <span class="badge ${this.cafeTypeBadge(post.type)}">${post.typeLabel}</span>
        <span class="cafe-status-pill ${post.status}">${post.statusLabel}</span>
        ${post.category ? `<span class="cafe-modal-category">${post.category}</span>` : ""}
      </div>
      <p class="cafe-modal-excerpt">${post.excerpt}</p>
      <div class="cafe-modal-info">
        <div><span>게시판</span><strong>${post.category || "-"}</strong></div>
        <div><span>작성자</span><strong>${post.author}</strong></div>
        <div><span>등록</span><strong>${post.postedAt}</strong></div>
        <div><span>조회/댓글</span><strong>조회 ${post.views} · 댓글 ${post.replies}</strong></div>
        ${post.lastReplyAt ? `<div><span>마지막 답변</span><strong>${post.lastReplyAt}</strong></div>` : ""}
        <div><span>원문</span><a href="${post.url}" target="_blank" rel="noopener">${post.url}</a></div>
      </div>
      ${post.replyContent ? `
        <div class="cafe-modal-reply">
          <div class="cafe-modal-reply-header"><strong>${post.replyAuthor || "매니저"}</strong> 답변</div>
          <p>${post.replyContent}</p>
        </div>` : ""}
      ${post.type === "question" ? `
        <div class="cafe-modal-tip">
          <strong>💡 모니터링 포인트</strong>
          질문글에 빠른 답변을 통해 구매 전환으로 이어질 수 있습니다. 현재 답변 지연 ${post.replyDelayDays}일 상태입니다.
        </div>` : ""}
      ${post.type === "negative" ? `
        <div class="cafe-modal-tip cafe-modal-tip--danger">
          <strong>⚠ 즉시 대응 권장</strong>
          옆커폰 간판 여부만으로 신뢰할 수 없다는 경고성 게시글입니다. 사실 관계 확인 후 카페 답변 및 브랜드 이미지 관리가 필요합니다.
        </div>` : ""}`;

    document.getElementById("cafeModal").classList.remove("hidden");
    document.getElementById("cafeModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  },

  closeModals() {
    document.querySelectorAll(".server-modal").forEach((m) => {
      m.classList.add("hidden");
      m.setAttribute("aria-hidden", "true");
    });
    document.body.classList.remove("modal-open");
    this.pendingTelegramReport = null;
  },

  buildTelegramReport(type, postId) {
    const now = DZV.formatTime(new Date());
    const date = new Date().toLocaleDateString("ko-KR");

    if (type === "sentiment") {
      const branch = ServerData.branches.find((b) => b.alert);
      return {
        title: `[긴급] ${branch?.name} 부정 여론 보고서`,
        body: `📊 <b>옆커폰 여론 모니터링 보고서</b>\n📅 ${date} ${now}\n\n━━━━━━━━━━━━━━\n🔴 <b>조치 필요 지점</b>: ${branch?.name}\n• 부정 게시글: ${branch?.negative}건\n• 긍정률: ${branch?.positive}%\n• 주요 키워드: 보조금·요금표 불일치\n\n<b>최근 부정 게시글</b>\n${ServerData.sentimentPosts
          .filter((p) => p.sentiment === "negative")
          .map((p) => `• [${p.sourceLabel}] ${p.title}`)
          .join("\n")}\n\n━━━━━━━━━━━━━━\n본사 확인 후 지점 대응 요청 바랍니다.`
      };
    }

    if (type === "cafe" || type === "cafe-post") {
      const posts = type === "cafe-post"
        ? ServerData.cafePosts.filter((p) => p.id === postId)
        : ServerData.cafePosts.filter((p) => p.type !== "positive");
      return {
        title: `[카페] 공식 카페 이슈 보고서`,
        body: `📢 <b>옆커폰 공식 카페 모니터링</b>\n📅 ${date} ${now}\n\n━━━━━━━━━━━━━━\n${posts
          .map((p) => {
            const icon = p.type === "negative" ? "🔴" : p.type === "question" ? "🟡" : "🟢";
            return `${icon} <b>[${p.typeLabel}]</b> ${p.title}\n   지점: ${p.branch} | 상태: ${p.statusLabel}`;
          })
          .join("\n\n")}\n\n━━━━━━━━━━━━━━\n빠른 답변·대응으로 구매 전환 기회를 확보하세요.`
      };
    }

    if (type === "keywords") {
      return {
        title: "[노출] 키워드 순위 이상 보고서",
        body: `🔍 <b>옆커폰 키워드 노출 모니터링</b>\n📅 ${date} ${now}\n\n━━━━━━━━━━━━━━\n🔴 <b>역삼점</b> — 「강남 휴대폰 성지」 통합검색 미노출\n• 전일 대비 5단계 하락\n\n<b>노출 현황</b>\n• 일산점 1위 · 강남역점 2위 · 분당정자점 4위\n\n━━━━━━━━━━━━━━\n노출 개선 조치를 검토해 주세요.`
      };
    }

    if (type === "content") {
      const latest = this.contentGenerations[0];
      return {
        title: `[생성] AI 콘텐츠 ${latest?.status === "uploaded" ? "업로드" : "생성"} 보고`,
        body: `📝 <b>옆커폰 AI 게시글 생성 보고</b>\n📅 ${date} ${now}\n\n━━━━━━━━━━━━━━\n<b>지점</b>: ${latest?.branch || "-"}\n<b>스타일</b>: ${latest?.style || "-"}\n<b>제목</b>: ${latest?.title || "-"}\n<b>상태</b>: ${latest?.status === "uploaded" ? "업로드 완료" : "생성 완료"}\n\n━━━━━━━━━━━━━━\n상세 내용은 관제 대시보드에서 확인하세요.`
      };
    }

    if (type === "daily") {
      return {
        title: `[일일] 옆커폰 종합 모니터링 보고서`,
        body: `📋 <b>옆커폰 일일 종합 보고서</b>\n📅 ${date} ${now}\n\n━━━━━━━━━━━━━━\n<b>📊 여론 현황</b>\n• 분석 게시글: 94건\n• 긍정: 71건 | 부정: 6건\n• 조치 필요: 역삼점\n\n<b>🔍 키워드 노출</b>\n• 역삼점 '강남 휴대폰 성지' 통합검색 미노출\n• 일산점 1위, 강남역점 2위\n\n<b>☕ 공식 카페</b>\n• 부정글 1건 (「옆커폰 간판을 달고있더라도」)\n• 질문글 답변 지연 1건 (신용·현금완납 문의, 2일)\n\n━━━━━━━━━━━━━━\n상세 내용은 관제 대시보드에서 확인하세요.`
      };
    }

    return { title: "테스트 보고서", body: "테스트 메시지입니다." };
  },

  openTelegramModal(type, postId) {
    const report = this.buildTelegramReport(type, postId);
    this.pendingTelegramReport = { type, postId, ...report };
    document.getElementById("telegramSendPreview").innerHTML = `
      <div class="telegram-preview-header">${report.title}</div>
      <pre class="telegram-preview-body">${report.body.replace(/<[^>]+>/g, "")}</pre>`;
    document.getElementById("telegramModal").classList.remove("hidden");
    document.getElementById("telegramModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  },

  async confirmTelegramSend() {
    if (!this.pendingTelegramReport) return;
    const btn = document.getElementById("btnConfirmTelegram");
    btn.disabled = true;
    btn.textContent = "발송 중...";
    await DZV.delay(900);

    const entry = {
      id: `tg-${Date.now()}`,
      type: this.pendingTelegramReport.type,
      title: this.pendingTelegramReport.title,
      summary: this.pendingTelegramReport.body.split("\n")[2] || "보고서 발송 완료",
      time: DZV.formatTime(new Date()),
      sent: true
    };
    this.telegramHistory.unshift(entry);
    this.renderTelegramHistory();
    this.renderTelegramPreview(entry);

    btn.disabled = false;
    btn.textContent = "발송하기";
    this.closeModals();
    DZV.showToast("텔레그램 보고서가 발송되었습니다", "success");
  },


  sendTestTelegram() {
    DZV.showToast("테스트 메시지가 발송되었습니다", "info");
    const entry = {
      id: `tg-test-${Date.now()}`,
      type: "test",
      title: "[테스트] 텔레그램 연동 확인",
      summary: "봇 연결 및 메시지 수신 테스트",
      time: DZV.formatTime(new Date()),
      sent: true
    };
    this.telegramHistory.unshift(entry);
    this.renderTelegramHistory();
  },

  loadTelegramAlertSettings() {
    const saved = DZV.loadState("telegram_alert_settings", null);
    const base = saved
      ? JSON.parse(JSON.stringify(saved))
      : JSON.parse(JSON.stringify(ServerData.telegramAlertDefaults));
    this.normalizeTelegramAlertSettings(base);
    return base;
  },

  normalizeTelegramAlertSettings(settings) {
    const defaults = ServerData.telegramAlertDefaults.items;
    Object.keys(defaults).forEach((key) => {
      const item = settings.items[key];
      const def = defaults[key];
      if (!item) {
        settings.items[key] = JSON.parse(JSON.stringify(def));
        return;
      }

      if (!item.triggers) {
        if (item.trigger === "both") {
          item.triggers = ["negative", "question_delay"];
        } else if (item.trigger === "schedule") {
          item.triggers = [];
        } else if (item.trigger) {
          item.triggers = [item.trigger];
        } else {
          item.triggers = [...(def.triggers || [])];
        }
        delete item.trigger;
      }

      if (!item.thresholds) item.thresholds = {};
      if (item.threshold != null && item.threshold !== "") {
        const opt = (ServerData.telegramTriggerOptions[key] || []).find((o) => o.threshold);
        if (opt?.threshold) item.thresholds[opt.threshold.key] = item.threshold;
        delete item.threshold;
      }

      if (key === "daily" && !item.schedule) item.schedule = def.schedule || "09:00";
    });
  },

  saveTelegramAlertSettings() {
    this.collectTelegramAlertSettings();
    DZV.saveState("telegram_alert_settings", this.telegramAlertSettings);
    this.renderTelegramAlertSettings();
    DZV.showToast("텔레그램 자동 발송 설정이 저장되었습니다", "success");
  },

  collectTelegramAlertSettings() {
    const globalEl = document.getElementById("tgGlobalEnabled");
    if (globalEl) this.telegramAlertSettings.globalEnabled = globalEl.checked;

    Object.keys(this.telegramAlertSettings.items).forEach((key) => {
      const row = document.getElementById(`tg-setting-${key}`);
      if (!row) return;
      const item = this.telegramAlertSettings.items[key];
      const enabledEl = row.querySelector('[data-field="enabled"]');
      const triggerEl = row.querySelector('[data-field="trigger"]');
      const thresholdEl = row.querySelector('[data-field="threshold"]');
      const scheduleEl = row.querySelector('[data-field="schedule"]');
      if (enabledEl) item.enabled = enabledEl.checked;
      if (triggerEl) item.trigger = triggerEl.value;
      if (thresholdEl && thresholdEl.value !== "") item.threshold = Number(thresholdEl.value);
      if (scheduleEl) item.schedule = scheduleEl.value;
    });
  },

  isTelegramAutoEnabled(key) {
    return this.telegramAlertSettings.globalEnabled && this.telegramAlertSettings.items[key]?.enabled;
  },

  collectTelegramAlertSettings() {
    const globalEl = document.getElementById("tgGlobalEnabled");
    if (globalEl) this.telegramAlertSettings.globalEnabled = globalEl.checked;

    Object.keys(this.telegramAlertSettings.items).forEach((key) => {
      const row = document.getElementById(`tg-setting-${key}`);
      if (!row) return;
      const item = this.telegramAlertSettings.items[key];
      const enabledEl = row.querySelector('[data-field="enabled"]');
      const scheduleEl = row.querySelector('[data-field="schedule"]');

      if (enabledEl) item.enabled = enabledEl.checked;
      if (scheduleEl) item.schedule = scheduleEl.value;

      if (key !== "daily") {
        item.triggers = [...row.querySelectorAll('[data-trigger]:checked')].map((el) => el.dataset.trigger);
        if (!item.thresholds) item.thresholds = {};
        row.querySelectorAll("[data-threshold]").forEach((el) => {
          if (el.value !== "") item.thresholds[el.dataset.threshold] = Number(el.value);
        });
      }
    });
  },

  getTriggerLabels(key) {
    const item = this.telegramAlertSettings.items[key];
    const options = ServerData.telegramTriggerOptions[key] || [];
    return (item.triggers || [])
      .map((t) => options.find((o) => o.value === t)?.label || t)
      .join(", ");
  },

  renderTriggerChips(key, item) {
    const options = ServerData.telegramTriggerOptions[key];
    if (!options) return "";

    const triggers = item.triggers || [];
    const thresholds = item.thresholds || {};

    return `<div class="tg-trigger-chips">${options
      .map((o) => {
        const checked = triggers.includes(o.value);
        const th = o.threshold;
        const thVal = th ? thresholds[th.key] ?? th.default : null;
        const thField = th
          ? `<span class="tg-chip-threshold-wrap">
              <input type="number" class="tg-chip-threshold" data-threshold="${th.key}"
                min="${th.min}" max="${th.max}" value="${thVal}" ${checked ? "" : "disabled"}>
              <span class="tg-chip-suffix">${th.suffix}</span>
            </span>`
          : "";

        return `<label class="tg-trigger-chip ${checked ? "is-checked" : ""}">
          <input type="checkbox" class="tg-chip-check" data-trigger="${o.value}" ${checked ? "checked" : ""}>
          <span class="tg-chip-label">${o.label}</span>${thField}
        </label>`;
      })
      .join("")}</div>`;
  },

  bindTriggerChipEvents(container) {
    container.querySelectorAll("[data-trigger]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const chip = e.target.closest(".tg-trigger-chip");
        const th = chip?.querySelector("[data-threshold]");
        if (chip) chip.classList.toggle("is-checked", e.target.checked);
        if (th) th.disabled = !e.target.checked;
        this.collectTelegramAlertSettings();
      });
    });

    container.querySelectorAll("[data-threshold]").forEach((el) => {
      el.addEventListener("mousedown", (e) => e.stopPropagation());
      el.addEventListener("click", (e) => e.stopPropagation());
      el.addEventListener("change", () => this.collectTelegramAlertSettings());
    });
  },

  renderTelegramAlertSettings() {
    const container = document.getElementById("telegramAlertSettingsList");
    const globalEl = document.getElementById("tgGlobalEnabled");
    if (!container) return;
    if (globalEl) globalEl.checked = this.telegramAlertSettings.globalEnabled;

    const iconMap = {
      sentiment: "💬",
      keywords: "🔍",
      cafe: "☕",
      content: "📝",
      daily: "📋"
    };

    container.innerHTML = Object.entries(this.telegramAlertSettings.items)
      .map(([key, item]) => {
        const isDaily = key === "daily";
        const active = this.isTelegramAutoEnabled(key);
        const controls = isDaily
          ? `<input type="time" class="form-input form-input-sm tg-inline-input" data-field="schedule" value="${item.schedule || "09:00"}">`
          : this.renderTriggerChips(key, item);

        return `
        <div class="tg-setting-row ${active ? "tg-setting-row--on" : ""}" id="tg-setting-${key}" data-key="${key}">
          <label class="toggle-switch toggle-switch--sm" title="자동 발송">
            <input type="checkbox" data-field="enabled" ${item.enabled ? "checked" : ""}>
            <span class="toggle-slider"></span>
          </label>
          <div class="tg-setting-body">
            <div class="tg-setting-top">
              <span class="tg-setting-name">${iconMap[key] || "📢"} ${item.label}</span>
              <button type="button" class="btn-tg-preview-sm" data-tg-preview="${key}">미리보기</button>
            </div>
            <div class="tg-setting-controls">${controls}</div>
          </div>
        </div>`;
      })
      .join("");

    container.querySelectorAll('[data-field="enabled"]').forEach((el) => {
      el.addEventListener("change", () => {
        this.collectTelegramAlertSettings();
        this.renderTelegramAlertSettings();
      });
    });

    this.bindTriggerChipEvents(container);

    container.querySelectorAll(".btn-tg-preview-sm").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.tgPreview === "daily" ? "daily" : btn.dataset.tgPreview;
        this.openTelegramModal(type);
      });
    });
  },

  renderTelegramConfig() {
    const cfg = ServerData.telegramConfig;
    document.getElementById("telegramBotName").textContent = cfg.botName;
    document.getElementById("telegramChatName").textContent = cfg.chatName;
    document.getElementById("telegramSubscribers").textContent = `${cfg.subscribers}명`;
  },

  renderTelegramHistory() {
    document.getElementById("telegramHistory").innerHTML = this.telegramHistory
      .map(
        (h) => `
      <div class="telegram-history-item">
        <div class="telegram-history-icon ${h.type}"></div>
        <div class="telegram-history-content">
          <div class="telegram-history-title">${h.title}</div>
          <div class="telegram-history-summary">${h.summary}</div>
        </div>
        <div class="telegram-history-time">${h.time}</div>
      </div>`
      )
      .join("");
  },

  renderTelegramPreview(latest) {
    const report = latest || this.telegramHistory[0];
    if (!report) return;
    const full = this.buildTelegramReport("daily");
    document.getElementById("telegramPreview").innerHTML = `
      <div class="telegram-bubble">
        <div class="telegram-bubble-header">
          <span class="telegram-bubble-bot">${ServerData.telegramConfig.botName}</span>
          <span class="telegram-bubble-time">${report.time}</span>
        </div>
        <div class="telegram-bubble-body">${full.body.replace(/<b>/g, "<strong>").replace(/<\/b>/g, "</strong>").replace(/\n/g, "<br>")}</div>
      </div>`;
  },

  updateLiveClock() {
    const el = document.getElementById("liveClock");
    if (el) el.textContent = DZV.formatTime(new Date());
  },

  async manualRefresh() {
    const indicator = document.getElementById("refreshIndicator");
    indicator.classList.add("syncing");
    await DZV.delay(600);
    this.contentGenerations = this.loadContentGenerations();
    this.renderSentimentStats();
    this.renderBranchTable();
    this.renderSentimentFeed();
    this.renderContentGenStats();
    this.renderContentGenFilters();
    this.renderContentGenTable();
    indicator.classList.remove("syncing");
    DZV.showToast("모니터링 데이터가 갱신되었습니다", "info");
  },

  simulateTick() {
    this.tickCount++;
    this.updateLiveClock();
    if (this.tickCount % 5 === 0) {
      const feed = document.getElementById("sentimentFeed");
      if (feed?.firstElementChild) {
        feed.firstElementChild.classList.add("monitor-feed-item--pulse");
        setTimeout(() => feed.firstElementChild?.classList.remove("monitor-feed-item--pulse"), 1500);
      }
    }
  },

  startLiveSimulation() {
    setInterval(() => this.simulateTick(), 3000);
    setInterval(() => this.updateLiveClock(), 1000);
  }
};

document.addEventListener("DOMContentLoaded", () => ServerApp.init());
