const state = {
  count: 8,
  step: "create",
  directionDeckIndex: 0,
  items: [],
};

const directionDecks = [
  [
    {
      title: "加班橘猫",
      topic: "一只嘴贱的加班橘猫，适合微信聊天",
      tags: ["职场", "嘴贱", "Q版"],
      desc: "适合下班、摸鱼、已读、别催等高频聊天。",
    },
    {
      title: "社恐小熊",
      topic: "一只社恐但礼貌的小熊，适合朋友聊天",
      tags: ["社交", "治愈", "软萌"],
      desc: "适合谢谢、抱歉、晚安、逃避和自我安慰。",
    },
    {
      title: "暴躁饭团",
      topic: "一个暴躁但可爱的饭团，适合回怼聊天",
      tags: ["回怼", "沙雕", "食物拟人"],
      desc: "适合无语、别烦、裂开、救命和哈哈哈。",
    },
  ],
  [
    {
      title: "摸鱼企鹅",
      topic: "一只擅长摸鱼的企鹅，适合上班群聊天",
      tags: ["上班", "冷幽默", "摸鱼"],
      desc: "适合开会、装忙、收到、安排和下班冲刺。",
    },
    {
      title: "元气奶茶杯",
      topic: "一杯元气满满的奶茶，适合日常鼓励聊天",
      tags: ["元气", "鼓励", "日常"],
      desc: "适合加油、抱抱、开心、恢复能量和谢谢。",
    },
    {
      title: "发疯小怪兽",
      topic: "一只压力很大的小怪兽，适合情绪发疯聊天",
      tags: ["高情绪", "夸张", "发疯"],
      desc: "适合尖叫、崩溃、别管我、裂开和救命。",
    },
  ],
];

const pools = {
  base: [
    ["收到", "收到", "角色认真点头或举手回应。"],
    ["好的", "好的", "角色比出 OK 手势，表情积极。"],
    ["谢谢", "谢谢", "角色双手合十，礼貌又可爱。"],
    ["哈哈", "哈哈", "角色笑到前仰后合。"],
    ["无语", "无语", "角色翻白眼，身体放松下垂。"],
    ["加油", "加油", "角色举起小旗或握拳打气。"],
    ["抱抱", "抱抱", "角色张开双臂靠近镜头。"],
    ["晚安", "晚安", "角色盖着小被子准备睡觉。"],
  ],
  extra: [
    ["裂开", "裂开", "角色瘫在地上，旁边有夸张裂纹。"],
    ["下班", "下班", "角色背包快速冲出画面。"],
    ["别催", "别催", "角色护住电脑或咖啡，表情紧张。"],
    ["已读", "已读", "角色面无表情看手机。"],
    ["救命", "救命", "角色举手求救，表情崩溃。"],
    ["安排", "安排", "角色拿出清单，动作很笃定。"],
    ["摸鱼", "摸鱼", "角色躲在屏幕后偷偷休息。"],
    ["在吗", "在吗", "角色从画面边缘探头。"],
    ["开心", "开心", "角色跳起来，周围有小星星。"],
    ["生气", "生气", "角色鼓脸抱臂，头顶冒火。"],
    ["委屈", "委屈", "角色眼泪汪汪，缩成一团。"],
    ["点赞", "点赞", "角色竖起大拇指。"],
    ["别烦", "别烦", "角色背过身摆手拒绝。"],
    ["冲啊", "冲啊", "角色向前奔跑，动作夸张。"],
    ["吃饭", "吃饭", "角色端着碗开心等待。"],
    ["睡了", "睡了", "角色趴在桌上睡着。"],
  ],
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function gridSpec(count = state.count) {
  if (count === 16) return { rows: 4, cols: 4 };
  if (count === 24) return { rows: 4, cols: 6 };
  return { rows: 2, cols: 4 };
}

function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function setStep(step) {
  state.step = step;
  $$(".screen").forEach((screen) => screen.classList.remove("is-visible"));
  $(`#screen-${step}`).classList.add("is-visible");
  $$(".step").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.step === step);
  });
}

function setCount(count) {
  state.count = count;
  $$(".segment").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.count) === count);
  });
}

function renderDirectionCards() {
  const topic = $("#topicInput").value.trim();
  $("#directionHint").textContent = topic
    ? `正在围绕“${topic}”发散方向。选择方向后，会替换为更明确的主题并生成条目。`
    : "当前没有主题，系统会随机给出创作方向。选择方向后，会生成条目。";
  const deck = directionDecks[state.directionDeckIndex % directionDecks.length];
  $("#directionGrid").innerHTML = deck
    .map(
      (card) => `
        <button class="direction-card" data-topic="${card.topic}" type="button">
          <strong>${card.title}</strong>
          <p>${card.desc}</p>
          <div class="tags">${card.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </button>
      `,
    )
    .join("");

  $$(".direction-card").forEach((button) => {
    button.addEventListener("click", () => {
      $("#topicInput").value = button.dataset.topic;
      generateItems();
      showToast("已按方向卡生成条目。");
    });
  });
}

function inferTopicFlavor(topic) {
  if (topic.includes("上班") || topic.includes("加班") || topic.includes("职场")) return "work";
  if (topic.includes("回怼") || topic.includes("暴躁") || topic.includes("发疯")) return "rage";
  if (topic.includes("治愈") || topic.includes("朋友") || topic.includes("可爱")) return "soft";
  return "daily";
}

function buildItems(topic, count) {
  const flavor = inferTopicFlavor(topic);
  const entries = [...pools.base, ...pools.extra];
  const preferred =
    flavor === "work"
      ? ["收到", "好的", "下班", "摸鱼", "别催", "已读", "安排", "救命"]
      : flavor === "rage"
        ? ["无语", "别烦", "裂开", "救命", "生气", "哈哈", "冲啊", "已读"]
        : flavor === "soft"
          ? ["谢谢", "抱抱", "晚安", "开心", "加油", "委屈", "好的", "点赞"]
          : [];

  const ordered = [
    ...preferred
      .map((label) => entries.find((entry) => entry[0] === label))
      .filter(Boolean),
    ...entries,
  ];

  const seen = new Set();
  return ordered
    .filter((entry) => {
      if (seen.has(entry[0])) return false;
      seen.add(entry[0]);
      return true;
    })
    .slice(0, count)
    .map(([meaning, text, action], index) => ({
      meaning,
      text,
      action: `${action} 画面里直接生成中文文字“${text}”。`,
      index: index + 1,
    }));
}

function generateItems() {
  const topic = $("#topicInput").value.trim() || "一个原创角色，适合微信聊天";
  state.items = buildItems(topic, state.count);
  renderItems();
  setStep("items");
}

function renderItems() {
  const { rows, cols } = gridSpec();
  $("#countMeta").textContent = `${state.count} 张`;
  $("#gridMeta").textContent = `${rows} x ${cols} 网格`;
  $("#itemList").innerHTML = state.items
    .map(
      (item, index) => `
        <div class="item-row" data-index="${index}" data-action="${item.action}">
          <label class="item-text-field">
            <span>#${String(index + 1).padStart(2, "0")}</span>
            <input class="text-input" value="${item.text}" aria-label="画面文字 ${index + 1}" />
          </label>
        </div>
      `,
    )
    .join("");
}

function syncItemsFromForm() {
  state.items = $$(".item-row").map((row, index) => ({
    index: index + 1,
    text: row.querySelector(".text-input").value.trim() || `表情${index + 1}`,
    meaning: row.querySelector(".text-input").value.trim() || `表情${index + 1}`,
    action: row.dataset.action || "根据主题自由生成动作。",
  }));
}

function renderMockImage() {
  syncItemsFromForm();
  const { rows, cols } = gridSpec();
  $("#mockImage").innerHTML = `
    <div class="mock-grid" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr));">
      ${state.items
        .map(
          (item) => `
            <div class="mock-cell">
              <div class="face"><div class="mouth"></div></div>
              <div class="mock-text">${item.text}</div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
  setStep("result");
}

function buildSvg() {
  const { rows, cols } = gridSpec();
  const cell = 220;
  const gap = 12;
  const width = cols * cell + (cols + 1) * gap;
  const height = rows * cell + (rows + 1) * gap;
  const cells = state.items
    .map((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = gap + col * (cell + gap);
      const y = gap + row * (cell + gap);
      const cx = x + cell / 2;
      return `
        <rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#fff" stroke="#222" stroke-width="2"/>
        <circle cx="${cx}" cy="${y + 82}" r="42" fill="none" stroke="#222" stroke-width="5"/>
        <circle cx="${cx - 16}" cy="${y + 75}" r="5" fill="#222"/>
        <circle cx="${cx + 16}" cy="${y + 75}" r="5" fill="#222"/>
        <path d="M ${cx - 18} ${y + 96} Q ${cx} ${y + 112} ${cx + 18} ${y + 96}" fill="none" stroke="#222" stroke-width="5"/>
        <text x="${cx}" y="${y + 175}" text-anchor="middle" font-size="34" font-weight="800" font-family="Microsoft YaHei, Arial">${escapeXml(item.text)}</text>
      `;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#222"/>
    ${cells}
  </svg>`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function downloadMockImage() {
  const svg = buildSvg();
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sticker-grid-${state.count}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function reset() {
  setCount(8);
  state.directionDeckIndex = 0;
  state.items = [];
  $("#topicInput").value = "一只嘴贱的加班橘猫，适合微信聊天";
  $("#directionPanel").hidden = true;
  $("#directionGrid").innerHTML = "";
  $("#itemList").innerHTML = "";
  $("#mockImage").innerHTML = "";
  setStep("create");
}

$$(".segment").forEach((button) => button.addEventListener("click", () => setCount(Number(button.dataset.count))));

$("#generateItemsButton").addEventListener("click", generateItems);
$("#drawDirectionButton").addEventListener("click", () => {
  $("#directionPanel").hidden = false;
  renderDirectionCards();
  showToast($("#topicInput").value.trim() ? "已围绕当前主题生成方向卡。" : "已随机生成方向卡。");
});
$("#refreshDirectionButton").addEventListener("click", () => {
  state.directionDeckIndex += 1;
  renderDirectionCards();
  showToast("已刷新方向。");
});
$("#generateGridButton").addEventListener("click", renderMockImage);
$("#backToItemsButton").addEventListener("click", () => setStep("items"));
$("#downloadButton").addEventListener("click", downloadMockImage);
$("#resetButton").addEventListener("click", reset);

reset();
