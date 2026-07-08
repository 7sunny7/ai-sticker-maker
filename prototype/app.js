const initialPlan = [
  ["收到", "橘猫举起爪子敬礼，表情认真但有点欠揍。"],
  ["哈哈", "橘猫笑到拍桌，眼睛弯成线，动作夸张。"],
  ["无语", "橘猫半睁眼翻白眼，尾巴垂着。"],
  ["谢谢", "橘猫双手合十，脸上带着礼貌假笑。"],
  ["加油", "橘猫举着小旗，身体前倾，像在给人打气。"],
  ["抱抱", "橘猫张开双臂，表情软一点但仍然有个性。"],
  ["下班", "橘猫背着包往外冲，脚下有速度线。"],
  ["裂开", "橘猫瘫在地上，脑袋旁有裂开的夸张符号。"],
];

const directionDecks = [
  [
    {
      title: "加班橘猫",
      topic: "一只嘴贱的加班橘猫，适合微信聊天",
      description: "打工人日常，高频聊天场景，情绪偏吐槽和崩溃。",
      tags: ["职场", "嘴贱", "Q 版贴纸"],
    },
    {
      title: "社恐小熊",
      topic: "一只社恐但礼貌的小熊，适合朋友聊天",
      description: "适合轻社交、道歉、谢谢、逃避和自我安慰场景。",
      tags: ["治愈", "社恐", "软萌"],
    },
    {
      title: "暴躁饭团",
      topic: "一个暴躁但可爱的饭团，适合回怼聊天",
      description: "主打回怼、无语、别烦我和阴阳怪气，适合传播。",
      tags: ["回怼", "沙雕", "食物拟人"],
    },
  ],
  [
    {
      title: "摸鱼企鹅",
      topic: "一只擅长摸鱼的企鹅，适合上班群聊天",
      description: "围绕开会、下班、已读、装忙展开，画面清爽。",
      tags: ["上班", "摸鱼", "冷幽默"],
    },
    {
      title: "元气奶茶杯",
      topic: "一杯元气满满的奶茶，适合日常鼓励聊天",
      description: "适合谢谢、加油、抱抱、开心和恢复能量场景。",
      tags: ["元气", "治愈", "饮品拟人"],
    },
    {
      title: "发疯小怪兽",
      topic: "一只压力很大的小怪兽，适合情绪发疯聊天",
      description: "夸张动作多，适合裂开、尖叫、崩溃、别管我。",
      tags: ["发疯", "夸张", "高情绪"],
    },
  ],
];

const state = {
  credits: 60,
  currentStep: "create",
  selectedRole: null,
  generatedCount: 0,
  stickers: [],
  directionDeckIndex: 0,
};

const stepOrder = ["create", "plan", "role", "stickers", "export"];
const roleData = [
  {
    id: "orange",
    title: "橘猫打工人",
    body: "短腿橘猫，黑眼圈，蓝色工牌，表情嘴贱但可爱。",
    color: "#d98b32",
    mood: "mood-tired",
  },
  {
    id: "round",
    title: "圆脸欠揍猫",
    body: "圆脸橘猫，白色嘴套，小红领结，更偏沙雕聊天风。",
    color: "#e2a347",
    mood: "mood-laugh",
  },
  {
    id: "sharp",
    title: "尖耳吐槽猫",
    body: "瘦一点的橘猫，尖耳朵，绿色小马甲，吐槽感更强。",
    color: "#c8752f",
    mood: "mood-shock",
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function spendCredits(amount, message) {
  if (state.credits < amount) {
    showToast("积分不足，当前原型不会进入充值流程。");
    return false;
  }
  state.credits -= amount;
  $("#creditBalance").textContent = state.credits;
  if (message) showToast(message);
  return true;
}

function setStep(step) {
  state.currentStep = step;
  $$(".screen").forEach((screen) => screen.classList.remove("is-visible"));
  $(`#screen-${step}`).classList.add("is-visible");
  $$(".step").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.step === step);
  });
}

function fillPlan() {
  const topic = $("#topicInput").value.trim();
  const isBear = topic.includes("小熊");
  const isFood = topic.includes("饭团") || topic.includes("奶茶");
  const isPenguin = topic.includes("企鹅");
  const isMonster = topic.includes("怪兽");
  const character = isBear
    ? "主角是一只原创小熊，体型圆润，表情礼貌但紧张，适合朋友聊天和轻社交场景。"
    : isFood
      ? "主角是一个原创拟人食物角色，轮廓简单，表情夸张，适合日常聊天传播。"
      : isPenguin
        ? "主角是一只原创企鹅，带一点上班族疲惫感，动作克制但有冷幽默。"
        : isMonster
          ? "主角是一只原创小怪兽，表情夸张，压力很大但不吓人，适合高情绪聊天场景。"
          : "主角是一只原创橘猫，带轻微黑眼圈和打工人工牌，性格嘴贱、疲惫但不讨厌，适合微信聊天场景。";

  $("#characterInput").value = character;
  $("#styleInput").value = "Q 版贴纸风，粗线条，暖色为主，背景尽量干净，主体轮廓清楚，小尺寸也能看懂动作。";
  $("#rulesInput").value = "保持同一角色的脸型、主体配色、核心配件和表情气质；每张只突出一个动作，减少复杂场景。";
  $("#negativeInput").value = "不要写实风，不要真人风，不要复杂背景，不要密集文字，不要现成动漫 IP 风格，不要生成品牌商标。";
  renderPlanList();
}

function renderDirectionCards() {
  const cards = directionDecks[state.directionDeckIndex % directionDecks.length];
  $("#directionCards").innerHTML = cards
    .map(
      (card) => `
        <button class="direction-card" data-topic="${card.topic}" type="button">
          <strong>${card.title}</strong>
          <p>${card.description}</p>
          <div class="direction-tags">
            ${card.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </button>
      `,
    )
    .join("");

  $$(".direction-card").forEach((button) => {
    button.addEventListener("click", () => {
      $("#topicInput").value = button.dataset.topic;
      fillPlan();
      setStep("plan");
      showToast("已选方向卡，并拆解为完整方案。");
    });
  });
}

function renderPlanList() {
  const list = $("#planList");
  list.innerHTML = initialPlan
    .map(
      ([label, action], index) => `
        <article class="plan-item">
          <strong>表情 ${index + 1}</strong>
          <input value="${label}" aria-label="含义词 ${index + 1}" />
          <textarea aria-label="动作描述 ${index + 1}">${action}</textarea>
        </article>
      `,
    )
    .join("");
}

function catMarkup(role, moodClass = "") {
  const color = role?.color || "#d98b32";
  return `
    <div class="cat ${moodClass || role?.mood || ""}" style="--cat-body: ${color}">
      <div class="face">
        <div class="eyes"><span></span><span></span></div>
        <div class="mouth"></div>
      </div>
    </div>
  `;
}

function renderRoles() {
  const container = $("#roleOptions");
  container.innerHTML = roleData
    .map(
      (role) => `
        <button class="role-option ${state.selectedRole === role.id ? "is-selected" : ""}" data-role="${role.id}" type="button">
          <div class="sticker-preview">${catMarkup(role)}</div>
          <h3>${role.title}</h3>
          <p class="muted">${role.body}</p>
        </button>
      `,
    )
    .join("");

  $$(".role-option").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRole = button.dataset.role;
      renderRoles();
      renderRoleCard();
      $("#confirmRoleButton").disabled = false;
    });
  });
}

function renderRoleCard() {
  const role = roleData.find((item) => item.id === state.selectedRole);
  if (!role) return;
  $("#roleCard").innerHTML = `
    <h3>角色卡：${role.title}</h3>
    <dl>
      <dt>外形</dt><dd>${role.body}</dd>
      <dt>颜色</dt><dd>橘色主体，深色粗线条，保留工牌或领结作为识别点。</dd>
      <dt>表情</dt><dd>嘴贱、疲惫、夸张，但不凶。</dd>
      <dt>不可变化</dt><dd>耳朵形状、脸型、主体配色和核心配件不能漂移。</dd>
    </dl>
  `;
}

function getPlanItems() {
  return $$(".plan-item").map((item) => ({
    label: item.querySelector("input").value.trim(),
    action: item.querySelector("textarea").value.trim(),
  }));
}

function stickerMarkup(item, index, isGenerated) {
  if (!isGenerated) {
    return `
      <article class="sticker-card pending">
        <div class="pending-box">待生成</div>
        <h3>${item.label}</h3>
        <p>${item.action}</p>
      </article>
    `;
  }

  const role = roleData.find((option) => option.id === state.selectedRole) || roleData[0];
  const moods = ["mood-tired", "mood-laugh", "mood-shock", "", "mood-laugh", "", "mood-shock", "mood-tired"];

  return `
    <article class="sticker-card">
      <div class="sticker-preview">${catMarkup(role, moods[index])}</div>
      <h3>${item.label}</h3>
      <p>${item.action}</p>
      <div class="reason-row">
        <button class="reason-button" data-reroll="${index}" data-reason="角色不像" type="button">角色不像</button>
        <button class="reason-button" data-reroll="${index}" data-reason="表情不对" type="button">表情不对</button>
        <button class="reason-button" data-reroll="${index}" data-reason="太复杂" type="button">太复杂</button>
      </div>
    </article>
  `;
}

function renderStickers() {
  const items = getPlanItems();
  const board = $("#stickerBoard");
  board.innerHTML = items.map((item, index) => stickerMarkup(item, index, index < state.generatedCount)).join("");
  $("#exportStickerCount").textContent = `${state.generatedCount} / 8`;
  $("#generateRestButton").disabled = state.generatedCount < 2 || state.generatedCount >= 8;
  $("#exportButton").disabled = state.generatedCount < 8;
  $("#qualityStatus").textContent =
    state.generatedCount === 0 ? "等待前 2 张验证" : state.generatedCount < 8 ? "前 2 张通过，可继续生成" : "8 张已通过基础检查";

  $$("[data-reroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.reroll) + 1;
      const reason = button.dataset.reason;
      if (spendCredits(3, `已按“${reason}”重生成第 ${index} 张，扣 3 积分。`)) {
        button.closest(".sticker-card").classList.add("is-selected");
      }
    });
  });
}

function resetPrototype() {
  state.credits = 60;
  state.currentStep = "create";
  state.selectedRole = null;
  state.generatedCount = 0;
  state.stickers = [];
  $("#creditBalance").textContent = state.credits;
  $("#confirmRoleButton").disabled = true;
  $("#generateRestButton").disabled = true;
  $("#exportButton").disabled = true;
  $("#topicInput").value = "一只嘴贱的加班橘猫，适合微信聊天";
  $("#directionArea").hidden = true;
  $("#directionCards").innerHTML = "";
  $("#roleOptions").innerHTML = "";
  $("#roleCard").innerHTML = "<h3>角色卡</h3><p>选择角色后，系统会沉淀外形、颜色、配件和不可变化点。后续所有表情都围绕角色卡生成。</p>";
  $("#stickerBoard").innerHTML = "";
  setStep("create");
}

$("#generatePlanButton").addEventListener("click", () => {
  fillPlan();
  setStep("plan");
  showToast("方案已生成，免费。");
});

$("#drawDirectionButton").addEventListener("click", () => {
  $("#directionArea").hidden = false;
  renderDirectionCards();
  showToast("已抽出 3 个方向，先选方向再出图。");
});

$("#redrawDirectionButton").addEventListener("click", () => {
  state.directionDeckIndex += 1;
  renderDirectionCards();
  showToast("已刷新方向卡，不消耗积分。");
});

$("#confirmPlanButton").addEventListener("click", () => {
  if (!spendCredits(9, "已生成 3 张角色候选，扣 9 积分。")) return;
  renderRoles();
  setStep("role");
});

$("#confirmRoleButton").addEventListener("click", () => {
  if (!state.selectedRole) return;
  if (!spendCredits(6, "已生成前 2 张表情，扣 6 积分。")) return;
  state.generatedCount = Math.max(state.generatedCount, 2);
  renderStickers();
  setStep("stickers");
});

$("#generateRestButton").addEventListener("click", () => {
  if (!spendCredits(18, "已生成剩余 6 张表情，扣 18 积分。")) return;
  state.generatedCount = 8;
  renderStickers();
  setStep("export");
});

$("#exportButton").addEventListener("click", () => {
  showToast("原型中不生成真实 ZIP，这里表示基础投稿包下载成功。");
});

$("#resetButton").addEventListener("click", resetPrototype);

$$(".step").forEach((button) => {
  button.addEventListener("click", () => setStep(button.dataset.step));
});

resetPrototype();
