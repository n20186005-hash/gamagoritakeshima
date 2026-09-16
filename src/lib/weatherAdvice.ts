// 天気データ → 観光客向けの実行可能なアドバイスへ変換する純関数モジュール。
// サーバー側（SSG のビルド時）とブラウザ側（ライブ更新）の両方から利用する。

const WMO: Record<number, { label: string; emoji: string }> = {
  0: { label: "快晴", emoji: "☀️" },
  1: { label: "大体晴れ", emoji: "🌤️" },
  2: { label: "晴れ時々曇り", emoji: "⛅" },
  3: { label: "曇り", emoji: "☁️" },
  45: { label: "霧", emoji: "🌫️" },
  48: { label: "霧氷", emoji: "🌫️" },
  51: { label: "弱い霧雨", emoji: "🌦️" },
  53: { label: "霧雨", emoji: "🌦️" },
  55: { label: "強い霧雨", emoji: "🌦️" },
  56: { label: "着氷性霧雨", emoji: "🌧️" },
  57: { label: "着氷性霧雨", emoji: "🌧️" },
  61: { label: "弱い雨", emoji: "🌦️" },
  63: { label: "雨", emoji: "🌧️" },
  65: { label: "強い雨", emoji: "🌧️" },
  66: { label: "着氷性雨", emoji: "🌧️" },
  67: { label: "着氷性雨", emoji: "🌧️" },
  71: { label: "弱い雪", emoji: "🌨️" },
  73: { label: "雪", emoji: "🌨️" },
  75: { label: "強い雪", emoji: "❄️" },
  77: { label: "雪粒", emoji: "🌨️" },
  80: { label: "にわか雨", emoji: "🌦️" },
  81: { label: "にわか雨", emoji: "🌧️" },
  82: { label: "強いにわか雨", emoji: "⛈️" },
  85: { label: "にわか雪", emoji: "🌨️" },
  86: { label: "強いにわか雪", emoji: "🌨️" },
  95: { label: "雷雨", emoji: "⛈️" },
  96: { label: "雷雨・雹", emoji: "⛈️" },
  99: { label: "激しい雷雨", emoji: "⛈️" },
};

export const describe = (code: unknown): { label: string; emoji: string } =>
  WMO[Number(code)] ?? { label: "—", emoji: "🌡️" };

// 風速(km/h) → ビューフォート階級
export const beaufort = (kmh: number): { level: number; label: string } => {
  const v = Number(kmh) || 0;
  let level = 0;
  if (v >= 118) level = 12;
  else if (v >= 103) level = 11;
  else if (v >= 89) level = 10;
  else if (v >= 75) level = 9;
  else if (v >= 62) level = 8;
  else if (v >= 50) level = 7;
  else if (v >= 39) level = 6;
  else if (v >= 29) level = 5;
  else if (v >= 20) level = 4;
  else if (v >= 12) level = 3;
  else if (v >= 6) level = 2;
  else if (v >= 1) level = 1;
  let label = "無風";
  if (level >= 9) label = "非常に強い風";
  else if (level >= 7) label = "強風";
  else if (level >= 5) label = "強めの風";
  else if (level >= 3) label = "弱い風";
  else if (level >= 1) label = "微風";
  return { level, label };
};

export const forecastUrl = (lat: number | string, lon: number | string): string =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,uv_index` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
  `&timezone=Asia%2FTokyo&forecast_days=7`;

export const warningsUrl = (lat: number | string, lon: number | string): string =>
  `https://api.open-meteo.com/v1/warnings?latitude=${lat}&longitude=${lon}`;

export const normalizeWarnings = (json: any): { event: string }[] => {
  if (!json || !Array.isArray(json.warnings)) return [];
  return json.warnings
    .map((w: any) => ({ event: w?.event || w?.name || "気象警報" }))
    .filter((w: { event: string }) => w.event);
};

export const marineUrl = (lat: number | string, lon: number | string): string =>
  `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
  `&current=wave_height,sea_surface_temperature&timezone=Asia%2FTokyo`;

export const normalizeMarine = (json: any): { temp: number | string; wave: number | string } | null => {
  const c = json?.current;
  if (!c) return null;
  const wt = num(c.sea_surface_temperature, NaN);
  const wv = num(c.wave_height, NaN);
  return {
    temp: Number.isFinite(wt) ? Math.round(wt) : "—",
    wave: Number.isFinite(wv) ? Math.round(wv * 10) / 10 : "—",
  };
};

export const tideUrl = (point: string, date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `https://api.shiome.co.jp/v1/tide?point=${encodeURIComponent(point)}&year=${y}&month=${m}&day=${d}`;
};

export const normalizeTide = (
  json: any,
): { highs: { time: string; h: number | string }[]; lows: { time: string; h: number | string }[] } | null => {
  const arr: any[] | null = json?.tide?.tide ?? json?.tide ?? (Array.isArray(json) ? json : null);
  if (!Array.isArray(arr)) return null;
  const pts = arr
    .map((e: any) => ({ time: String(e?.time ?? ""), h: num(e?.h, NaN) }))
    .filter((p: { time: string; h: number }) => p.time && Number.isFinite(p.h));
  if (pts.length < 2) return null;
  const highs: { time: string; h: number | string }[] = [];
  const lows: { time: string; h: number | string }[] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[i - 1];
    const next = pts[i + 1];
    const greater = (prev ? pts[i].h > prev.h : true) && (next ? pts[i].h > next.h : true);
    const smaller = (prev ? pts[i].h < prev.h : true) && (next ? pts[i].h < next.h : true);
    if (greater) highs.push(pts[i]);
    else if (smaller) lows.push(pts[i]);
  }
  if (!highs.length && !lows.length) return null;
  return { highs, lows };
};

export type JmaTide = {
  highs: { time: string; h: number | string }[];
  lows: { time: string; h: number | string }[];
  source: string;
};

// 地点 → 気象庁検潮場コード（蒲郡は三河湾奥、最寄りは名古屋港 NG）
export const jmaTideStationFor = (point: string): string => (point.includes("蒲郡") ? "NG" : "NG");

const JMA_STATION_LABEL: Record<string, string> = { NG: "名古屋港" };

export const parseJmaTide = (
  html: string,
  stn = "NG",
): JmaTide | null => {
  const rows = [...html.matchAll(/<tr[^>]*align="right"[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
  const row = rows.find((r) => (r.match(/<td/g) || []).length >= 18);
  if (!row) return null;
  const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
  );
  if (cells.length < 18) return null;
  const pick = (base: number) => {
    const out: { time: string; h: number | string }[] = [];
    for (let i = 0; i < 4; i++) {
      const time = cells[base + i * 2];
      const h = cells[base + i * 2 + 1];
      if (time && time !== "*" && /\d/.test(time)) {
        out.push({ time, h: /^\d+$/.test(h) ? Number(h) : "—" });
      }
    }
    return out;
  };
  const highs = pick(2); // 満潮: cells[2..9]
  const lows = pick(10); // 干潮: cells[10..17]
  if (!highs.length && !lows.length) return null;
  const label = JMA_STATION_LABEL[stn] ?? stn;
  return { highs, lows, source: `気象庁 潮位表・${label}` };
};

// ビルド時フォールバック：気象庁 潮位表（HTML）を POST で取得し解析。
// 页面偶発的に表を返さないため最大3回リトライし、失敗時は null で優雅に退化。
export const fetchJmaTide = async (
  stn: string,
  date: { y: number; m: number; d: number },
  opts: { signal?: AbortSignal } = {},
): Promise<JmaTide | null> => {
  const url = "https://www.data.jma.go.jp/kaiyou/db/tide/suisan/suisan.php";
  const mm = String(date.m).padStart(2, "0");
  const dd = String(date.d).padStart(2, "0");
  const body = new URLSearchParams({
    stn,
    ys: String(date.y),
    ms: mm,
    ds: dd,
    ye: String(date.y),
    me: mm,
    de: dd,
    LV: "DL",
    S_HILO: "on",
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "User-Agent": "gamagoritakeshima/1.0 (+https://gamagoritakeshima.com)",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        signal: opts.signal,
      });
      if (!r.ok) continue;
      const html = await r.text();
      const parsed = parseJmaTide(html, stn);
      if (parsed) return parsed;
    } catch {
      /* 次回リトライ */
    }
    if (attempt < 2 && opts.signal && !opts.signal.aborted) {
      await new Promise((res) => setTimeout(res, 400));
    }
  }
  return null;
};

const num = (v: unknown, fb = NaN): number => {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
};
const round = (v: unknown, fb: number | string = "—"): number | string => {
  const x = num(v);
  return Number.isFinite(x) ? Math.round(x) : fb;
};

export interface WeatherAdvice {
  summary: string;
  cards: { label: string; value: string; sub?: string }[];
  risk: string[];
  travel: string[];
  play: string[];
  carry: string[];
  seaside?: {
    temp: number | string;
    wave: number | string;
    highs: { time: string; h: number | string }[];
    lows: { time: string; h: number | string }[];
    hasTide: boolean;
  };
  forecast: {
    md: string;
    wd: string;
    emoji: string;
    label: string;
    max: number | string;
    min: number | string;
    pop: number | string;
    isToday: boolean;
  }[];
}

export const buildWeatherAdvice = (raw: any): WeatherAdvice => {
  const current = raw?.current ?? {};
  const daily = raw?.daily ?? {};
  const warnings = Array.isArray(raw?.warnings) ? raw.warnings : [];

  const nowCode = Number(current.weather_code);
  const todayCode = Number(daily.weather_code?.[0]);
  const codes = [nowCode, todayCode].filter((c) => Number.isFinite(c));

  const has = (arr: number[]) => codes.some((c) => arr.includes(c));
  const isFog = has([45, 48]);
  const isDrizzle = has([51, 53, 55, 56, 57, 61, 80]);
  const isHeavyRain = has([63, 65, 81, 82]);
  const isThunder = has([95, 96, 99]);
  const isRain = isDrizzle || isHeavyRain || isThunder;

  const pop = round(daily.precipitation_probability_max?.[0]);
  const popHigh = typeof pop === "number" && pop >= 60;

  const max = round(daily.temperature_2m_max?.[0]);
  const min = round(daily.temperature_2m_min?.[0]);
  const nowTemp = round(current.temperature_2m);
  const feels = round(current.apparent_temperature);
  const isHot = typeof max === "number" && max >= 32;
  const isCold = typeof max === "number" && max <= 10;
  const bigDiff = typeof max === "number" && typeof min === "number" && max - min > 8;

  const windKmh = num(current.wind_speed_10m, 0);
  const b = beaufort(windKmh);
  const windStrong = b.level >= 7;
  const windMid = b.level >= 5 && b.level <= 6;

  const uvMax = num(daily.uv_index_max?.[0] ?? current.uv_index, NaN);
  const uvHigh = Number.isFinite(uvMax) && uvMax >= 5;
  const uvMod = Number.isFinite(uvMax) && uvMax >= 3 && uvMax < 5;

  const humidity = round(current.relative_humidity_2m);

  const travel: string[] = [];
  const play: string[] = [];
  const carrySet = new Set<string>();
  const risk: string[] = [];
  const pushCarry = (...items: string[]) => items.forEach((i) => carrySet.add(i));

  if (isThunder) {
    risk.push("雷に注意。登山・海辺での水遊び・木の下での避雨は避けてください");
    play.push("水上アクティビティは中止の可能性が高いです");
  }
  if (isHeavyRain) {
    risk.push("雨が強くなります。谷や低い土地は避けてください");
    play.push("屋外の散策は控えめに。遊覧船・ロープウェー等が運休の可能性があります");
    pushCarry("レインコート（風が強いので長傘は避けて）");
  }
  if (isDrizzle) {
    travel.push("小雨が残ります。足元が滑りやすいので歩行に注意してください");
    play.push("屋外の体験型展示は見どころが減ります");
    pushCarry("折りたたみ傘");
  }
  if (popHigh && !isRain) {
    travel.push("降水確率が高めです。雨具を携帯すると安心です");
    play.push("屋内施設を優先し、登山や海辺の散策は控えめに");
    pushCarry("折りたたみ傘 / レインコート");
  }
  if (isFog) {
    risk.push("視界が悪く、フェリーや便の遅れが出ます");
    play.push("海や山の展望には向きません");
    pushCarry("マスク");
  }
  if (windStrong) {
    risk.push("強風です。看板や海辺の岩場から離れてください");
    play.push("屋外の海上アクティビティは中止の可能性が高いです");
  } else if (windMid) {
    travel.push("風がやや強いです");
    play.push("海辺の遊覧船や一部の屋外施設が運航・運転を見合わせる場合があります");
    pushCarry("帽子は飛びやすいので、ゆったりしたロングスカートは避えてください");
  }
  if (isHot) {
    travel.push("気温が高いので、日中の外出は避けて涼しい時間帯に");
    play.push("屋外の滞在時間を短めにしてください");
    pushCarry("日焼け止め", "十分な飲み物", "熱中症対策");
  }
  if (isCold) {
    travel.push("気温が低いので防寒をしてください");
    pushCarry("厚手の上着", "マフラー");
  }
  if (bigDiff && !isCold) {
    travel.push("朝晩の寒暖差が大きいので、羽織るものがあると調節しやすいです");
  }
  if (uvHigh) {
    travel.push("紫外線が強いので日焼け対策をしてください");
    pushCarry("日焼け止め", "サングラス", "帽子");
  } else if (uvMod) {
    travel.push("紫外線がやや強いので軽い日焼け対策を");
  }

  const clearish = !isRain && !isFog && !windStrong && b.level < 5;
  if (codes.includes(0) || codes.includes(1)) {
    if (clearish) {
      travel.push("天気が良く、屋外の散策に向いています");
      play.push("日の出・日の入りの景色もおすすめです");
      pushCarry("日焼け止め");
    }
  } else if (codes.includes(2) || codes.includes(3)) {
    if (clearish) {
      travel.push("柔らかい光で撮影に向いています");
      play.push("日差しが強くないので長時間の屋外散策にぴったりです");
    }
  }

  if (warnings.length) {
    for (const w of warnings) {
      risk.unshift(
        `【⚠️ 気象警報】${w.event} が発表されています。計画を見直し、山や海などの危険な場所へはできるだけ近づかないでください。天候の変化に注意しましょう。`,
      );
    }
  }

  const marine = normalizeMarine(raw?.marine);
  type TideData = {
    highs: { time: string; h: number | string }[];
    lows: { time: string; h: number | string }[];
    source?: string;
  };
  const tideRaw = raw?.tide;
  const tide: TideData | null =
    tideRaw && Array.isArray((tideRaw as TideData).highs)
      ? (tideRaw as TideData)
      : normalizeTide(tideRaw);
  if (marine) {
    const waveNum = typeof marine.wave === "number" ? marine.wave : NaN;
    const tempNum = typeof marine.temp === "number" ? marine.temp : NaN;
    if (Number.isFinite(waveNum)) {
      if (waveNum >= 1.5) {
        risk.push("波が高めです。海辺の岩場や磯場には近づかないでください");
        play.push("遊覧船や海上アクティビティは運休・中止の可能性があります");
      } else if (waveNum >= 1.0) {
        play.push("波が少しあるので、磯場や岩場では足元にご注意ください");
      } else {
        play.push("波が穏やかで、海辺でのんびり過ごしやすいです");
      }
    }
    if (Number.isFinite(tempNum)) {
      if (tempNum <= 17) travel.push("海水温が低めです。長時間の海水浴や飛込みは控えめに");
      else if (tempNum >= 24) play.push("海水温が高く、磯遊びや水辺の散策がしやすい季節です");
    }
    if (tide) {
      play.push("干潮の時間帯は磯や貝殻、岩場の観察におすすめです（足元と満ち引きに注意）");
      pushCarry("磯遊びには滑りにくい靴（マリンシューズ等）");
    }
  }

  const codeNow = describe(nowCode);
  const uvPart = uvHigh ? "紫外線強" : uvMod ? "紫外線やや強" : "";
  const summary = [
    `現在：${codeNow.label}`,
    `${min}〜${max}℃`,
    `降水確率 ${pop}%`,
    b.label,
  ]
    .concat(uvPart ? [uvPart] : [])
    .join("｜");

  const cards = [
    { label: "現在の気温", value: `${nowTemp}℃`, sub: `体感 ${feels}℃` },
    { label: "今日の最高・最低", value: `${max}℃ / ${min}℃` },
    { label: "天気", value: codeNow.label, sub: codeNow.emoji },
    { label: "降水確率", value: `${pop}%` },
    { label: "風", value: `${Math.round(windKmh)} km/h`, sub: b.label },
    { label: "湿度", value: `${humidity}%` },
  ];

  const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
  const forecast = (daily.time ?? []).map((iso: string, i: number) => {
    const d = new Date(iso + "T00:00:00");
    const c = describe(daily.weather_code?.[i]);
    return {
      md: `${d.getMonth() + 1}/${d.getDate()}`,
      wd: WEEKDAYS[d.getDay()],
      emoji: c.emoji,
      label: c.label,
      max: round(daily.temperature_2m_max?.[i]),
      min: round(daily.temperature_2m_min?.[i]),
      pop: round(daily.precipitation_probability_max?.[i]),
      isToday: i === 0,
    };
  });

  const seaside = marine
    ? {
        temp: marine.temp,
        wave: marine.wave,
        highs: tide?.highs ?? [],
        lows: tide?.lows ?? [],
        hasTide: !!(tide && (tide.highs.length || tide.lows.length)),
        source: tide?.source,
      }
    : undefined;

  return {
    summary,
    cards,
    risk,
    travel,
    play,
    carry: [...carrySet],
    seaside,
    forecast,
  };
};

const esc = (s: unknown): string =>
  String(s).replace(/[&<>"]/g, (m) =>
    m === "&" ? "&amp;" : m === "<" ? "&lt;" : m === ">" ? "&gt;" : "&quot;",
  );

const block = (title: string, icon: string, items: string[]): string =>
  items.length
    ? `<div class="w-block">
  <h4 class="w-block__title">${icon} ${esc(title)}</h4>
  <ul class="w-block__list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
</div>`
    : "";

export const adviceToHtml = (a: WeatherAdvice): string => {
  const cardHtml = a.cards
    .map(
      (c) => `<div class="w-card">
  <span class="w-card__label">${esc(c.label)}</span>
  <strong class="w-card__value">${esc(c.value)}</strong>
  ${c.sub ? `<span class="w-card__sub">${esc(c.sub)}</span>` : ""}
</div>`,
    )
    .join("");

  const riskHtml = a.risk.length
    ? `<div class="w-risk" role="alert">
  <h4 class="w-risk__title">⚠️ 注意・リスク情報</h4>
  <ul class="w-risk__list">${a.risk.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
</div>`
    : "";

  const forecastHtml = a.forecast.length
    ? `<div class="w-forecast" aria-label="今後7日間の予報">${a.forecast
        .map(
          (d) => `<div class="w-day${d.isToday ? " is-today" : ""}">
    <span class="w-day__date">${esc(d.md)}<small>${esc(d.wd)}</small></span>
    <span class="w-day__emoji" aria-hidden="true">${d.emoji}</span>
    <span class="w-day__temp"><b>${d.max}°</b><span>${d.min}°</span></span>
    <span class="w-day__rain">雨 ${d.pop}%</span>
  </div>`,
        )
        .join("")}</div>`
    : "";

  const seasideHtml = a.seaside
    ? (() => {
        const s = a.seaside;
        const tideInner = s.hasTide
          ? `<div class="w-tide">
              <div class="w-tide__col"><span class="w-tide__label">満潮</span>${s.highs
                .map((h) => `<span class="w-tide__row">${esc(h.time)} <b>${esc(h.h)}cm</b></span>`)
                .join("")}</div>
              <div class="w-tide__col"><span class="w-tide__label">干潮</span>${s.lows
                .map((l) => `<span class="w-tide__row">${esc(l.time)} <b>${esc(l.h)}cm</b></span>`)
                .join("")}</div>
            </div>`
          : `<p class="w-tide__note">潮見データは現在取得できませんでした（後ほどご確認ください）</p>`;
        const src = s.source
          ? `<p class="w-tide__src">潮見：${esc(s.source)}（蒲郡は約30km東、目安としてご利用ください）</p>`
          : "";
        return `<div class="w-seaside" aria-label="海辺の状況">
  <h4 class="w-seaside__title">🌊 海辺の状況</h4>
  <div class="w-cards w-cards--seaside">
    <div class="w-card"><span class="w-card__label">海水温</span><strong class="w-card__value">${esc(s.temp)}℃</strong></div>
    <div class="w-card"><span class="w-card__label">波の高さ</span><strong class="w-card__value">${esc(s.wave)} m</strong></div>
  </div>
  ${tideInner}
  ${src}
</div>`;
      })()
    : "";

  return `<div class="w-summary">${esc(a.summary)}</div>
<div class="w-cards">${cardHtml}</div>
${riskHtml}
${seasideHtml}
${block("服装と過ごし方", "☀️", a.travel)}
${block("遊び方の提案", "🗺️", a.play)}
${block("持ち物", "🎒", a.carry)}
${forecastHtml}`;
};
