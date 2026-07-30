export const site = {
  name: "竹島さんぽ",
  legalName: "竹島園地・竹島観光ガイド",
  domain: "GamagoriTakeshima.com",
  url: "https://gamagoritakeshima.com",
  description:
    "蒲郡・竹島園地から始まる、海と緑と祈りの観光ガイド。竹島橋、八百富神社、写真スポット、アクセス、駐車場、周辺ランチ、モデルコースを紹介します。",
  address: "〒443-0031 愛知県蒲郡市竹島町31",
  coordinates: {
    latitude: 34.8151165,
    longitude: 137.2335325
  },
  updatedAt: "2026年7月30日"
} as const;

export const navigation = [
  { label: "見どころ", href: "/highlights/" },
  { label: "モデルコース", href: "/courses/" },
  { label: "写真を撮る", href: "/photography/" },
  { label: "周辺グルメ", href: "/food/" },
  { label: "アクセス", href: "/access/" },
  { label: "よくある質問", href: "/faq/" }
] as const;

export const quickFacts = [
  { label: "蒲郡駅から", value: "徒歩 約15分", note: "南口から海へまっすぐ" },
  { label: "竹島橋", value: "全長 387m", note: "島まで海の上を歩く" },
  { label: "おすすめ滞在", value: "60分〜半日", note: "水族館との組み合わせも" },
  { label: "園地・島", value: "散策無料", note: "祈祷などは別途" }
] as const;

export const highlights = [
  {
    number: "01",
    title: "竹島園地",
    subtitle: "海風と余白を楽しむ",
    description:
      "芝生の向こうに竹島と竹島橋を望む、旅の入口。歩く前に海を眺め、戻ったあとにひと息つける、静かな海辺の居場所です。",
    image: "/images/bridge-seaside.webp",
    alt: "竹島園地の海辺から望む竹島橋",
    href: "/highlights/#enchi"
  },
  {
    number: "02",
    title: "竹島橋",
    subtitle: "海を渡る387メートル",
    description:
      "左右に三河湾を感じながら島へ向かう、竹島を象徴する一本の橋。朝、夕暮れ、青の時間で表情が変わります。",
    image: "/images/bridge-wide.webp",
    alt: "三河湾に架かる竹島橋",
    href: "/highlights/#bridge"
  },
  {
    number: "03",
    title: "八百富神社",
    subtitle: "緑の社叢に包まれる",
    description:
      "島の中央に鎮座する神社。鳥居をくぐり、石段を上がると、海辺とは違う濃い緑と静けさに包まれます。",
    image: "/images/yaotomi-shrine.webp",
    alt: "竹島の八百富神社",
    href: "/highlights/#shrine"
  },
  {
    number: "04",
    title: "島の自然",
    subtitle: "社叢と岩礁をめぐる",
    description:
      "暖地性植物の社叢を抜け、海沿いの道へ。参拝だけで終わらず、足元に気をつけながら小さな島を一周するのもおすすめです。",
    image: "/images/shrine-forest.webp",
    alt: "八百富神社の社叢に続く参道",
    href: "/highlights/#nature"
  }
] as const;

export const courses = [
  {
    id: "classic",
    label: "はじめて",
    duration: "60〜90分",
    title: "竹島をまっすぐ味わう",
    summary: "園地、橋、神社、島の海辺を無理なくつなぐ定番コース。",
    image: "/images/torii-bridge.webp",
    steps: [
      { time: "0:00", place: "竹島園地", detail: "芝生と海辺から島の全景を眺める" },
      { time: "0:15", place: "竹島橋", detail: "海風を感じながら島へ渡る" },
      { time: "0:30", place: "八百富神社", detail: "石段を上がり、境内をゆっくり参拝" },
      { time: "0:50", place: "島の海辺", detail: "天候と足元を見ながら外周を歩く" },
      { time: "1:15", place: "園地へ戻る", detail: "橋越しの景色をもう一度楽しむ" }
    ]
  },
  {
    id: "family",
    label: "親子・雨の日",
    duration: "半日",
    title: "水族館と海辺を楽しむ",
    summary: "屋内と屋外を組み合わせ、子どものペースで巡る半日プラン。",
    image: "/images/aquarium-crab.webp",
    steps: [
      { time: "9:00", place: "竹島水族館", detail: "深海生物や手書き解説をじっくり見る" },
      { time: "11:00", place: "周辺で昼食", detail: "うどん、海鮮、ホテルランチから選ぶ" },
      { time: "12:15", place: "竹島園地", detail: "芝生で休憩し、海の様子を確認" },
      { time: "12:40", place: "竹島橋", detail: "風が強い日は橋詰まででも十分" },
      { time: "13:15", place: "海辺の散歩", detail: "体力に合わせて神社参拝または園地散策" }
    ]
  },
  {
    id: "sunset",
    label: "写真・ふたり旅",
    duration: "午後〜夜",
    title: "夕景から灯りの時間へ",
    summary: "高台の眺め、園地の夕暮れ、橋の青い時間をつなぐ写真コース。",
    image: "/images/classic-hotel.webp",
    steps: [
      { time: "15:00", place: "高台の眺望", detail: "蒲郡クラシックホテル周辺から島を望む" },
      { time: "16:00", place: "俊成苑・園地", detail: "光がやわらぐ時間に海辺を歩く" },
      { time: "日没前", place: "竹島橋の西側", detail: "空と海の色が変わる瞬間を待つ" },
      { time: "日没後", place: "橋詰・園地", detail: "青の時間と橋の灯りを撮る" },
      { time: "夜", place: "蒲郡駅方面へ", detail: "暗い足元と最終交通を確認して戻る" }
    ]
  }
] as const;

export const restaurants = [
  {
    name: "手打ちうどん やをよし",
    category: "蒲郡らしい一杯",
    lead: "あさりの旨みを味わう「竹島うどん」",
    description:
      "竹島観光の前後に立ち寄りやすい老舗。宗田かつおのだし、白醤油、あさり、手打ちの太麺を合わせた一杯が名物です。",
    hours: "11:00〜14:20／17:00〜20:00",
    closed: "月曜、第2・第4火曜",
    budget: "1,000〜2,000円目安",
    address: "愛知県蒲郡市竹島町7-12",
    tags: ["うどん", "あさり", "家族向け"]
  },
  {
    name: "レストラン リヴァージュ",
    category: "海を眺めるランチ",
    lead: "ホテル竹島で味わう洋食",
    description:
      "竹島と三河湾を望むホテル内レストラン。観光地から移動を増やさず、景色と落ち着いた食事を両立したい日に向きます。",
    hours: "昼 11:00〜15:00／夜 17:00〜21:00",
    closed: "不定休あり",
    budget: "ランチ 2,000円台〜目安",
    address: "愛知県蒲郡市竹島町1-6 ホテル竹島",
    tags: ["洋食", "眺望", "記念日"]
  },
  {
    name: "日本料理 常磐",
    category: "三河湾の和食",
    lead: "海のそばで季節の料理を",
    description:
      "ホテル竹島内の日本料理店。海鮮や会席を落ち着いて楽しみたい人、三世代での旅行や節目の食事におすすめです。",
    hours: "昼 11:00〜15:00／夜 17:00〜21:00",
    closed: "不定休あり",
    budget: "内容により異なる",
    address: "愛知県蒲郡市竹島町1-6 ホテル竹島",
    tags: ["和食", "海鮮", "会食"]
  },
  {
    name: "蒲郡クラシックホテル",
    category: "景色ごと味わう",
    lead: "歴史ある館でフレンチや喫茶",
    description:
      "高台から竹島を一望できる歴史的ホテル。メインダイニング、鉄板焼、ティーラウンジなど、旅の時間に合わせて選べます。",
    hours: "店舗・時間帯により異なる",
    closed: "営業日を事前確認",
    budget: "喫茶〜コース料理",
    address: "愛知県蒲郡市竹島町15-1",
    tags: ["眺望", "喫茶", "フレンチ"]
  },
  {
    name: "魚々の里 とまりん",
    category: "魚を気軽に",
    lead: "地魚や深海魚を楽しむ",
    description:
      "竹島ファンタジー館に隣接。蒲郡らしい魚料理を気軽に食べたいときの候補です。売り切れや季節メニューもあるため早めの来店が安心です。",
    hours: "平日 11:00〜14:00頃／土日祝 〜15:00頃",
    closed: "水曜",
    budget: "メニューにより異なる",
    address: "愛知県蒲郡市竹島町28-14 周辺",
    tags: ["魚料理", "深海魚", "カジュアル"]
  }
] as const;

export const faqItems = [
  {
    question: "竹島園地と竹島に入場料はかかりますか？",
    answer:
      "竹島園地、竹島橋、島の散策と通常の参拝は無料です。ご祈祷、授与品、周辺施設の入館には別途料金がかかります。"
  },
  {
    question: "見学にはどのくらい時間が必要ですか？",
    answer:
      "園地と橋だけなら30〜45分、八百富神社の参拝と島の海辺まで歩くなら60〜90分が目安です。竹島水族館や食事を組み合わせる場合は半日あるとゆったり楽しめます。"
  },
  {
    question: "JR蒲郡駅から歩けますか？",
    answer:
      "蒲郡駅南口から竹島園地までは徒歩約15分です。大きな高低差は少なく、駅から海側へ進む分かりやすい道のりです。バスやタクシーも利用できます。"
  },
  {
    question: "駐車場はありますか？",
    answer:
      "竹島園地駐車場があり、普通車約200台が目安です。平日は原則無料ですが、春や土日祝などは時期により有料になります。行事開催時は利用制限が生じることがあります。"
  },
  {
    question: "ベビーカーや車いすで行けますか？",
    answer:
      "園地と竹島橋は比較的平坦です。一方、島内の神社へは石段があり、海辺の外周には自然の岩場や段差があります。無理をせず、園地・橋詰・水族館を中心に組み立ててください。"
  },
  {
    question: "雨の日でも楽しめますか？",
    answer:
      "竹島水族館を中心にし、雨が弱い時間だけ園地や橋詰を歩くコースがおすすめです。橋上は風を遮るものが少なく、強風や雷、荒天時は渡島を控えてください。"
  },
  {
    question: "写真を撮るなら何時ごろがおすすめですか？",
    answer:
      "落ち着いた光なら朝、空と海の色の変化なら日没前後がおすすめです。橋は逆光になりやすいため、撮りたい方向と太陽の位置を確認して余裕を持って到着しましょう。"
  },
  {
    question: "竹島水族館と同じ日に回れますか？",
    answer:
      "徒歩圏にあるため相性の良い組み合わせです。水族館を午前、昼食後に園地と竹島を巡ると、混雑や天候に合わせて調整しやすくなります。"
  },
  {
    question: "八百富神社の社務所は何時までですか？",
    answer:
      "目安は9:00〜17:00で、御朱印の受付は16:30頃までと案内されています。祭事や都合により変わることがあるため、授与品や御朱印が目的の場合は早めの参拝が安心です。"
  },
  {
    question: "犬を連れて歩けますか？",
    answer:
      "屋外では周囲に配慮し、リードや排泄物の処理など基本的なマナーを守ってください。神社境内や各施設には個別のルールがあるため、現地表示を優先してください。竹島水族館は補助犬を除きペット同伴不可です。"
  }
] as const;

export const photoCredits = [
  {
    file: "hero-aerial.webp / og-image.jpg",
    subject: "高台から見た竹島",
    author: "火の見櫓と狛犬",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:%E5%B1%95%E6%9C%9B%E5%AE%A4%E3%81%8B%E3%82%89%E8%A6%8B%E3%81%9F%E7%AB%B9%E5%B3%B6_%E2%80%BB%E9%9D%9E%E5%85%AC%E9%96%8B.jpg"
  },
  {
    file: "bridge-wide.webp",
    subject: "竹島橋",
    author: "Alpsdake",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Takeshima_Bridge.jpg"
  },
  {
    file: "torii-bridge.webp",
    subject: "鳥居と竹島橋",
    author: "Mikkabie",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:%E6%84%9B%E7%9F%A5%E7%9C%8C%E8%92%B2%E9%83%A1%E5%B8%82%E7%AB%B9%E5%B3%B63.JPG"
  },
  {
    file: "shrine-forest.webp",
    subject: "八百富神社の社叢",
    author: "さかおり",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Guardian_Forest_of_Yaotomi_Shrine._Gamagori,_Aichi._A.jpg"
  },
  {
    file: "yaotomi-shrine.webp",
    subject: "八百富神社",
    author: "Hyppolyte de Saint-Rambert",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Yaotomi-jinja_shinotsu_(Gamagori_Aichi)_VLux5_hdsr_22.jpg"
  },
  {
    file: "aquarium-crab.webp",
    subject: "竹島水族館の展示",
    author: "Evelyn-rose",
    license: "CC0 1.0",
    source: "https://commons.wikimedia.org/wiki/File:Takeshima-Aquarium-4.jpg"
  },
  {
    file: "aquarium-goldfish.webp",
    subject: "竹島水族館の金魚",
    author: "円周率３パーセント",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Aichi_Gamagori_c20250802_1552_%E7%AB%B9%E5%B3%B6%E6%B0%B4%E6%97%8F%E9%A4%A8_%E9%87%91%E9%AD%9A.jpg"
  },
  {
    file: "classic-hotel.webp",
    subject: "蒲郡クラシックホテル",
    author: "Lombroso",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Gamagori_Classic_Hotel_(2018-05-19)_09.jpg"
  },
  {
    file: "bridge-seaside.webp",
    subject: "海辺から見た竹島橋",
    author: "Mikkabie",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:%E6%84%9B%E7%9F%A5%E7%9C%8C%E8%92%B2%E9%83%A1%E5%B8%82%E7%AB%B9%E5%B3%B6.JPG"
  },
  {
    file: "bridge-walk.webp",
    subject: "竹島橋を歩く風景",
    author: "Mikkabie",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:%E6%84%9B%E7%9F%A5%E7%9C%8C%E8%92%B2%E9%83%A1%E5%B8%82%E7%AB%B9%E5%B3%B62.JPG"
  },
  {
    file: "takeshima-distance.webp",
    subject: "遠景の竹島",
    author: "Alpsdake",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Take_Island_from_Mount_Togami.jpg"
  }
] as const;
