const STORAGE_KEYS = {
  tasks: "fiikun-tasks-v2",
  pomodoroRecords: "fiikun-pomodoro-records-v1",
  strawberryPoints: "fiikun-strawberry-points-v1",
  rewards: "fiikun-rewards-v1",
  letters: "fiikun-letters-v1",
  achievements: "fiikun-achievements-v1",
  fiikun: "fiikun-state-v1",
  garden: "fiikun-garden-v1",
  dailyLetterNotice: "fiikun-daily-letter-notice-v1",
  userSettings: "fiikun-user-settings-v1",
};

const POINTS_PER_TASK = 1;
const GARDEN_MAX_STAGE = 8;

const defaultTasks = [
  createTask("朝のストレッチ 5分", "Tiny", "flower.png"),
  createTask("ベリーダンス基礎練習 20分", "Main", "heart.png"),
  {
    ...createTask("読書ノート 1ページ", "Sub", "book.png"),
    done: true,
    completedAt: new Date().toISOString(),
    pointsAwarded: true,
  },
];

const defaultRewards = [
  createReward("カフェでゆったり時間", 3, "cup.png"),
  createReward("新しい本を読む", 5, "book.png"),
  createReward("小さなプレゼント", 8, "gift.png"),
];

const defaultLetters = [
  {
    id: "first-sprout",
    title: "はじめての芽",
    unlockCondition: "garden.stage >= 2",
    locked: true,
    body: "小さな芽が出たよ。今日の一歩を、ふぃーくんはちゃんと見ていました。",
  },
  {
    id: "first-strawberry",
    title: "いちごの日",
    unlockCondition: "garden.stage >= 5",
    locked: true,
    body: "畑に赤いいちごが実りました。続けてきた時間が、やさしい形になったね。",
  },
];

const defaultAchievements = [
  createAchievement("first-100", "初めて100いちご", "strawberry.png", "100ポイント集める", true),
  createAchievement("thirty-days", "30日継続", "flower.png", "30日続けて記録する", true),
  createAchievement("toeic-100h", "TOEIC100時間", "book.png", "勉強時間が100時間になる", true),
  createAchievement("dance-stage", "ダンス発表会", "heart.png", "大切な発表会を迎える", true),
];

const defaultFiikun = {
  currentOutfit: "normal",
  outfits: [
    {
      id: "normal",
      name: "通常",
      image: "fiikun_normal.png",
      unlockCondition: "default",
      locked: false,
    },
    {
      id: "king",
      name: "王様",
      image: "fiikun_king.png",
      unlockCondition: "strawberryPoints >= 30",
      locked: true,
    },
    {
      id: "princess",
      name: "プリンセス",
      image: "fiikun_princess.png",
      unlockCondition: "garden.stage >= 8",
      locked: true,
    },
    {
      id: "travel",
      name: "旅行",
      image: "fiikun_sailor.png",
      unlockCondition: "future.travelReward",
      locked: true,
    },
  ],
};

const defaultUserSettings = {
  displayName: "みお",
};

const defaultGarden = {
  stage: 1,
  maxStage: GARDEN_MAX_STAGE,
  completedTaskCount: 0,
  stageImages: Array.from({ length: GARDEN_MAX_STAGE }, (_, index) => ({
    stage: index + 1,
    image: `plants/pot_stage${index + 1}.png`,
  })),
};

let tasks = normalizeTasks(loadJson(STORAGE_KEYS.tasks, defaultTasks));
let pomodoroRecords = loadJson(STORAGE_KEYS.pomodoroRecords, []);
let rewards = loadJson(STORAGE_KEYS.rewards, defaultRewards);
let letters = loadJson(STORAGE_KEYS.letters, defaultLetters);
let achievements = loadJson(STORAGE_KEYS.achievements, defaultAchievements);
let fiikun = loadObject(STORAGE_KEYS.fiikun, defaultFiikun);
let garden = loadObject(STORAGE_KEYS.garden, defaultGarden);
let userSettings = loadObject(STORAGE_KEYS.userSettings, defaultUserSettings);
let dailyLetterNotice = loadObject(STORAGE_KEYS.dailyLetterNotice, {
  dateKey: "",
  created: false,
  opened: false,
});
let strawberryPoints = loadNumber(STORAGE_KEYS.strawberryPoints);
let activeFilter = "all";
let timerMinutes = 25;
let remainingSeconds = timerMinutes * 60;
let timerRunning = false;
let timerInterval = null;
let visibleMonth = new Date();
let selectedDateKey = toDateKey(new Date());

if (strawberryPoints === null) {
  strawberryPoints = tasks.filter((task) => task.pointsAwarded).length * POINTS_PER_TASK;
}

const views = {
  home: document.querySelector("#home-view"),
  tasks: document.querySelector("#tasks-view"),
  timer: document.querySelector("#timer-view"),
  records: document.querySelector("#records-view"),
  settings: document.querySelector("#settings-view"),
  rewards: document.querySelector("#rewards-view"),
};

const taskList = document.querySelector("#task-list");
const homeTaskList = document.querySelector("#home-task-list");
const taskForm = document.querySelector("#task-form");
const taskTitle = document.querySelector("#task-title");
const taskCategory = document.querySelector("#task-category");
const taskIcon = document.querySelector("#task-icon");
const progressLabel = document.querySelector("#progress-label");
const fieldMessage = document.querySelector("#field-message");
const homeFiikunImage = document.querySelector("#home-fiikun-image");
const homeLetterNotice = document.querySelector("#home-letter-notice");
const homeGardenStageImage = document.querySelector("#home-garden-stage-image");
const homeGardenFallback = document.querySelector("#home-garden-fallback");
const homeGardenProgressBar = document.querySelector("#home-garden-progress-bar");
const taskCount = document.querySelector("#task-count");
const todayPomoCount = document.querySelector("#today-pomo-count");
const todayPomoMinutes = document.querySelector("#today-pomo-minutes");
const timerDisplay = document.querySelector("#timer-display");
const timerMode = document.querySelector("#timer-mode");
const timerStart = document.querySelector("#timer-start");
const timerReset = document.querySelector("#timer-reset");
const timerComplete = document.querySelector("#timer-complete");
const recordList = document.querySelector("#record-list");
const recordTotal = document.querySelector("#record-total");
const clearRecords = document.querySelector("#clear-records");
const calendarTitle = document.querySelector("#calendar-title");
const calendarGrid = document.querySelector("#calendar-grid");
const prevMonth = document.querySelector("#prev-month");
const nextMonth = document.querySelector("#next-month");
const letterDate = document.querySelector("#letter-date");
const letterGreeting = document.querySelector("#letter-greeting");
const letterBody = document.querySelector("#letter-body");
const nameSettingsForm = document.querySelector("#name-settings-form");
const userDisplayNameInput = document.querySelector("#user-display-name");
const nameSaveNote = document.querySelector("#name-save-note");
const strawberryPointsDisplay = document.querySelector("#strawberry-points");
const gardenStageLabel = document.querySelector("#garden-stage-label");
const gardenStageImage = document.querySelector("#garden-stage-image");
const gardenFallback = document.querySelector("#garden-fallback");
const gardenProgressBar = document.querySelector("#garden-progress-bar");
const gardenMessage = document.querySelector("#garden-message");
const rewardForm = document.querySelector("#reward-form");
const rewardTitleInput = document.querySelector("#reward-title-input");
const rewardCostInput = document.querySelector("#reward-cost-input");
const rewardList = document.querySelector("#reward-list");
const letterUnlockList = document.querySelector("#letter-unlock-list");
const outfitList = document.querySelector("#outfit-list");
const achievementList = document.querySelector("#achievement-list");
const rewardAnimation = document.querySelector("#reward-animation");

document.querySelectorAll(".bottom-tab").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.jump));
});

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

document.querySelectorAll(".duration-chip").forEach((button) => {
  button.addEventListener("click", () => {
    if (timerRunning) return;
    timerMinutes = Number(button.dataset.minutes);
    remainingSeconds = timerMinutes * 60;
    document.querySelectorAll(".duration-chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    renderTimer();
  });
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskTitle.value.trim();
  if (!title) return;

  tasks.unshift(createTask(title, taskCategory.value, taskIcon.value));
  taskForm.reset();
  saveTasks();
  render();
  taskTitle.focus();
});

timerStart.addEventListener("click", () => {
  timerRunning ? pauseTimer() : startTimer();
});

timerReset.addEventListener("click", () => {
  pauseTimer();
  remainingSeconds = timerMinutes * 60;
  renderTimer();
});

timerComplete.addEventListener("click", () => {
  addPomodoroRecord(timerMinutes, "手動で記録");
  pauseTimer();
  remainingSeconds = timerMinutes * 60;
  render();
});

clearRecords.addEventListener("click", () => {
  pomodoroRecords = pomodoroRecords.filter((record) => !isToday(record.completedAt));
  savePomodoroRecords();
  render();
});

prevMonth.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

nameSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const displayName = normalizeDisplayName(userDisplayNameInput.value);
  userSettings.displayName = displayName;
  userDisplayNameInput.value = displayName;
  saveUserSettings();
  renderLetter();
  nameSaveNote.hidden = false;
  window.setTimeout(() => {
    nameSaveNote.hidden = true;
  }, 1800);
});

rewardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = rewardTitleInput.value.trim();
  const cost = Number(rewardCostInput.value);
  if (!title || !Number.isFinite(cost) || cost < 1) return;

  rewards.unshift(createReward(title, cost, "gift.png"));
  rewardForm.reset();
  rewardCostInput.value = 5;
  saveRewards();
  renderRewards();
});

gardenStageImage.addEventListener("error", () => {
  gardenStageImage.closest(".garden-visual").classList.add("missing-stage");
});

homeGardenStageImage.addEventListener("error", () => {
  homeGardenStageImage.closest(".garden-visual").classList.add("missing-stage");
});

function createTask(title, category, icon) {
  return {
    id: crypto.randomUUID(),
    title,
    category,
    icon,
    done: false,
    completedAt: null,
    pointsAwarded: false,
  };
}

function createReward(title, cost, icon) {
  return {
    id: crypto.randomUUID(),
    title,
    cost,
    icon,
    exchanged: false,
    exchangedAt: null,
  };
}

function createAchievement(id, title, image, unlockCondition, locked) {
  return {
    id,
    title,
    image,
    unlockCondition,
    locked,
  };
}

function loadJson(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function loadObject(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) return structuredClone(fallback);

  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function loadNumber(key) {
  const saved = localStorage.getItem(key);
  if (saved === null) return null;
  const value = Number(saved);
  return Number.isFinite(value) ? value : null;
}

function normalizeTasks(items) {
  return items.map((task) => ({
    ...task,
    completedAt: task.done && !task.completedAt ? new Date().toISOString() : task.completedAt || null,
    pointsAwarded: Boolean(task.pointsAwarded || task.done),
  }));
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function savePomodoroRecords() {
  localStorage.setItem(STORAGE_KEYS.pomodoroRecords, JSON.stringify(pomodoroRecords));
}

function saveRewards() {
  localStorage.setItem(STORAGE_KEYS.rewards, JSON.stringify(rewards));
}

function saveLetters() {
  localStorage.setItem(STORAGE_KEYS.letters, JSON.stringify(letters));
}

function saveAchievements() {
  localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
}

function saveFiikun() {
  localStorage.setItem(STORAGE_KEYS.fiikun, JSON.stringify(fiikun));
}

function saveGarden() {
  localStorage.setItem(STORAGE_KEYS.garden, JSON.stringify(garden));
}

function saveUserSettings() {
  localStorage.setItem(STORAGE_KEYS.userSettings, JSON.stringify(userSettings));
}

function saveDailyLetterNotice() {
  localStorage.setItem(STORAGE_KEYS.dailyLetterNotice, JSON.stringify(dailyLetterNotice));
}

function saveStrawberryPoints() {
  localStorage.setItem(STORAGE_KEYS.strawberryPoints, String(strawberryPoints));
}

function normalizeDisplayName(value) {
  const trimmed = String(value || "").trim();
  return trimmed || defaultUserSettings.displayName;
}

function getDisplayName() {
  userSettings.displayName = normalizeDisplayName(userSettings.displayName);
  return userSettings.displayName;
}

function formatUnlockCondition(condition) {
  const labels = {
    "default": "最初から選べます",
    "garden.stage >= 2": "いちご畑がステージ2になると解放",
    "garden.stage >= 5": "いちご畑がステージ5になると解放",
    "garden.stage >= 8": "いちご畑がステージ8になると解放",
    "strawberryPoints >= 30": "いちごを30こ集めると解放",
    "future.travelReward": "旅行のごほうびを追加すると解放",
  };
  return labels[condition] || condition;
}

function setView(name) {
  if (name === "records") {
    openTodayLetterNotice();
  }

  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle("active", key === name);
  });

  document.querySelectorAll(".bottom-tab").forEach((button) => {
    const isActive = button.dataset.view === name;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function render() {
  updateGardenState();
  unlockLetters();
  updateDailyLetterNotice();
  renderTasks();
  renderHome();
  renderTimer();
  renderRecords();
  renderCalendar();
  renderLetter();
  renderNameSettings();
  renderRewards();
}

function renderTasks() {
  const visibleTasks =
    activeFilter === "all" ? tasks : tasks.filter((task) => task.category === activeFilter);

  taskCount.textContent = `${visibleTasks.length}件`;
  taskList.innerHTML = "";

  if (visibleTasks.length === 0) {
    taskList.appendChild(createEmptyState("この表示にタスクはありません。", "fiikun_sleep.png"));
    return;
  }

  visibleTasks.forEach((task) => {
    const item = document.createElement("article");
    item.className = `task-item ${task.done ? "done" : ""}`;

    item.innerHTML = `
      <img class="task-icon-img" src="./assets/${task.icon}" alt="" />
      <div>
        <p class="task-title"></p>
        <p class="task-meta">${task.done ? "完了済み" : "これから育てるタスク"}</p>
      </div>
      <span class="category-pill ${task.category}">${task.category}</span>
      <div class="task-actions">
        <button class="check-button" type="button" aria-label="${task.title}を完了切替">${
          task.done ? "✓" : "○"
        }</button>
        <button class="delete-button" type="button" aria-label="${task.title}を削除">×</button>
      </div>
    `;

    item.querySelector(".task-title").textContent = task.title;
    item.querySelector(".check-button").addEventListener("click", () => toggleTask(task.id));
    item.querySelector(".delete-button").addEventListener("click", () => deleteTask(task.id));
    taskList.appendChild(item);
  });
}

function renderHome() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const todayRecords = getTodayRecords();
  const minutes = todayRecords.reduce((sum, record) => sum + record.minutes, 0);
  const fiikunMood = getHomeFiikunMood(total, done, todayRecords.length);

  renderGardenVisual(
    homeGardenStageImage,
    homeGardenFallback,
    homeGardenProgressBar,
  );
  progressLabel.textContent = `ステージ ${garden.stage} / ${garden.maxStage}`;
  homeFiikunImage.src = `./assets/${fiikunMood.image}`;
  homeFiikunImage.alt = fiikunMood.alt;
  homeLetterNotice.hidden = !hasUnreadTodayLetterNotice();
  fieldMessage.textContent =
    garden.stage >= garden.maxStage
      ? "畑はいちごでいっぱい。ごほうびタブでも同じ満開の畑が見られます。"
      : total === 0
        ? "タスクを達成すると、ごほうびタブのいちご畑も一緒に育ちます。"
        : done === total
          ? `今日のタスクは全部達成。畑はステージ${garden.stage}まで育っています。`
          : `あと${total - done}つ。達成すると畑の成長に近づきます。`;

  todayPomoCount.textContent = `${todayRecords.length}回`;
  todayPomoMinutes.textContent = `${minutes}分`;

  homeTaskList.innerHTML = "";
  tasks.slice(0, 4).forEach((task) => {
    const item = document.createElement("article");
    item.className = `mini-task ${task.done ? "done" : ""}`;
    item.innerHTML = `
      <img src="./assets/${task.icon}" alt="" />
      <div>
        <p class="task-title"></p>
        <p class="task-meta">${task.done ? "できた" : "今日の約束"}</p>
      </div>
      <span class="category-pill ${task.category}">${task.category}</span>
    `;
    item.querySelector(".task-title").textContent = task.title;
    homeTaskList.appendChild(item);
  });

  if (tasks.length === 0) {
    homeTaskList.appendChild(createEmptyState("タスクを追加すると、ここに表示されます。", "fiikun_think.png"));
  }
}

function renderTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timerStart.textContent = timerRunning ? "一時停止" : "スタート";
  timerMode.textContent = timerRunning ? "集中しています" : "集中時間";
}

function renderRecords() {
  const todayRecords = getTodayRecords();
  const minutes = todayRecords.reduce((sum, record) => sum + record.minutes, 0);

  recordTotal.textContent = `${todayRecords.length}回 / ${minutes}分`;
  recordList.innerHTML = "";

  if (todayRecords.length === 0) {
    recordList.appendChild(createEmptyState("まだ今日の記録はありません。", "fiikun_nightcap.png"));
    return;
  }

  todayRecords
    .slice()
    .reverse()
    .forEach((record) => {
      const item = document.createElement("article");
      const time = new Date(record.completedAt).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });

      item.className = "record-item";
      item.innerHTML = `
        <img src="./assets/strawberry.png" alt="" />
        <div>
          <p class="record-title">${record.minutes}分 集中</p>
          <p class="record-meta">${time}に記録</p>
        </div>
        <span class="category-pill Main">Pomodoro</span>
      `;
      recordList.appendChild(item);
    });
}

function renderCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlankCount = firstDay.getDay();

  calendarTitle.textContent = `${year}年${month + 1}月`;
  calendarGrid.innerHTML = "";

  for (let index = 0; index < leadingBlankCount; index += 1) {
    const blank = document.createElement("div");
    blank.className = "calendar-day blank";
    calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = toDateKey(date);
    const achievement = getAchievementForDate(dateKey);
    const button = document.createElement("button");
    button.className = `calendar-day ${dateKey === selectedDateKey ? "selected" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", `${month + 1}月${day}日`);
    button.innerHTML = `
      <span>${day}</span>
      ${achievement.icon ? `<img src="./assets/${achievement.icon}" alt="" />` : "<i></i>"}
    `;
    button.addEventListener("click", () => {
      selectedDateKey = dateKey;
      renderCalendar();
      renderLetter();
    });
    calendarGrid.appendChild(button);
  }
}

function renderLetter() {
  const date = parseDateKey(selectedDateKey);
  const achievement = getAchievementForDate(selectedDateKey);
  letterGreeting.textContent = `${getDisplayName()}さんへ`;

  letterDate.textContent = date.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const messages = {
    gift:
      "今日はタスクも集中時間もぜんぶ育ったね。いちご畑にプレゼントが届くくらい、すてきな一日でした。",
    strawberry:
      "Mainタスクをがんばった日だね。大きないちごがひとつ、しっかり赤くなりました。",
    flower:
      "Subタスクをていねいに進めた日だね。小さなお花が、畑のそばでふんわり咲いています。",
    clock:
      "ポモドーロで集中できた日だね。時計の針のぶんだけ、未来のあなたが楽になっています。",
    none:
      "この日はまだ記録がありません。何もない日も、休むための大切な余白だよ。",
  };

  letterBody.textContent = messages[achievement.type];
}

function renderNameSettings() {
  userDisplayNameInput.value = getDisplayName();
}

function renderRewards() {
  renderGarden();
  renderRewardList();
  renderLetterUnlocks();
  renderOutfits();
  renderAchievements();
}

function renderGarden() {
  renderGardenVisual(
    gardenStageImage,
    gardenFallback,
    gardenProgressBar,
  );

  strawberryPointsDisplay.textContent = strawberryPoints;
  gardenStageLabel.textContent = `ステージ ${garden.stage} / ${garden.maxStage}`;
  gardenMessage.textContent =
    garden.stage >= garden.maxStage
      ? "畑はいちごでいっぱい。次はごほうびや衣装を増やしていけます。"
      : `あと${Math.max(0, garden.stage)}回ほど達成すると、次の成長が近づきます。`;
}

function renderGardenVisual(stageImage, fallback, progressBar) {
  const currentStageImage = garden.stageImages.find((item) => item.stage === garden.stage);
  const imagePath = currentStageImage?.image || `plants/pot_stage${garden.stage}.png`;
  const percent = Math.round((garden.stage / garden.maxStage) * 100);

  stageImage.closest(".garden-visual").classList.remove("missing-stage");
  stageImage.src = `./assets/${imagePath}`;
  fallback.querySelector("span").textContent = `assets/${imagePath}`;
  progressBar.style.width = `${percent}%`;

  return { imagePath, percent };
}

function getHomeFiikunMood(totalTasks, doneTasks, todayPomodoroCount) {
  const hasPomodoro = todayPomodoroCount > 0;
  const hasTasks = totalTasks > 0;
  const allTasksDone = hasTasks && doneTasks === totalTasks;

  if (allTasksDone && hasPomodoro) {
    return { image: "fiikun_strawberry.png", alt: "いちごを持つふぃーくん" };
  }
  if (allTasksDone) {
    return { image: "fiikun_happy.png", alt: "笑顔のふぃーくん" };
  }
  if (doneTasks > 0 && hasPomodoro) {
    return { image: "fiikun_surprised.png", alt: "うれしそうなふぃーくん" };
  }
  if (doneTasks > 0) {
    return { image: "fiikun_happy.png", alt: "にこにこのふぃーくん" };
  }
  if (hasPomodoro) {
    return { image: "fiikun_cheer.png", alt: "応援するふぃーくん" };
  }
  if (hasTasks) {
    return { image: "fiikun_think.png", alt: "考えるふぃーくん" };
  }
  return { image: "fiikun_normal.png", alt: "ふぃーくん" };
}

function renderRewardList() {
  rewardList.innerHTML = "";

  rewards.forEach((reward) => {
    const canExchange = !reward.exchanged && strawberryPoints >= reward.cost;
    const item = document.createElement("article");
    item.className = `reward-card ${reward.exchanged ? "exchanged" : ""}`;
    item.innerHTML = `
      <img src="./assets/${reward.icon}" alt="" />
      <div>
        <h3></h3>
        <p>${reward.exchanged ? "交換済み" : `${reward.cost}いちごで交換`}</p>
      </div>
      <button class="exchange-button" type="button" ${canExchange ? "" : "disabled"}>
        ${reward.exchanged ? "済" : "交換"}
      </button>
    `;
    item.querySelector("h3").textContent = reward.title;
    item.querySelector("button").addEventListener("click", () => exchangeReward(reward.id));
    rewardList.appendChild(item);
  });
}

function renderLetterUnlocks() {
  letterUnlockList.innerHTML = "";

  letters.forEach((letter) => {
    const status = letter.locked
      ? createLockStatus("lock_closed.png", "未解放")
      : createLockStatus("lock_open.png", "開封可");
    const item = document.createElement("article");
    item.className = `letter-unlock-card ${letter.locked ? "locked" : ""}`;
    item.innerHTML = `
      <img src="./assets/letter.png" alt="" />
      <div>
        <h3></h3>
        <p>${letter.locked ? formatUnlockCondition(letter.unlockCondition) : letter.body}</p>
      </div>
      ${status}
    `;
    item.querySelector("h3").textContent = letter.title;
    letterUnlockList.appendChild(item);
  });
}

function renderOutfits() {
  outfitList.innerHTML = "";

  fiikun.outfits.forEach((outfit) => {
    const status = outfit.locked
      ? createLockStatus("lock_closed.png", "未解放")
      : createLockStatus("lock_open.png", "解放済み");
    const item = document.createElement("article");
    item.className = `outfit-card ${outfit.locked ? "locked" : ""}`;
    item.innerHTML = `
      <img src="./assets/${outfit.image}" alt="" />
      <div>
        <h3></h3>
        <p>${outfit.locked ? formatUnlockCondition(outfit.unlockCondition) : "選択できます"}</p>
      </div>
      ${status}
    `;
    item.querySelector("h3").textContent = outfit.name;
    outfitList.appendChild(item);
  });
}

function renderAchievements() {
  achievementList.innerHTML = "";

  achievements.forEach((achievement) => {
    const status = achievement.locked
      ? createLockStatus("lock_closed.png", "未達成")
      : createLockStatus("lock_open.png", "達成");
    const item = document.createElement("article");
    item.className = `achievement-card ${achievement.locked ? "locked" : ""}`;
    item.innerHTML = `
      <img src="./assets/${achievement.image}" alt="" />
      <div>
        <h3></h3>
        <p>${achievement.unlockCondition}</p>
      </div>
      ${status}
    `;
    item.querySelector("h3").textContent = achievement.title;
    achievementList.appendChild(item);
  });
}

function createLockStatus(image, label) {
  return `
    <span class="lock-status">
      <img src="./assets/${image}" alt="" />
      <span>${label}</span>
    </span>
  `;
}

function createEmptyState(message, image) {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.innerHTML = `
    <img src="./assets/${image}" alt="" />
    <p>${message}</p>
  `;
  return empty;
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id !== id) return task;
    const done = !task.done;
    const shouldAwardPoints = done && !task.pointsAwarded;

    if (shouldAwardPoints) {
      strawberryPoints += POINTS_PER_TASK;
      saveStrawberryPoints();
    }

    return {
      ...task,
      done,
      completedAt: done ? new Date().toISOString() : null,
      pointsAwarded: task.pointsAwarded || shouldAwardPoints,
    };
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

function exchangeReward(id) {
  const reward = rewards.find((item) => item.id === id);
  if (!reward || reward.exchanged || strawberryPoints < reward.cost) return;

  strawberryPoints -= reward.cost;
  reward.exchanged = true;
  reward.exchangedAt = new Date().toISOString();
  saveStrawberryPoints();
  saveRewards();
  prepareRewardAnimation();
  renderRewards();
}

function prepareRewardAnimation() {
  rewardAnimation.dataset.ready = "true";
}

function startTimer() {
  timerRunning = true;
  renderTimer();
  timerInterval = window.setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      addPomodoroRecord(timerMinutes, "自動で記録");
      pauseTimer();
      remainingSeconds = timerMinutes * 60;
      render();
      return;
    }
    renderTimer();
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
  renderTimer();
}

function addPomodoroRecord(minutes, note) {
  pomodoroRecords.push({
    id: crypto.randomUUID(),
    minutes,
    note,
    completedAt: new Date().toISOString(),
  });
  savePomodoroRecords();
}

function updateGardenState() {
  garden.completedTaskCount = tasks.filter((task) => task.pointsAwarded).length;
  garden.stage = Math.min(garden.maxStage, Math.max(1, garden.completedTaskCount + 1));
  saveGarden();
}

function unlockLetters() {
  letters = letters.map((letter) => {
    if (letter.id === "first-sprout" && garden.stage >= 2) return { ...letter, locked: false };
    if (letter.id === "first-strawberry" && garden.stage >= 5) return { ...letter, locked: false };
    return letter;
  });
  saveLetters();
}

function updateDailyLetterNotice() {
  const todayKey = toDateKey(new Date());
  const achievement = getAchievementForDate(todayKey);

  if (dailyLetterNotice.dateKey !== todayKey) {
    dailyLetterNotice = {
      dateKey: todayKey,
      created: false,
      opened: false,
    };
  }

  if (achievement.type !== "none" && !dailyLetterNotice.created && !dailyLetterNotice.opened) {
    dailyLetterNotice = {
      dateKey: todayKey,
      created: true,
      opened: false,
    };
  }

  saveDailyLetterNotice();
}

function hasUnreadTodayLetterNotice() {
  return (
    dailyLetterNotice.dateKey === toDateKey(new Date()) &&
    dailyLetterNotice.created &&
    !dailyLetterNotice.opened
  );
}

function openTodayLetterNotice() {
  if (!hasUnreadTodayLetterNotice()) return;

  dailyLetterNotice = {
    ...dailyLetterNotice,
    opened: true,
  };
  saveDailyLetterNotice();

  if (homeLetterNotice) {
    homeLetterNotice.hidden = true;
  }
}

function getTodayRecords() {
  return pomodoroRecords.filter((record) => isToday(record.completedAt));
}

function getAchievementForDate(dateKey) {
  const tasksOnDate = tasks.filter((task) => task.completedAt && toDateKey(task.completedAt) === dateKey);
  const hasMain = tasksOnDate.some((task) => task.category === "Main");
  const hasSub = tasksOnDate.some((task) => task.category === "Sub");
  const hasPomodoro = pomodoroRecords.some((record) => toDateKey(record.completedAt) === dateKey);
  const allTasksDoneOnDate =
    tasks.length > 0 && tasks.every((task) => task.completedAt && toDateKey(task.completedAt) === dateKey);

  if (allTasksDoneOnDate && hasPomodoro) return { type: "gift", icon: "gift.png" };
  if (hasPomodoro) return { type: "clock", icon: "clock.png" };
  if (hasMain) return { type: "strawberry", icon: "strawberry.png" };
  if (hasSub) return { type: "flower", icon: "flower.png" };
  return { type: "none", icon: "" };
}

function isToday(value) {
  return toDateKey(value) === toDateKey(new Date());
}

function toDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

saveTasks();
savePomodoroRecords();
saveRewards();
saveLetters();
saveAchievements();
saveFiikun();
saveStrawberryPoints();
saveDailyLetterNotice();
render();
