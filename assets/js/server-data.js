const ServerData = {
  branches: [
    { id: "gangnam", name: "강남역점", blog: 12, cafe: 8, positive: 88, negative: 1, alert: false },
    { id: "yeoksam", name: "역삼점", blog: 9, cafe: 11, positive: 44, negative: 3, alert: true },
    { id: "bundang", name: "분당정자점", blog: 14, cafe: 6, positive: 81, negative: 0, alert: false },
    { id: "ilsan", name: "일산점", blog: 11, cafe: 7, positive: 85, negative: 1, alert: false }
  ],

  sentimentPosts: [
    {
      id: "sp-1",
      source: "cafe",
      sourceLabel: "옆커폰 카페",
      sentiment: "negative",
      title: "옆커폰 간판을 달고있더라도",
      branch: "공식 카페",
      topic: "간판·신뢰 주의",
      time: "18:04",
      minutesAgo: 3
    },
    {
      id: "sp-2",
      source: "blog",
      sourceLabel: "블로그",
      sentiment: "positive",
      title: "옆커폰 강남역점 갤럭시 S25 기변 후기 — 보조금 최대",
      branch: "강남역점",
      topic: "요금표대로 상담 만족",
      time: "13:41",
      minutesAgo: 24
    },
    {
      id: "sp-3",
      source: "cafe",
      sourceLabel: "카페",
      sentiment: "neutral",
      title: "분당 휴대폰 성지 어디? 옆커폰 vs 동네 대리점",
      branch: "분당정자점",
      topic: "가격 비교",
      time: "12:18",
      minutesAgo: 107
    },
    {
      id: "sp-4",
      source: "blog",
      sourceLabel: "블로그",
      sentiment: "negative",
      title: "역삼점 방문 후기 — 약속한 보조금과 실제 금액 차이",
      branch: "역삼점",
      topic: "보조금 불일치",
      time: "11:55",
      minutesAgo: 130
    },
    {
      id: "sp-5",
      source: "cafe",
      sourceLabel: "카페",
      sentiment: "positive",
      title: "일산점 번호이동 깔끔하게 처리받았어요",
      branch: "일산점",
      topic: "번호이동 만족",
      time: "10:30",
      minutesAgo: 215
    }
  ],

  keywords: [
    { id: "gangnam-holy", label: "강남 휴대폰 성지" },
    { id: "yeoksam-iphone", label: "역삼 아이폰16" },
    { id: "bundang-galaxy", label: "분당 갤럭시 보조금" },
    { id: "ilsan-port", label: "일산 번호이동" }
  ],

  keywordRankings: {
    "gangnam-holy": [
      { branch: "일산점", integrated: 1, blog: 2, change: 2, changeDir: "up" },
      { branch: "강남역점", integrated: 2, blog: 1, change: 1, changeDir: "up" },
      { branch: "분당정자점", integrated: 4, blog: 3, change: 0, changeDir: "same" },
      { branch: "역삼점", integrated: null, blog: 11, change: -5, changeDir: "down", notExposed: true }
    ],
    "yeoksam-iphone": [
      { branch: "강남역점", integrated: 3, blog: 2, change: 1, changeDir: "up" },
      { branch: "역삼점", integrated: null, blog: 14, change: -3, changeDir: "down", notExposed: true },
      { branch: "일산점", integrated: 5, blog: 4, change: 0, changeDir: "same" },
      { branch: "분당정자점", integrated: 7, blog: 6, change: -1, changeDir: "down" }
    ],
    "bundang-galaxy": [
      { branch: "분당정자점", integrated: 2, blog: 1, change: 2, changeDir: "up" },
      { branch: "강남역점", integrated: 5, blog: 3, change: 0, changeDir: "same" },
      { branch: "일산점", integrated: 6, blog: 5, change: 1, changeDir: "up" },
      { branch: "역삼점", integrated: 18, blog: 12, change: -2, changeDir: "down" }
    ],
    "ilsan-port": [
      { branch: "일산점", integrated: 1, blog: 1, change: 0, changeDir: "same" },
      { branch: "강남역점", integrated: 8, blog: 7, change: 1, changeDir: "up" },
      { branch: "분당정자점", integrated: 9, blog: 8, change: 0, changeDir: "same" },
      { branch: "역삼점", integrated: 15, blog: 10, change: -1, changeDir: "down" }
    ]
  },

  searchPreviews: {
    "gangnam-holy": [
      { rank: 1, type: "place", title: "옆커폰 일산점", desc: "일산동구 · 휴대폰 대리점 · 영업 중" },
      { rank: 2, type: "blog", title: "강남역 휴대폰 성지 옆커폰 강남역점 방문기", desc: "blog.naver.com/yeopkeopon_gangnam" },
      { rank: 3, type: "blog", title: "강남 휴대폰 성지 추천 — 보조금 비교", desc: "blog.naver.com/phone_review" }
    ]
  },

  cafePosts: [
    {
      id: "cafe-neg",
      type: "negative",
      typeLabel: "부정글",
      category: "지식공유 및 꿀팁",
      title: "옆커폰 간판을 달고있더라도",
      excerpt: "무작정 믿으면 안된다는걸 이번에 깨닫게 되었습니다. 다들 잘 알아보고, 확인하시고 구매하시길..",
      author: "NineDead",
      branch: "공식 카페",
      url: "https://cafe.naver.com/09tellecom/1345057",
      replies: 0,
      views: 7,
      postedAt: "2026-07-06 18:04",
      status: "urgent",
      statusLabel: "즉시 대응 필요"
    },
    {
      id: "cafe-q",
      type: "question",
      typeLabel: "질문글",
      category: "질문/답변",
      title: "신용이 안좋은데...",
      excerpt: "신용이 안좋은데 혜택 받고 현금 완납으로 기변 개통 가능 한건가요",
      author: "아이니하비",
      branch: "공식 카페",
      url: "https://cafe.naver.com/09tellecom/1344767",
      replies: 1,
      views: 12,
      postedAt: "2026-07-04 14:48",
      lastReplyAt: "2026-07-06 09:30",
      replyDelayDays: 2,
      replyAuthor: "부 매니저",
      replyContent:
        "안녕하세요! 😊 현금 완납 기기변경 가능 여부는 고객님의 통신사 이용 상태 및 개통 조건에 따라 달라질 수 있습니다. 가까운 옆커폰 매장에서 정확한 안내를 받아보시길 바라며, 아래 홈페이지에서 가까운 매장을 확인하실 수 있습니다. 🔗 https://www.yeopkerphone.co.kr/",
      status: "delayed",
      statusLabel: "답변 지연 (2일)"
    },
    {
      id: "cafe-pos",
      type: "positive",
      typeLabel: "긍정글",
      title: "강남역점 상담 친절하고 요금표대로 진행됐어요",
      excerpt: "처음 가본 휴대폰 대리점인데 상담이 깔끔했고 약속한 보조금 그대로 받았습니다. 추천합니다.",
      author: "만족고객***",
      branch: "강남역점",
      url: "https://cafe.naver.com/09tellecom/1344800",
      replies: 3,
      views: 89,
      postedAt: "2026-07-05 15:40",
      status: "normal",
      statusLabel: "정상"
    }
  ],

  contentGenerations: [
    {
      id: "gen-1",
      title: "휴대폰 저렴하게 구매하는 방법! 인천 휴대폰 성지 방문기",
      branch: "부평점",
      city: "인천광역시",
      district: "부평구",
      style: "방문 후기",
      styleId: "review",
      formatSource: "샘플 게시글 학습",
      formatTone: "친근하고 신뢰감 있는 존댓말, 방문 후기 형식",
      imageCount: 4,
      status: "uploaded",
      createdBy: "박점주",
      createdAt: "2026-07-06 13:48",
      uploadedAt: "2026-07-06 13:52"
    },
    {
      id: "gen-2",
      title: "휴대폰 저렴하게 구매하는 방법! 인천 휴대폰 성지 방문기",
      branch: "동암역점",
      city: "인천광역시",
      district: "부평구",
      style: "지점별 홍보용",
      styleId: "promotion",
      formatSource: "샘플 게시글 학습",
      formatTone: "친근하고 신뢰감 있는 존댓말, 방문 후기 형식",
      imageCount: 0,
      status: "generated",
      createdBy: "이관리",
      createdAt: "2026-07-06 11:20",
      uploadedAt: null
    },
    {
      id: "gen-3",
      title: "휴대폰 저렴하게 구매하는 방법! 인천 휴대폰 성지 방문기",
      branch: "강남역점",
      city: "서울특별시",
      district: "강남구",
      style: "창업 유도",
      styleId: "franchise",
      formatSource: "URL 자동 학습",
      formatTone: "친근하고 신뢰감 있는 존댓말, 방문 후기 형식",
      imageCount: 2,
      status: "uploaded",
      createdBy: "김본사",
      createdAt: "2026-07-05 16:05",
      uploadedAt: "2026-07-05 16:08"
    },
    {
      id: "gen-4",
      title: "휴대폰 저렴하게 구매하는 방법! 인천 휴대폰 성지 방문기",
      branch: "송도점",
      city: "인천광역시",
      district: "연수구",
      style: "방문 후기",
      styleId: "review",
      formatSource: "샘플 게시글 학습",
      formatTone: "친근하고 신뢰감 있는 존댓말, 방문 후기 형식",
      imageCount: 6,
      status: "uploaded",
      createdBy: "정매니저",
      createdAt: "2026-07-05 10:30",
      uploadedAt: "2026-07-05 10:34"
    },
    {
      id: "gen-5",
      title: "휴대폰 저렴하게 구매하는 방법! 인천 휴대폰 성지 방문기",
      branch: "역삼점",
      city: "서울특별시",
      district: "강남구",
      style: "지점별 홍보용",
      styleId: "promotion",
      formatSource: "샘플 게시글 학습",
      formatTone: "친근하고 신뢰감 있는 존댓말, 방문 후기 형식",
      imageCount: 1,
      status: "failed",
      createdBy: "최점주",
      createdAt: "2026-07-04 09:15",
      uploadedAt: null
    }
  ],

  telegramReports: [
    {
      id: "tg-1",
      type: "negative",
      title: "[긴급] 역삼점 부정 여론 3건 감지",
      summary: "보조금·요금표 불일치 관련 카페/블로그 게시글 3건",
      time: "14:05",
      sent: true
    },
    {
      id: "tg-2",
      type: "exposure",
      title: "[노출] 역삼점 '강남 휴대폰 성지' 통합검색 미노출",
      summary: "전일 대비 5단계 하락, 통합검색 30위 밖",
      time: "09:00",
      sent: true
    },
    {
      id: "tg-3",
      type: "cafe",
      title: "[카페] 부정글 신규 등록 — 역삼점",
      summary: "「옆커폰 간판을 달고있더라도」 부정글 신규 등록",
      time: "18:30",
      sent: true
    }
  ],

  telegramConfig: {
    connected: true,
    botName: "@YeopkeoponMonitorBot",
    chatName: "옆커폰 본사 관제방",
    subscribers: 12
  },

  telegramAlertDefaults: {
    globalEnabled: true,
    items: {
      sentiment: {
        label: "여론 모니터링",
        enabled: true,
        triggers: ["negative", "low_rate"],
        thresholds: { low_rate: 50 }
      },
      keywords: {
        label: "키워드 노출",
        enabled: true,
        triggers: ["not_exposed", "rank_drop"],
        thresholds: { rank_drop: 3 }
      },
      cafe: {
        label: "공식 카페",
        enabled: true,
        triggers: ["negative", "question_delay"],
        thresholds: { question_delay: 1 }
      },
      content: {
        label: "게시글 생성",
        enabled: false,
        triggers: ["uploaded"],
        thresholds: {}
      },
      daily: {
        label: "일일 종합 보고서",
        enabled: true,
        schedule: "09:00"
      }
    }
  },

  telegramTriggerOptions: {
    sentiment: [
      { value: "negative", label: "부정 게시글" },
      {
        value: "low_rate",
        label: "긍정률 미달",
        threshold: { key: "low_rate", suffix: "%", default: 50, min: 0, max: 100 }
      }
    ],
    keywords: [
      { value: "not_exposed", label: "통합검색 미노출" },
      {
        value: "rank_drop",
        label: "순위 하락",
        threshold: { key: "rank_drop", suffix: "단계", default: 3, min: 1, max: 30 }
      }
    ],
    cafe: [
      { value: "negative", label: "부정글" },
      {
        value: "question_delay",
        label: "답변 지연",
        threshold: { key: "question_delay", suffix: "일", default: 1, min: 1, max: 7 }
      }
    ],
    content: [
      { value: "uploaded", label: "업로드 완료" },
      { value: "generated", label: "생성 완료" },
      { value: "failed", label: "실패" }
    ]
  }
};
