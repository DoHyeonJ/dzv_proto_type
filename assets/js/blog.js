const BlogApp = {
  currentStep: 1,
  learnedFormat: null,
  selectedCity: null,
  selectedDistrict: null,
  selectedBranch: null,
  selectedStyle: null,
  uploadedImages: [],
  generatedPost: null,
  inputMode: "content",
  defaultBlogUrl: "https://blog.naver.com/uhagodqhr94/224330649384",
  sampleImageBase: "../assets/images/",
  registeredUrls: [],

  stepMeta: [
    {
      label: "형식 학습",
      hint: "샘플 게시글이 등록되어 있습니다. 학습이 완료되었으니 다음 단계로 진행하세요.",
      next: "지점·스타일 지정"
    },
    {
      label: "지역·지점 지정",
      hint: "시·도와 구·군을 선택한 뒤, 설정된 지점을 선택해주세요.",
      next: "이미지 업로드"
    },
    {
      label: "이미지 업로드",
      hint: "이미지를 등록하거나, 건너뛰고 다음 단계로 진행할 수 있습니다.",
      next: "생성 및 배포"
    },
    {
      label: "생성 및 배포",
      hint: "게시글을 생성한 뒤 블로그에 업로드하면 작업이 완료됩니다.",
      next: null
    }
  ],

  samplePosts: [],

  initSamplePosts() {
    this.samplePosts = [
      {
        title: HardcodedPost.title,
        content: HardcodedPost.getContent(),
        html: HardcodedPost.buildHtml()
      }
    ];
  },

  init() {
    this.initSamplePosts();
    this.renderRegionSelectors();
    this.renderStyles();
    this.bindEvents();
    this.loadSamples(true);
    this.initDefaultUrl(true);
    this.applyLearnedFormat(this.getDefaultLearnedFormat());
    this.resetPreviewPlaceholder();
    this.updateSteps();
  },

  resetPreviewPlaceholder() {
    this.generatedPost = null;
    const panel = document.getElementById("previewPanel");
    if (panel) {
      panel.innerHTML = `<p class="text-muted text-center preview-placeholder">게시글 생성 버튼을 클릭하면 미리보기가 표시됩니다.</p>`;
    }
    document.getElementById("uploadSection")?.classList.add("hidden");
    document.getElementById("uploadLog")?.classList.add("hidden");
    document.getElementById("uploadProgress")?.classList.add("hidden");
    const progressFill = document.getElementById("progressFill");
    if (progressFill) progressFill.style.width = "0%";
    const btnUpload = document.getElementById("btnUpload");
    if (btnUpload) btnUpload.disabled = false;
    const btnGenerate = document.getElementById("btnGenerate");
    if (btnGenerate) {
      btnGenerate.disabled = false;
      btnGenerate.textContent = "게시글 생성";
    }
  },

  showGenerateLoading() {
    this.generatedPost = null;
    document.getElementById("uploadSection").classList.add("hidden");
    document.getElementById("uploadLog")?.classList.add("hidden");
    document.getElementById("uploadProgress")?.classList.add("hidden");
    const progressFill = document.getElementById("progressFill");
    if (progressFill) progressFill.style.width = "0%";
    document.getElementById("previewPanel").innerHTML = `
      <div class="generate-loading">
        <div class="generate-loading-spinner"></div>
        <p class="generate-loading-text" id="generateLoadingText">게시글 생성 준비 중...</p>
        <p class="generate-loading-sub">학습된 형식을 바탕으로 콘텐츠를 작성하고 있습니다</p>
      </div>`;
  },

  parseNaverBlogUrl(url) {
    const pathMatch = url.match(/blog\.naver\.com\/([^/?#]+)\/(\d+)/);
    if (pathMatch) {
      return { blogId: pathMatch[1], logNo: pathMatch[2] };
    }

    try {
      const parsed = new URL(url);
      const blogId = parsed.searchParams.get("blogId");
      const logNo = parsed.searchParams.get("logNo");
      if (blogId && logNo) return { blogId, logNo };
    } catch {
      return null;
    }

    return null;
  },

  buildPostViewUrl(blogId, logNo) {
    const params = new URLSearchParams({
      blogId,
      logNo,
      redirect: "Dlog",
      widgetTypeCall: "true",
      noTrackingCode: "true",
      directAccess: "false"
    });
    return `https://blog.naver.com/PostView.naver?${params.toString()}`;
  },

  initDefaultUrl(silent = false) {
    const urlInput = document.getElementById("sampleUrl");
    urlInput.value = this.defaultBlogUrl;
    const meta = this.registerUrl(this.defaultBlogUrl, silent);
    if (meta) {
      this.appendUrlToLearning(this.defaultBlogUrl, meta);
    }
  },

  registerUrl(url, silent = false) {
    const parsed = this.parseNaverBlogUrl(url);
    if (!parsed) {
      if (!silent) DZV.showToast("네이버 블로그 URL 형식이 아닙니다", "error");
      return null;
    }

    if (this.registeredUrls.some((item) => item.url === url)) {
      if (!silent) DZV.showToast("이미 등록된 URL입니다", "info");
      return parsed;
    }

    const postViewUrl = this.buildPostViewUrl(parsed.blogId, parsed.logNo);
    const entry = { url, ...parsed, postViewUrl };
    this.registeredUrls.push(entry);
    this.renderUrlList();
    return entry;
  },

  renderUrlList() {
    const list = document.getElementById("urlList");
    if (!list) return;

    if (this.registeredUrls.length === 0) {
      list.innerHTML = `<li class="url-list-empty">등록된 URL이 없습니다</li>`;
      return;
    }

    list.innerHTML = this.registeredUrls
      .map(
        (item, i) => `
      <li class="url-list-item">
        <div class="url-list-index">${String(i + 1).padStart(2, "0")}</div>
        <div class="url-list-body">
          <a href="${item.url}" target="_blank" rel="noopener" class="url-list-link">${item.url}</a>
          <div class="url-list-sub">PostView · blogId ${item.blogId} · logNo ${item.logNo}</div>
        </div>
        <button type="button" class="url-list-remove" data-index="${i}" title="삭제">×</button>
      </li>`
      )
      .join("");

    list.querySelectorAll(".url-list-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.removeUrl(parseInt(btn.dataset.index));
      });
    });
  },

  removeUrl(index) {
    this.registeredUrls.splice(index, 1);
    this.renderUrlList();
  },

  appendUrlToLearning(url, parsed) {
    const fetchedContent = `【네이버 블로그 게시글】\n출처: ${url}\n블로그ID: ${parsed.blogId} · 게시글번호: ${parsed.logNo}\n\n등록된 URL 기반 게시글 형식을 학습 데이터에 포함합니다.`;

    const textarea = document.getElementById("sampleInput");
    const existing = textarea.value.trim();
    if (existing.includes(url)) return;

    textarea.value = existing ? `${existing}\n\n---\n\n${fetchedContent}` : fetchedContent;
  },

  getDefaultLearnedFormat() {
    const input = document.getElementById("sampleInput")?.value || "";
    const sampleCount = input ? input.split("---").length : this.samplePosts.length;
    return {
      structure: [
        "광고·지원 고지",
        "인사 및 도입부",
        "매장 정보 인용 블록",
        "섹션별 본문 (사전승낙서·위치·상담·혜택)",
        "이미지 삽입",
        "총평 및 해시태그"
      ],
      tone: "친근하고 신뢰감 있는 존댓말, 방문 후기 형식",
      avgLength: "1,500~2,500자",
      hashtags: ["#휴대폰성지", "#인천휴대폰", "#옆커폰", "#기기변경", "#방문후기"],
      emojiUsage: "섹션 제목 강조, 과도한 이모지는 사용하지 않음",
      learnedAt: new Date().toISOString(),
      sampleCount
    };
  },

  getCombinedSamples() {
    return this.samplePosts
      .map((p) => `【${p.title}】\n${p.content}`)
      .join("\n\n---\n\n");
  },

  loadSamples(silent = false) {
    const textarea = document.getElementById("sampleInput");
    textarea.value = this.getCombinedSamples();

    const list = document.getElementById("sampleList");
    list.innerHTML = this.samplePosts
      .map(
        (p, i) => `
        <div class="sample-item">
          <span>샘플 ${i + 1}: ${p.title}</span>
          <span class="badge badge-info">등록됨</span>
        </div>`
      )
      .join("");

    if (!silent) {
      DZV.showToast("샘플 게시글이 초기화되었습니다", "info");
    }

    this.registeredUrls = [];
    this.initDefaultUrl(true);
  },

  openPostPreviewModal(title, html) {
    const modal = document.getElementById("postPreviewModal");
    const titleEl = document.getElementById("postPreviewModalTitle");
    const bodyEl = document.getElementById("postPreviewModalBody");
    if (!modal || !titleEl || !bodyEl) return;

    titleEl.textContent = title;
    bodyEl.innerHTML = `<div class="se-viewer se-viewer--naver">${html}</div>`;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    bodyEl.scrollTop = 0;
  },

  closePostPreviewModal() {
    const modal = document.getElementById("postPreviewModal");
    if (!modal || modal.classList.contains("hidden")) return;

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.getElementById("postPreviewModalBody").innerHTML = "";
  },

  getPostExcerpt(html, maxLength = 140) {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = (div.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
  },

  expandGeneratedPost() {
    const post = this.generatedPost;
    if (!post) {
      DZV.showToast("자세히 볼 게시글이 없습니다", "error");
      return;
    }

    const html = post.html || `<div class="se-component se-text"><p class="se-text-paragraph">${post.body.replace(/\n/g, "<br>")}</p></div>`;
    this.openPostPreviewModal(post.title, html);
  },

  applyLearnedFormat(format) {
    this.learnedFormat = format;
    DZV.saveState("blog_format", this.learnedFormat);
  },

  renderRegionSelectors() {
    const cityGrid = document.getElementById("cityGrid");
    const cities = Object.keys(DZV.regionConfig);

    cityGrid.innerHTML = cities
      .map((city) => `<button type="button" class="region-chip" data-city="${city}">${city}</button>`)
      .join("");

    cityGrid.addEventListener("click", (e) => {
      const chip = e.target.closest(".region-chip");
      if (!chip) return;
      cityGrid.querySelectorAll(".region-chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      this.selectedCity = chip.dataset.city;
      this.selectedDistrict = null;
      this.selectedBranch = null;
      this.renderDistricts();
      this.renderBranchesForDistrict();
      this.updateSteps();
    });
  },

  renderDistricts() {
    const grid = document.getElementById("districtGrid");
    if (!this.selectedCity) {
      grid.innerHTML = `<p class="region-placeholder">시·도를 먼저 선택해주세요</p>`;
      return;
    }

    const districts = Object.keys(DZV.regionConfig[this.selectedCity]);
    grid.innerHTML = districts
      .map((d) => {
        const count = DZV.regionConfig[this.selectedCity][d].length;
        const badge = count > 0 ? `<span class="region-count">${count}</span>` : "";
        return `<button type="button" class="region-chip" data-district="${d}">${d}${badge}</button>`;
      })
      .join("");

    grid.querySelectorAll(".region-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        grid.querySelectorAll(".region-chip").forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        this.selectedDistrict = chip.dataset.district;
        this.selectedBranch = null;
        this.renderBranchesForDistrict();
        this.updateSteps();
      });
    });
  },

  renderBranchesForDistrict() {
    const grid = document.getElementById("branchGrid");
    const emptyEl = document.getElementById("branchEmpty");

    if (!this.selectedCity || !this.selectedDistrict) {
      grid.innerHTML = `<p class="region-placeholder">구·군을 먼저 선택해주세요</p>`;
      emptyEl.classList.add("hidden");
      return;
    }

    const branches = DZV.regionConfig[this.selectedCity][this.selectedDistrict];

    if (branches.length === 0) {
      grid.innerHTML = "";
      emptyEl.classList.remove("hidden");
      return;
    }

    emptyEl.classList.add("hidden");
    grid.innerHTML = branches
      .map((b) => `<button type="button" class="branch-chip" data-branch="${b}">${b}</button>`)
      .join("");

    grid.querySelectorAll(".branch-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        grid.querySelectorAll(".branch-chip").forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        this.selectedBranch = chip.dataset.branch;
        this.updateSteps();
      });
    });
  },

  renderStyles() {
    const container = document.getElementById("styleOptions");
    container.innerHTML = Object.values(DZV.postStyles)
      .map(
        (s, i) => `
        <div class="style-option" data-style="${s.id}">
          <span class="style-option-num">0${i + 1}</span>
          <div class="style-option-title">${s.title}</div>
          <div class="style-option-desc">${s.desc}</div>
        </div>`
      )
      .join("");

    container.addEventListener("click", (e) => {
      const option = e.target.closest(".style-option");
      if (!option) return;
      container.querySelectorAll(".style-option").forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      this.selectedStyle = option.dataset.style;
      this.updateSteps();
    });
  },

  bindEvents() {
    document.querySelectorAll(".input-mode-tab[data-mode]").forEach((tab) => {
      tab.addEventListener("click", () => this.switchInputMode(tab.dataset.mode));
    });

    document.querySelectorAll(".input-mode-tab[data-image-mode]").forEach((tab) => {
      tab.addEventListener("click", () => this.switchImageMode(tab.dataset.imageMode));
    });

    document.getElementById("btnClosePreviewModal").addEventListener("click", () => this.closePostPreviewModal());
    document.getElementById("postPreviewModal").addEventListener("click", (e) => {
      if (e.target.closest("[data-close-modal]")) this.closePostPreviewModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closePostPreviewModal();
    });
    document.getElementById("previewPanel").addEventListener("click", (e) => {
      if (e.target.closest("#btnExpandGeneratedPost")) this.expandGeneratedPost();
    });

    document.getElementById("btnReloadSample").addEventListener("click", () => {
      this.initSamplePosts();
      this.loadSamples(false);
      this.applyLearnedFormat(this.getDefaultLearnedFormat());
      this.resetPreviewPlaceholder();
    });
    document.getElementById("btnStartLearn").addEventListener("click", () => this.startLearning());
    document.getElementById("btnFetchUrl").addEventListener("click", () => this.fetchFromUrl());
    document.getElementById("btnPrev").addEventListener("click", () => this.goStep(this.currentStep - 1));
    document.getElementById("btnNext").addEventListener("click", () => this.goStep(this.currentStep + 1));
    document.getElementById("btnGenerate").addEventListener("click", () => this.generatePost());
    document.getElementById("btnUpload").addEventListener("click", () => this.startUpload());
    document.getElementById("btnAddImageUrl").addEventListener("click", () => this.addImageFromUrl());

    const uploadZone = document.getElementById("uploadZone");
    const fileInput = document.getElementById("fileInput");

    uploadZone.addEventListener("click", () => fileInput.click());
    uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadZone.classList.add("dragover");
    });
    uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragover"));
    uploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadZone.classList.remove("dragover");
      this.handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener("change", (e) => this.handleFiles(e.target.files));

    document.getElementById("imageUrlInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.addImageFromUrl();
    });
  },

  switchInputMode(mode) {
    this.inputMode = mode;
    document.querySelectorAll(".input-mode-tab[data-mode]").forEach((t) => {
      t.classList.toggle("active", t.dataset.mode === mode);
    });
    document.getElementById("panelContent").classList.toggle("active", mode === "content");
    document.getElementById("panelUrl").classList.toggle("active", mode === "url");
  },

  switchImageMode(mode) {
    document.querySelectorAll(".input-mode-tab[data-image-mode]").forEach((t) => {
      t.classList.toggle("active", t.dataset.imageMode === mode);
    });
    document.getElementById("imagePanelFile").classList.toggle("active", mode === "file");
    document.getElementById("imagePanelUrl").classList.toggle("active", mode === "url");
  },

  async fetchFromUrl() {
    const urlInput = document.getElementById("sampleUrl");
    const url = urlInput.value.trim();
    if (!url) {
      DZV.showToast("블로그 게시글 URL을 입력해주세요", "error");
      return;
    }

    try {
      new URL(url);
    } catch {
      DZV.showToast("올바른 URL 형식을 입력해주세요", "error");
      return;
    }

    const parsed = this.parseNaverBlogUrl(url);
    if (!parsed) {
      DZV.showToast("네이버 블로그 URL 형식이 아닙니다 (blog.naver.com/아이디/글번호)", "error");
      return;
    }

    const btn = document.getElementById("btnFetchUrl");
    btn.disabled = true;
    btn.textContent = "가져오는 중...";

    await DZV.delay(800);

    const meta = this.registerUrl(url, true);
    if (meta) {
      this.appendUrlToLearning(url, meta);
      await this.startLearning(true);
    }
    this.switchInputMode("content");

    btn.disabled = false;
    btn.textContent = "가져오기";
    DZV.showToast("게시글을 불러왔습니다", "success");
  },

  async startLearning(fromUrl = false) {
    const input = document.getElementById("sampleInput").value.trim();
    if (!input) {
      DZV.showToast("학습할 게시글 내용이 필요합니다", "error");
      return;
    }

    const anim = document.getElementById("learningAnim");
    const btn = document.getElementById("btnStartLearn");
    anim.classList.remove("hidden");
    btn.disabled = true;

    const delay = fromUrl ? 600 : 400;
    await DZV.delay(delay);
    anim.querySelector(".learning-text").textContent = "게시글 구조 분석 중...";
    await DZV.delay(delay);
    anim.querySelector(".learning-text").textContent = "문체 및 키워드 패턴 추출 중...";
    await DZV.delay(delay);

    this.applyLearnedFormat({
      ...this.getDefaultLearnedFormat(),
      sampleCount: input.split("---").length,
      learnedAt: new Date().toISOString()
    });

    anim.classList.add("hidden");
    btn.disabled = false;
    if (!fromUrl) {
      DZV.showToast("게시글 형식 학습이 완료되었습니다", "success");
    }
  },

  handleFiles(files) {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImages.push({ name: file.name, data: e.target.result, source: "file" });
        this.renderImagePreviews();
      };
      reader.readAsDataURL(file);
    });
  },

  addImageFromUrl() {
    const input = document.getElementById("imageUrlInput");
    const url = input.value.trim();
    if (!url) {
      DZV.showToast("이미지 URL을 입력해주세요", "error");
      return;
    }

    try {
      new URL(url);
    } catch {
      DZV.showToast("올바른 URL 형식을 입력해주세요", "error");
      return;
    }

    const name = url.split("/").pop() || "image";
    this.uploadedImages.push({ name, data: url, source: "url" });
    input.value = "";
    this.renderImagePreviews();
    DZV.showToast("이미지 URL이 추가되었습니다", "success");
  },

  removeImage(index) {
    this.uploadedImages.splice(index, 1);
    this.renderImagePreviews();
  },

  renderImagePreviews() {
    const grid = document.getElementById("imagePreviewGrid");
    if (this.uploadedImages.length === 0) {
      grid.innerHTML = "";
      return;
    }
    grid.innerHTML = this.uploadedImages
      .map(
        (img, i) => `
        <div class="image-preview-item">
          <img src="${img.data}" alt="${img.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23eee%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3EURL%3C/text%3E%3C/svg%3E'">
          <span class="image-source-badge">${img.source === "url" ? "URL" : "파일"}</span>
          <button type="button" class="image-preview-remove" data-index="${i}">×</button>
        </div>`
      )
      .join("");

    grid.querySelectorAll(".image-preview-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeImage(parseInt(btn.dataset.index));
      });
    });
  },

  goStep(step) {
    if (step < 1 || step > 4) return;

    if (step > 1 && !this.learnedFormat) {
      DZV.showToast("먼저 게시글 형식을 학습해주세요", "error");
      return;
    }
    if (step > 2 && (!this.selectedCity || !this.selectedDistrict || !this.selectedBranch)) {
      if (!this.selectedCity) DZV.showToast("시·도를 선택해주세요", "error");
      else if (!this.selectedDistrict) DZV.showToast("구·군을 선택해주세요", "error");
      else DZV.showToast("지점을 선택해주세요", "error");
      return;
    }
    if (step > 2 && !this.selectedStyle) {
      DZV.showToast("게시글 스타일을 선택해주세요", "error");
      return;
    }

    this.currentStep = step;
    this.updateSteps();
  },

  updateSteps() {
    const total = this.stepMeta.length;
    const meta = this.stepMeta[this.currentStep - 1];

    document.querySelectorAll(".step").forEach((el, i) => {
      const num = i + 1;
      el.classList.remove("active", "completed");
      if (num < this.currentStep) el.classList.add("completed");
      if (num === this.currentStep) el.classList.add("active");
    });

    if (this.currentStep === 1 && this.learnedFormat) {
      document.querySelector('.step[data-step="1"]')?.classList.add("completed");
    }

    document.querySelectorAll(".step-panel").forEach((panel) => {
      panel.classList.toggle("active", parseInt(panel.dataset.step) === this.currentStep);
    });

    document.getElementById("stepCounter").textContent = `${this.currentStep} / ${total}`;
    document.getElementById("stepCurrentLabel").textContent = meta.label;

    const hintEl = document.getElementById("stepHint");
    if (this.currentStep === 2) {
      if (!this.selectedCity) {
        hintEl.textContent = "시·도를 선택하면 해당 지역의 구·군 목록이 표시됩니다.";
      } else if (!this.selectedDistrict) {
        hintEl.textContent = `${this.selectedCity}의 구·군을 선택해주세요.`;
      } else if (!this.selectedBranch) {
        const branches = DZV.regionConfig[this.selectedCity][this.selectedDistrict];
        if (branches.length === 0) {
          hintEl.textContent = "선택한 지역에 설정된 지점이 없습니다. 관리자에게 지점 등록을 요청하거나 다른 지역을 선택해주세요.";
        } else if (!this.selectedStyle) {
          hintEl.textContent = `${this.selectedDistrict}의 지점과 게시글 스타일을 선택해주세요.`;
        } else {
          hintEl.textContent = `${this.selectedDistrict}의 지점을 선택해주세요.`;
        }
      } else if (!this.selectedStyle) {
        hintEl.textContent = "게시글 스타일을 선택하면 다음 단계로 진행할 수 있습니다.";
      } else {
        hintEl.textContent = meta.hint;
      }
    } else {
      hintEl.textContent = meta.hint;
    }

    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const nextText = btnNext.querySelector(".step-nav-next-text");

    btnPrev.classList.toggle("hidden", this.currentStep === 1);

    if (this.currentStep === total) {
      btnNext.classList.add("hidden");
    } else {
      btnNext.classList.remove("hidden");
      nextText.textContent = `다음: ${meta.next}`;
    }
  },

  async generatePost() {
    if (!this.selectedBranch || !this.selectedStyle) {
      DZV.showToast("지점과 스타일을 먼저 선택해주세요", "error");
      return;
    }

    const btn = document.getElementById("btnGenerate");
    btn.disabled = true;
    btn.textContent = "생성 중...";
    this.showGenerateLoading();

    const loadingMessages = [
      "학습된 형식 분석 중...",
      "제목 및 본문 구성 중...",
      "이미지 배치 최적화 중...",
      "최종 검토 중..."
    ];

    for (const message of loadingMessages) {
      const textEl = document.getElementById("generateLoadingText");
      if (textEl) textEl.textContent = message;
      await DZV.delay(650 + Math.random() * 350);
    }

    const style = DZV.postStyles[this.selectedStyle];

    this.generatedPost = {
      title: HardcodedPost.title,
      body: HardcodedPost.getContent(),
      html: HardcodedPost.buildHtml(),
      branch: this.selectedBranch || "옆커폰 부개점",
      style: style.title,
      images: [...this.uploadedImages],
      createdAt: new Date()
    };

    this.reportGeneration("generated");

    this.renderPreview();
    btn.disabled = false;
    btn.textContent = "게시글 재생성";
    document.getElementById("uploadSection").classList.remove("hidden");
    DZV.showToast("게시글이 생성되었습니다", "success");
  },

  renderPreview() {
    const post = this.generatedPost;
    if (!post) return;

    const excerpt = post.html
      ? this.getPostExcerpt(post.html)
      : `${(post.body || "").slice(0, 140).trim()}${post.body?.length > 140 ? "…" : ""}`;

    document.getElementById("previewPanel").innerHTML = `
      <div class="preview-summary">
        <div class="preview-summary-header">
          <span class="preview-summary-badge">생성 완료</span>
          <p class="preview-summary-message">게시글이 생성되었습니다. 전체 내용은 <strong>자세히 보기</strong>에서 확인할 수 있습니다.</p>
        </div>
        <div class="preview-summary-body">
          <div class="preview-panel-toolbar">
            <div class="preview-title">${post.title}</div>
            <button type="button" class="btn btn-primary btn-sm" id="btnExpandGeneratedPost">자세히 보기</button>
          </div>
          <div class="preview-meta">
            <span>${post.branch}</span>
            <span>${post.style}</span>
            <span>${DZV.formatTime(post.createdAt)}</span>
          </div>
          <div class="preview-summary-excerpt-wrap">
            <p class="preview-summary-excerpt">${excerpt}</p>
            <div class="preview-summary-fade" aria-hidden="true"></div>
          </div>
        </div>
      </div>`;
  },

  async startUpload() {
    if (!this.generatedPost) {
      DZV.showToast("먼저 게시글을 생성해주세요", "error");
      return;
    }

    const btn = document.getElementById("btnUpload");
    const log = document.getElementById("uploadLog");
    const progress = document.getElementById("uploadProgress");
    btn.disabled = true;
    log.innerHTML = "";
    log.classList.remove("hidden");
    progress.classList.remove("hidden");

    const steps = [
      { msg: "블로그 플랫폼 연결 중...", pct: 10, type: "info" },
      { msg: "게시글 형식 검증 완료", pct: 25, type: "" },
      { msg: `제목 업로드: "${this.generatedPost.title.substring(0, 30)}..."`, pct: 40, type: "" },
      { msg: "본문 콘텐츠 업로드 중...", pct: 55, type: "" },
      { msg: `이미지 ${this.generatedPost.images.length}장 업로드 중...`, pct: 70, type: "" },
      { msg: "해시태그 및 메타데이터 설정", pct: 85, type: "" },
      { msg: "게시글 발행 완료", pct: 100, type: "" }
    ];

    for (const step of steps) {
      await DZV.delay(600 + Math.random() * 400);
      const line = document.createElement("div");
      line.className = `upload-log-line ${step.type}`;
      line.textContent = `[${DZV.formatTime(new Date())}] ${step.msg}`;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
      document.getElementById("progressFill").style.width = `${step.pct}%`;
    }

    this.reportToServer();
    btn.disabled = false;
    DZV.showToast("블로그에 게시글이 성공적으로 업로드되었습니다", "success");
  },

  reportGeneration(status) {
    const logs = DZV.loadState("server_generation_logs", []);
    const logId = `gen-${Date.now()}`;
    const entry = {
      id: logId,
      title: this.generatedPost.title,
      branch: this.generatedPost.branch,
      city: this.selectedCity,
      district: this.selectedDistrict,
      style: this.generatedPost.style,
      styleId: this.selectedStyle,
      formatSource: this.learnedFormat?.learnedAt ? "URL 자동 학습" : "샘플 게시글 학습",
      formatTone: this.learnedFormat?.tone || "친근하고 신뢰감 있는 존댓말",
      imageCount: this.uploadedImages.length,
      status,
      createdBy: "스튜디오 사용자",
      createdAt: new Date().toISOString(),
      uploadedAt: null
    };
    logs.unshift(entry);
    DZV.saveState("server_generation_logs", logs.slice(0, 50));
    this.generatedPost.logId = logId;
  },

  reportToServer() {
    const logs = DZV.loadState("server_generation_logs", []);
    const current = logs.find((l) => l.id === this.generatedPost.logId);
    if (current) {
      current.status = "uploaded";
      current.uploadedAt = new Date().toISOString();
      DZV.saveState("server_generation_logs", logs);
    }

    const activityLogs = DZV.loadState("server_activity", []);
    activityLogs.unshift({
      type: "upload",
      branch: this.generatedPost.branch,
      title: this.generatedPost.title,
      style: this.generatedPost.style,
      time: new Date().toISOString()
    });
    DZV.saveState("server_activity", activityLogs.slice(0, 50));

    const stats = DZV.loadState("server_stats", { totalPosts: 128, todayPosts: 5 });
    stats.totalPosts += 1;
    stats.todayPosts += 1;
    DZV.saveState("server_stats", stats);
  }
};

document.addEventListener("DOMContentLoaded", () => BlogApp.init());
