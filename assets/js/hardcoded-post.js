const HardcodedPost = {
  title: "휴대폰 저렴하게 구매하는 방법! 인천 휴대폰 성지 방문기",
  imageBase: "../assets/images/post/",

  img(file) {
    return `${this.imageBase}${file}`;
  },

  images: {
    storeLogo: "post-store-logo.png",
    certificate: "post-certificate.jpg",
    exteriorWide: "post-exterior-wide.jpg",
    exteriorDoor: "post-exterior-door.jpg",
    mapStatic: "post-map.jpg",
    stickerHello: "post-sticker-hello.png",
    stickerBye: "post-sticker-bye.png",
    collageInterior: [
      "post-interior-01.jpg",
      "post-interior-02.jpg",
      "post-interior-03.jpg",
      "post-interior-04.jpg"
    ],
    collageConsult: [
      "post-consult-01.jpg",
      "post-consult-02.jpg",
      "post-consult-03.jpg",
      "post-consult-04.jpg"
    ],
    collageRecommend: [
      "post-recommend-01.jpg",
      "post-recommend-02.jpg",
      "post-recommend-03.jpg",
      "post-recommend-04.jpg"
    ],
    collageAward: [
      "post-award-01.jpg",
      "post-award-02.jpg",
      "post-award-03.jpg",
      "post-award-04.jpg"
    ],
    collageBenefit: [
      "post-benefit-01.jpg",
      "post-benefit-02.jpg",
      "post-benefit-03.jpg",
      "post-benefit-04.jpg"
    ],
    collageSummary: [
      "post-summary-01.jpg",
      "post-summary-02.jpg",
      "post-summary-03.jpg",
      "post-summary-04.jpg"
    ]
  },

  textCenter(lines, extraClass = "") {
    const paragraphs = lines
      .map((line) => {
        if (line === "") return '<p class="se-text-paragraph se-text-paragraph-align-center"><span>​</span></p>';
        return `<p class="se-text-paragraph se-text-paragraph-align-center"><span>${line}</span></p>`;
      })
      .join("");
    return `<div class="se-component se-text se-l-default ${extraClass}">
      <div class="se-component-content">
        <div class="se-section se-section-text se-l-default">
          <div class="se-module se-module-text">${paragraphs}</div>
        </div>
      </div>
    </div>`;
  },

  quoteLine(lines) {
    const paragraphs = lines.map((line) => `<p class="se-text-paragraph"><span>${line}</span></p>`).join("");
    return `<div class="se-component se-quotation se-l-quotation_line">
      <div class="se-component-content">
        <div class="se-section se-section-quotation se-l-quotation_line">
          <blockquote class="se-quotation-container">
            <div class="se-module se-module-text se-quote">${paragraphs}</div>
          </blockquote>
        </div>
      </div>
    </div>`;
  },

  quoteUnderline(title) {
    return `<div class="se-component se-quotation se-l-quotation_underline">
      <div class="se-component-content">
        <div class="se-section se-section-quotation se-l-quotation_underline">
          <blockquote class="se-quotation-container">
            <div class="se-module se-module-text se-quote"><p class="se-text-paragraph"><span>${title}</span></p></div>
          </blockquote>
        </div>
      </div>
    </div>`;
  },

  image(src, alt = "") {
    return `<div class="se-component se-image se-l-default">
      <div class="se-component-content se-component-content-fit">
        <div class="se-section se-section-image se-l-default se-section-align-center">
          <div class="se-module se-module-image se-image-loaded">
            <img src="${src}" alt="${alt}" class="se-image-resource">
          </div>
        </div>
      </div>
    </div>`;
  },

  sticker(src) {
    return `<div class="se-component se-sticker se-l-default">
      <div class="se-component-content">
        <div class="se-section se-section-sticker se-section-align-center se-l-default">
          <div class="se-module se-module-sticker se-image-loaded">
            <img src="${src}" alt="" class="se-sticker-image">
          </div>
        </div>
      </div>
    </div>`;
  },

  map() {
    return `<div class="se-component se-placesMap se-l-default">
      <div class="se-component-content">
        <div class="se-section se-section-placesMap se-section-align-center se-l-default">
          <div class="se-module se-module-map-image">
            <img src="${this.img(this.images.mapStatic)}" alt="옆커폰 부개점 지도" class="se-map-image">
          </div>
          <div class="se-module se-module-map-text">
            <a href="#" class="se-map-info" onclick="return false;">
              <strong class="se-map-title">휴대폰성지 옆커폰 부개점</strong>
              <p class="se-map-address">인천광역시 부평구 부일로 30 1층</p>
            </a>
          </div>
        </div>
      </div>
    </div>`;
  },

  imageGroupCollage(files, widths = ["50%", "50%", "24%", "76%"]) {
    const urls = files.map((file) => this.img(file));
    const row1 = urls.slice(0, 2)
      .map((src, i) => `<div class="se-module se-module-image se-image-loaded" style="width:${widths[i] || "50%"}"><img src="${src}" alt="" class="se-image-resource"></div>`)
      .join("");
    const row2 = urls.slice(2, 4)
      .map((src, i) => `<div class="se-module se-module-image se-image-loaded" style="width:${widths[i + 2] || "50%"}"><img src="${src}" alt="" class="se-image-resource"></div>`)
      .join("");
    return `<div class="se-component se-imageGroup se-l-collage">
      <div class="se-component-content se-component-content-extend">
        <div class="se-section se-section-imageGroup se-l-collage">
          <div class="se-imageGroup-viewer">
            <div class="se-imageGroup-container">
              <div class="se-imageGroup-item se-imageGroup-col-2">${row1}</div>
              <div class="se-imageGroup-item se-imageGroup-col-2">${row2}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  buildHtml() {
    const i = this.images;
    const sections = [
      this.textCenter(['<b style="color:#b7b7b7">본 포스팅은, 업체로부터 제품과 소정의 원고료를 지원받아 작성된 후기입니다.</b>', "", "안녕하세요"]),
      this.sticker(this.img(i.stickerHello)),
      this.textCenter(["휴대폰 저렴하게 구매할 수 있는", "휴대폰성지 옆커폰 부개점 방문했어요", "바로 소개해드릴게요"]),
      this.map(),
      this.quoteLine(["휴대폰성지 옆커폰 부개점", "주소 - 인천 부평구 부일로 30 1층", '영업시간 - 월~토 11:00 ~ 19:30 (<span style="color:#f12f22">매주 일요일 정기휴무</span>)', "전화번호 - 0507-1351-0071"]),
      this.image(this.img(i.storeLogo), "휴대폰성지 옆커폰 부개점"),
      this.quoteUnderline("인천 휴대폰 성지를 찾게 된 이유(사전승낙서)"),
      this.image(this.img(i.certificate), "사전승낙서"),
      this.textCenter([
        "이동통신서비스 판매점과 알뜰폰 판매점 사전승낙서가 존재하는 휴대폰성지 옆커폰 부개점!", "",
        "아무래도 핸드폰은 요즘 필수로 사용하지만", "금액대는 너무 높아서 어디서 구매할지 고민이 많은데요", "",
        "인천부평구휴대폰성지인 옆커폰 부개점에 방문해서", "요즘 핸드폰 가격은 어떤지 확인하고 싶어서 방문했어요!"
      ]),
      this.quoteUnderline("휴대폰성지 옆커폰 부개점 위치 및 매장 분위기"),
      this.image(this.img(i.exteriorWide), "매장 외관"),
      this.image(this.img(i.exteriorDoor), "매장 유리문"),
      this.textCenter([
        "위치는 부개역과 부평역 사이에 있고", "역에서 10분정도? 걸으면 있는 곳에 있어서", "저는 편하게 걸어서 방문했어요!", "",
        "주차는 공간이 없어서 주변 공영주차장을 이용하시면 되는데요", "개인적으로 주차공간이 없기 때문에", "대중교통을 이용해서 방문하시는걸 추천드려요 ㅎㅎ"
      ]),
      this.imageGroupCollage(i.collageInterior),
      this.textCenter([
        "매장 분위기는 정말 쾌적했어요!", "한 눈이 볼 수 있게 핸드폰이 쫙 나열되어 있었고",
        "정보 관련해서도 한 눈이 볼 수 있도록", "표로 정리되어 있어서 보기가 편하더라고요 ㅎㅎ", "",
        "방문하자마자 시원하게 에어컨도 틀어져있어서", "더위도 날리고 넘 편하게 이용할 수 있었어요 ㅎㅎ",
        "직원분께서도 반갑게 인사해주셔서 넘 좋더라고요 ㅋㅋ"
      ]),
      this.quoteUnderline("기기변경·번호이동 상담 후기"),
      this.imageGroupCollage(i.collageConsult),
      this.textCenter([
        "기기변경과 번호이동에 대해서 상담을 받아봤는데요", "확실히 다른 곳 보다 투명한 가격으로 운영하고", "정확하게 알려주셔서 넘 좋더라고요", "",
        "핸드폰을 구매할 때 가장 중요한건 가격인데", "가격대도 저렴하게 확인할 수 있어서", "여기서 구매해도 좋겠는데? 라는 생각이 들었어요", "",
        "가까운 곳에 이렇게 저렴한 곳이 있다니", "정말 좋았어요 ㅋㅋ"
      ]),
      this.quoteUnderline("인천 휴대폰 싼곳으로 추천하는 이유"),
      this.imageGroupCollage(i.collageRecommend),
      this.textCenter(["휴대폰의 기종도 다양하고", "투명한 가격을 어필하기 때문에 확실히", "저렴하다는 생각이 많이 들었어요", ""]),
      this.imageGroupCollage(i.collageAward),
      this.textCenter([
        "옆커폰은 소비자선정 우수기업 브랜드에서", "대상을 탔고, 유튜브 실버버튼도 존재하도라고요!", "실버버튼을 실제로 처음봤는데 ㅋㅋ",
        "이렇게 받을 수 있는 이유가 있지 않을까요?", "", "상담도 정말 친절하시고 기분 좋게 핸드폰 상담을", "할 수 있어서 좋아요!", "",
        "당장 결정한다기보단 다른 매장에 가보면 알 수 있겠지만", "친절함도 핸드폰을 바꿀 때 중요한 부분 중 하나인데",
        "정말 친절하시고 가격대도 저렴해서", "인천부평휴대폰성지 핸드폰 싼 곳으로 유명한 것 같았어요 ㅎㅎ"
      ]),
      this.quoteUnderline("구매 혜택 및 할인 정보"),
      this.imageGroupCollage(i.collageBenefit, ["50%", "50%", "76%", "24%"]),
      this.textCenter([
        "인터넷과 티비를 같이 신청하게 되면", "현금으로는 최대 50만원 증정이 가능하고", "최대 170만원까지 혜택을 받을 수 있어요!!",
        "저렴하게 구매도하고 혜택도 확실하게 받을 수 있는", "인천부평휴대폰성지 옆커폰 부개점이에요 ㅎㅎ"
      ]),
      this.quoteUnderline("휴대폰성지 옆커폰 부개점 총평"),
      this.imageGroupCollage(i.collageSummary, ["43%", "57%", "50%", "50%"]),
      this.textCenter([
        "개인적으로 핸드폰을 구매하게된다면 정말 괜찮은 곳이다", "라고 느낄 수 있는 곳이였고",
        "매장 내에서 상담 받는것도 편안한 분위기라 정말 좋았어요!", "",
        "저는 체험단이라 고속충전기 제품을 받아왔는데", "아이폰 충전기인데 정말 빠르고 좋더라고요 ㅋㅋ",
        "이런 제품들도 퀄리티가 좋아서 아주 만족하고 왔답니당 ㅎㅎ", "", "그럼 전 다음 리뷰로 돌아올게요"
      ]),
      this.sticker(this.img(i.stickerBye)),
      this.textCenter([
        "#인천휴대폰성지 #인천부평구휴대폰성지 #인천휴대폰싼곳 #휴대폰성지옆커폰부개점 #옆커폰 #부개동휴대폰 #부평휴대폰 #부평핸드폰 #인천핸드폰성지 #휴대폰성지 #핸드폰성지 #휴대폰할인 #휴대폰구매 #기기변경 #번호이동 #스마트폰구매 #아이폰성지 #갤럭시성지 #휴대폰추천 #통신사혜택 #휴대폰매장 #인천휴대폰매장 #부평휴대폰성지 #휴대폰후기 #스마트폰 #휴대폰정보 #인천생활 #내돈내산 #휴대폰저렴하게 #성지추천"
      ])
    ];

    return `<div class="se-main-container">${sections.join("")}</div>`;
  },

  getContent() {
    return "휴대폰성지 옆커폰 부개점 방문 후기. 사전승낙서, 위치·매장 분위기, 기기변경·번호이동 상담, 구매 혜택 및 총평.";
  }
};
