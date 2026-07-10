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
  restRecords: "fiikun-rest-records-v1",
  taskTemplates: "fiikun-task-templates-v1",
  goals: "fiikun-goals-v1",
  notificationEnabled: "notificationEnabled",
  morningNotificationTime: "morningNotificationTime",
  nightNotificationTime: "nightNotificationTime",
  notificationFrequency: "notificationFrequency",
  lastOpenedDate: "lastOpenedDate",
  unopenedDays: "unopenedDays",
  notificationHistory: "notificationHistory",
  morningNotificationEnabled: "morningNotificationEnabled",
  nightNotificationEnabled: "nightNotificationEnabled",
  unopenedNotificationEnabled: "unopenedNotificationEnabled",
};

const POINTS_PER_TASK = 1;
const GARDEN_MAX_STAGE = 8;

const defaultTasks = [
  createTask("朝のストレッチ 5分", "Tiny", "flower.png", "からだ"),
  createTask("ベリーダンス基礎練習 20分", "Main", "heart.png", "ダンス"),
  {
    ...createTask("読書ノート 1ページ", "Sub", "book.png", "勉強"),
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

const defaultTaskTemplates = [
  createTaskTemplate("ベリーダンス基礎20分", "Main", "heart.png", "ダンス", "daily", "1", "", ""),
  createTaskTemplate("韓国語リスニング15分", "Sub", "book.png", "勉強", "weekday", "1", "", ""),
  createTaskTemplate("TOEIC単語20分", "Main", "pencil.png", "勉強", "daily", "1", "", ""),
  createTaskTemplate("夜ご飯記録", "Tiny", "cup.png", "からだ", "daily", "1", "", ""),
  createTaskTemplate("ストレッチ5分", "Tiny", "flower.png", "からだ", "daily", "1", "", ""),
];

const defaultGoals = [
  createGoal("ベリーダンスを安心して踊る", "ダンス", "", "tasks", 0, 30, "", "基礎練習を積み重ねて、発表会で落ち着いて踊る", "ダンス"),
];

const defaultLetters = [
  {
    id: "first-sprout",
    trigger: "reward_unlock",
    title: "はじめての芽",
    unlockCondition: "garden.stage >= 2",
    locked: true,
    message: "〇〇ちゃん、芽が出たよ。ぼくの畑、かわいくなったでしょ？えへへ、見に来てくれてうれしいの🍓",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "green-leaf",
    trigger: "reward_unlock",
    title: "葉っぱのこえ",
    unlockCondition: "garden.stage >= 3",
    locked: true,
    message: "葉っぱがふわってしたよ。〇〇ちゃんが構ってくれるから、ぼくも畑もごきげんなの。ぎゅっ🐰",
    fiikunImage: "fiikun_stand.png",
  },
  {
    id: "white-flower",
    trigger: "reward_unlock",
    title: "白い花の日",
    unlockCondition: "garden.stage >= 4",
    locked: true,
    message: "白いお花、咲いちゃった。〇〇ちゃんのがんばり、ぼくちゃんと見てたよ。ほめてほしい？えへへ✨",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "first-strawberry",
    trigger: "reward_unlock",
    title: "いちごの日",
    unlockCondition: "garden.stage >= 5",
    locked: true,
    message: "いちごが実ったよ。〇〇ちゃんが来てくれるから、ぼくの畑まで甘くなっちゃうの。すごいでしょ🍓",
    fiikunImage: "fiikun_strawberry.png",
  },
  {
    id: "pink-strawberry",
    trigger: "reward_unlock",
    title: "色づくいちご",
    unlockCondition: "garden.stage >= 6",
    locked: true,
    message: "いちごがピンクになってきたよ。〇〇ちゃん、ぼくのこと見に来るの上手すぎ。ぷん、うれしいの。",
    fiikunImage: "fiikun_surprised.png",
  },
  {
    id: "ripe-strawberry",
    trigger: "reward_unlock",
    title: "まっかな実り",
    unlockCondition: "garden.stage >= 7",
    locked: true,
    message: "まっかないちご、増えたよ。〇〇ちゃんががんばると、ぼくの胸までぽかぽかするの。えへへ。",
    fiikunImage: "fiikun_strawberry.png",
  },
  {
    id: "full-basket",
    trigger: "reward_unlock",
    title: "満開のいちご畑",
    unlockCondition: "garden.stage >= 8",
    locked: true,
    message: "畑いっぱいだよ。〇〇ちゃん、ぼくのこと大好きでしょ？こんなに育ててくれて、ぼく幸せなの🍓",
    fiikunImage: "fiikun_princess.png",
  },
  {
    id: "ten-tasks",
    trigger: "reward_unlock",
    title: "10このがんばり",
    unlockCondition: "completedTaskCount >= 10",
    locked: true,
    message: "10こもできたの？〇〇ちゃん、すごいじゃん。ぼく、となりでずっと見てたよ。ちょっと自慢していい？",
    fiikunImage: "fiikun_king.png",
  },
  {
    id: "five-focus",
    trigger: "reward_unlock",
    title: "集中のリボン",
    unlockCondition: "pomodoroCount >= 5",
    locked: true,
    message: "集中5回、できちゃったね。〇〇ちゃんががんばる音、ぼく好きなの。次もそばにいていい？",
    fiikunImage: "fiikun_cheer.png",
  },
  {
    id: "thirty-berries",
    trigger: "reward_unlock",
    title: "30このいちご",
    unlockCondition: "strawberryPoints >= 30",
    locked: true,
    message: "いちご30こだよ。〇〇ちゃん、ぼくに会いに来すぎかも？えへへ、でももっと来てくれていいよ🍓",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "morning_01",
    trigger: "morning_login",
    title: "おはようのおてがみ",
    message: "〇〇ちゃん、おはよう。今日も来てくれたの？えへへ、ぼく待ってたよ。ゆっくり始めよ🍓",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "morning_02",
    trigger: "morning_login",
    title: "朝のふぃーくん",
    message: "朝から〇〇ちゃんに会えたの、ぼく得しちゃった。今日はTinyひとつでも、ぼく見てるよ。",
    fiikunImage: "fiikun_stand.png",
  },
  {
    id: "night_01",
    trigger: "night_login",
    title: "夜のおてがみ",
    message: "〇〇ちゃん、夜に来てくれたの？えへへ、ぼく眠いけど会えてうれしい。今日もおつかれさま🐰",
    fiikunImage: "fiikun_nightcap.png",
  },
  {
    id: "night_02",
    trigger: "night_login",
    title: "おやすみ前",
    message: "もう夜だね。〇〇ちゃん、今日のぶんぎゅってしておくね。できた日も休んだ日も、ぼくそばにいるよ。",
    fiikunImage: "fiikun_sleep.png",
  },
  {
    id: "first_launch_01",
    trigger: "first_launch",
    title: "はじめまして",
    message: "〇〇ちゃん、来てくれたの？ぼく、ふぃーくん。かわいい相棒だから、いっぱい構ってね。えへへ🍓",
    fiikunImage: "fiikun_normal.png",
  },
  {
    id: "first_launch_02",
    trigger: "first_launch",
    title: "最初のおてがみ",
    message: "ここがぼくと〇〇ちゃんの畑だよ。急がなくていいの。ちょっとずつ一緒に育てよ、ね。",
    fiikunImage: "fiikun_letter.png",
  },
  {
    id: "first_task_01",
    trigger: "first_task_done",
    title: "はじめてできた日",
    message: "はじめてのタスク、できたの？〇〇ちゃんすごいじゃん。ぼくのいちご、さっそく育っちゃうね🍓",
    fiikunImage: "fiikun_surprised.png",
  },
  {
    id: "first_task_02",
    trigger: "first_task_done",
    title: "最初のチェック",
    message: "チェックついたね。〇〇ちゃんの最初の一歩、ぼく見逃してないよ。えへへ、ちゃんと覚えたの。",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "main_task_01",
    trigger: "main_task_done",
    title: "★★★できたね",
    message: "★★★できたの？〇〇ちゃん、やるじゃん。ぼく、ちょっと誇らしくなっちゃった。ぎゅっ🍓",
    fiikunImage: "fiikun_strawberry.png",
  },
  {
    id: "main_task_02",
    trigger: "main_task_done",
    title: "大事な一歩",
    message: "大事なことに向き合ったんだね。〇〇ちゃんのそういうところ、ぼくちゃんと好きだよ。",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "tiny_only_01",
    trigger: "tiny_only_done",
    title: "★の日",
    message: "★だけでもできたの、えらいよ。〇〇ちゃん、ちいさい一歩をなめちゃだめ。ぼくは見てるの。",
    fiikunImage: "fiikun_think.png",
  },
  {
    id: "tiny_only_02",
    trigger: "tiny_only_done",
    title: "小さな花",
    message: "今日は★の日だね。小さくてもちゃんと進んでるよ。ぼく、となりでふわっと応援してるね🐰",
    fiikunImage: "fiikun_stand.png",
  },
  {
    id: "streak_3_01",
    trigger: "three_day_streak",
    title: "3日連続",
    message: "3日も続いたの？〇〇ちゃん、ぼくに会いに来るの好きでしょ。えへへ、ぼくも大好きだよ🍓",
    fiikunImage: "fiikun_king.png",
  },
  {
    id: "streak_3_02",
    trigger: "three_day_streak",
    title: "三日目のぎゅっ",
    message: "3日連続、ちゃんと重なったね。〇〇ちゃんのペース、ぼく好きだよ。このまま一緒に行こ。",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "streak_7_01",
    trigger: "seven_day_streak",
    title: "7日連続",
    message: "7日も続けたの？すごすぎて、ぼく王冠かぶっちゃう。〇〇ちゃん、ほんとにかっこいいよ✨",
    fiikunImage: "fiikun_king.png",
  },
  {
    id: "streak_7_02",
    trigger: "seven_day_streak",
    title: "一週間の相棒",
    message: "一週間いっしょに来られたね。〇〇ちゃんの毎日、ぼくの宝物みたいになってるの。ぎゅっ。",
    fiikunImage: "fiikun_letter.png",
  },
  {
    id: "away_01",
    trigger: "long_absence",
    title: "待ってたよ",
    message: "昨日来なかったでしょ。ぼく、ちょっとだけぷん。でも〇〇ちゃんに会えたから、もういいの。",
    fiikunImage: "fiikun_sad.png",
  },
  {
    id: "away_02",
    trigger: "long_absence",
    title: "さみしかった日",
    message: "しばらく会えなくて、ぼく少し丸くなって待ってたよ。戻ってきてくれてうれしい。今日はゆっくりね。",
    fiikunImage: "fiikun_lying.png",
  },
  {
    id: "reward_open_01",
    trigger: "reward_unlocked",
    title: "ごほうび解放",
    message: "ごほうび開いたよ。〇〇ちゃんががんばったからだね。ぼくも一緒にもらった気分なの、えへへ✨",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "reward_open_02",
    trigger: "reward_unlocked",
    title: "ひみつの箱",
    message: "新しいごほうび、ちらって見えたよ。〇〇ちゃん、開けるの上手。ぼくまでわくわくしてるの✨",
    fiikunImage: "fiikun_surprised.png",
  },
  {
    id: "reward_exchange_01",
    trigger: "reward_exchanged",
    title: "ごほうび交換",
    message: "交換できたね。〇〇ちゃん、自分にやさしくできてえらいよ。ぼくもとなりでにこにこしてる🍓",
    fiikunImage: "fiikun_strawberry.png",
  },
  {
    id: "reward_exchange_02",
    trigger: "reward_exchanged",
    title: "ごほうびの日",
    message: "今日はごほうびの日だね。ちゃんと受け取ってくれる〇〇ちゃん、ぼく好き。いっぱい休んでね。",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "pomodoro_01",
    trigger: "pomodoro_done",
    title: "集中できたね",
    message: "ポモドーロできたの？〇〇ちゃん、集中してる顔もいいじゃん。ぼく、横で応援してたよ🐰",
    fiikunImage: "fiikun_cheer.png",
  },
  {
    id: "pomodoro_02",
    trigger: "pomodoro_done",
    title: "タイマーのあと",
    message: "タイマー最後まで行けたね。〇〇ちゃんの集中、ぼくの耳までぴんってしちゃうくらいすてき。",
    fiikunImage: "fiikun_cheer.png",
  },
  {
    id: "dance_01",
    trigger: "dance_task_done",
    title: "ダンスの日",
    message: "ダンスできたの？〇〇ちゃんが動くと、ぼくまで胸がはねちゃう。かっこよかったよ✨",
    fiikunImage: "fiikun_cheer.png",
  },
  {
    id: "dance_02",
    trigger: "dance_task_done",
    title: "ステージのそばで",
    message: "今日のダンス、ぼく見てたよ。〇〇ちゃんの一歩、ちゃんとステージに近づいてるの。ぎゅっ。",
    fiikunImage: "fiikun_happy.png",
  },
  {
    id: "meal_01",
    trigger: "meal_task_done",
    title: "からだを大事に",
    message: "食事のことできたんだね。〇〇ちゃんが自分を大事にすると、ぼくもほっとするの。えへへ。",
    fiikunImage: "fiikun_strawberry.png",
  },
  {
    id: "meal_02",
    trigger: "meal_task_done",
    title: "やさしい選択",
    message: "ダイエット系のタスク、できたのすごいよ。無理しすぎないでね。ぼく、元気な〇〇ちゃんが好き。",
    fiikunImage: "fiikun_letter.png",
  },
  {
    id: "study_01",
    trigger: "study_task_done",
    title: "勉強の日",
    message: "勉強できたの？〇〇ちゃんの頭、今日はきらってしてるね。ぼく、となりで静かに見てたよ✨",
    fiikunImage: "fiikun_think.png",
  },
  {
    id: "study_02",
    trigger: "study_task_done",
    title: "ノートのそばで",
    message: "机に向かえたんだね。〇〇ちゃんの一文字ずつ、ちゃんと未来につながってるよ。ぼく信じてるの。",
    fiikunImage: "fiikun_sailor.png",
  },
  {
    id: "no_progress_01",
    trigger: "no_progress_day",
    title: "できなかった日",
    message: "今日は何もできなくてもいいよ。〇〇ちゃんがここに来てくれただけで、ぼくはちょっと安心したの。",
    fiikunImage: "fiikun_sleep.png",
  },
  {
    id: "no_progress_02",
    trigger: "no_progress_day",
    title: "休む日のぼく",
    message: "動けない日もあるよね。ぷんってしないよ。〇〇ちゃんのそばで、ぼくも丸くなってるね🐰",
    fiikunImage: "fiikun_lying.png",
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

const defaultNotificationSettings = {
  notificationEnabled: false,
  morningNotificationEnabled: true,
  nightNotificationEnabled: true,
  unopenedNotificationEnabled: true,
  morningNotificationTime: "08:00",
  nightNotificationTime: "21:00",
  notificationFrequency: "daily",
  lastOpenedDate: "",
  unopenedDays: 0,
  notificationHistory: [],
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
let restRecords = loadJson(STORAGE_KEYS.restRecords, []);
let rewards = loadJson(STORAGE_KEYS.rewards, defaultRewards);
let letters = mergeDefaultLetters(loadJson(STORAGE_KEYS.letters, defaultLetters));
let achievements = loadJson(STORAGE_KEYS.achievements, defaultAchievements);
let fiikun = loadObject(STORAGE_KEYS.fiikun, defaultFiikun);
let garden = loadObject(STORAGE_KEYS.garden, defaultGarden);
let userSettings = loadObject(STORAGE_KEYS.userSettings, defaultUserSettings);
let notificationSettings = loadNotificationSettings();
let taskTemplates = normalizeTaskTemplates(loadJson(STORAGE_KEYS.taskTemplates, defaultTaskTemplates));
let goals = normalizeGoals(loadJson(STORAGE_KEYS.goals, defaultGoals));
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
let notificationCheckInterval = null;
let focusElapsedSeconds = 0;
let focusStrawberryCount = 0;
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
  goals: document.querySelector("#goals-view"),
  settings: document.querySelector("#settings-view"),
  rewards: document.querySelector("#rewards-view"),
};

const taskList = document.querySelector("#task-list");
const taskHistoryList = document.querySelector("#task-history-list");
const taskHistoryCount = document.querySelector("#task-history-count");
const homeTaskList = document.querySelector("#home-task-list");
const taskForm = document.querySelector("#task-form");
const taskTitle = document.querySelector("#task-title");
const taskCategory = document.querySelector("#task-category");
const taskIcon = document.querySelector("#task-icon");
const taskTopic = document.querySelector("#task-topic");
const progressLabel = document.querySelector("#progress-label");
const fieldMessage = document.querySelector("#field-message");
const homeFiikunImage = document.querySelector("#home-fiikun-image");
const homeLetterNotice = document.querySelector("#home-letter-notice");
const homeRecommendationList = document.querySelector("#home-recommendation-list");
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
const focusOverlay = document.querySelector("#focus-overlay");
const focusTimerDisplay = document.querySelector("#focus-timer-display");
const focusSky = document.querySelector("#focus-sky");
const focusBasket = document.querySelector("#focus-basket");
const focusPause = document.querySelector("#focus-pause");
const focusExit = document.querySelector("#focus-exit");
const recordList = document.querySelector("#record-list");
const recordTotal = document.querySelector("#record-total");
const clearRecords = document.querySelector("#clear-records");
const tinyDayButton = document.querySelector("#tiny-day-button");
const restDayButton = document.querySelector("#rest-day-button");
const restSaveNote = document.querySelector("#rest-save-note");
const calendarTitle = document.querySelector("#calendar-title");
const calendarGrid = document.querySelector("#calendar-grid");
const prevMonth = document.querySelector("#prev-month");
const nextMonth = document.querySelector("#next-month");
const letterDate = document.querySelector("#letter-date");
const letterGreeting = document.querySelector("#letter-greeting");
const letterBody = document.querySelector("#letter-body");
const insightsDate = document.querySelector("#insights-date");
const insightTodayMinutes = document.querySelector("#insight-today-minutes");
const insightAverageMinutes = document.querySelector("#insight-average-minutes");
const insightTodayPomos = document.querySelector("#insight-today-pomos");
const insightCompletedTasks = document.querySelector("#insight-completed-tasks");
const insightBerryCount = document.querySelector("#insight-berry-count");
const insightBerryGrid = document.querySelector("#insight-berry-grid");
const insightBreakdownList = document.querySelector("#insight-breakdown-list");
const goalForm = document.querySelector("#goal-form");
const goalIdInput = document.querySelector("#goal-id");
const goalTitleInput = document.querySelector("#goal-title");
const goalCategoryInput = document.querySelector("#goal-category");
const goalDeadlineInput = document.querySelector("#goal-deadline");
const goalConditionTypeInput = document.querySelector("#goal-condition-type");
const goalMetricCategoryInput = document.querySelector("#goal-metric-category");
const goalCurrentValueInput = document.querySelector("#goal-current-value");
const goalTargetValueInput = document.querySelector("#goal-target-value");
const goalRewardInput = document.querySelector("#goal-reward");
const goalNoteInput = document.querySelector("#goal-note");
const goalSubmit = document.querySelector("#goal-submit");
const goalCancel = document.querySelector("#goal-cancel");
const goalList = document.querySelector("#goal-list");
const nameSettingsForm = document.querySelector("#name-settings-form");
const userDisplayNameInput = document.querySelector("#user-display-name");
const nameSaveNote = document.querySelector("#name-save-note");
const notificationPermissionButton = document.querySelector("#notification-permission-button");
const notificationStatus = document.querySelector("#notification-status");
const notificationSettingsForm = document.querySelector("#notification-settings-form");
const notificationEnabledInput = document.querySelector("#notification-enabled");
const morningNotificationEnabledInput = document.querySelector("#morning-notification-enabled");
const morningNotificationTimeInput = document.querySelector("#morning-notification-time");
const nightNotificationEnabledInput = document.querySelector("#night-notification-enabled");
const nightNotificationTimeInput = document.querySelector("#night-notification-time");
const unopenedNotificationEnabledInput = document.querySelector("#unopened-notification-enabled");
const notificationFrequencyInput = document.querySelector("#notification-frequency");
const notificationHistoryList = document.querySelector("#notification-history-list");
const templateForm = document.querySelector("#template-form");
const templateTitle = document.querySelector("#template-title");
const templateCategory = document.querySelector("#template-category");
const templateIcon = document.querySelector("#template-icon");
const templateTopic = document.querySelector("#template-topic");
const templateRepeat = document.querySelector("#template-repeat");
const templateWeekday = document.querySelector("#template-weekday");
const templateStart = document.querySelector("#template-start");
const templateEnd = document.querySelector("#template-end");
const templateList = document.querySelector("#template-list");
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

  tasks.unshift(createTask(title, taskCategory.value, taskIcon.value, taskTopic.value));
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
  resetFocusMode();
  renderTimer();
});

timerComplete.addEventListener("click", () => {
  addPomodoroRecord(timerMinutes, "手動で記録");
  pauseTimer();
  remainingSeconds = timerMinutes * 60;
  resetFocusMode();
  render();
});

focusPause.addEventListener("click", () => {
  timerRunning ? pauseTimer() : startTimer();
});

focusExit.addEventListener("click", () => {
  hideFocusMode();
});

clearRecords.addEventListener("click", () => {
  pomodoroRecords = pomodoroRecords.filter((record) => !isToday(record.completedAt));
  restRecords = restRecords.filter((record) => !isToday(record.createdAt));
  savePomodoroRecords();
  saveRestRecords();
  render();
});

tinyDayButton.addEventListener("click", () => {
  addRestRecord("tiny", "★だけの日");
});

restDayButton.addEventListener("click", () => {
  addRestRecord("rest", "おやすみの日");
});

prevMonth.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = goalTitleInput.value.trim();
  const targetValue = Number(goalTargetValueInput.value);
  const currentValue = Number(goalCurrentValueInput.value);
  if (!title || !Number.isFinite(targetValue) || targetValue < 1) return;

  const goalData = {
    title,
    category: goalCategoryInput.value,
    deadline: goalDeadlineInput.value,
    conditionType: goalConditionTypeInput.value,
    metricCategory: goalMetricCategoryInput.value,
    currentValue: Number.isFinite(currentValue) ? Math.max(0, currentValue) : 0,
    targetValue,
    rewardId: goalRewardInput.value,
    note: goalNoteInput.value.trim(),
  };

  if (goalIdInput.value) {
    goals = goals.map((goal) => goal.id === goalIdInput.value ? { ...goal, ...goalData } : goal);
  } else {
    goals.unshift(createGoal(
      goalData.title,
      goalData.category,
      goalData.deadline,
      goalData.conditionType,
      goalData.currentValue,
      goalData.targetValue,
      goalData.rewardId,
      goalData.note,
      goalData.metricCategory,
    ));
  }

  saveGoals();
  resetGoalForm();
  render();
});

goalCancel.addEventListener("click", () => {
  resetGoalForm();
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

notificationPermissionButton.addEventListener("click", async () => {
  const permission = await requestFiikunNotificationPermission();
  if (permission === "granted") {
    notificationSettings.notificationEnabled = true;
    saveNotificationSettings();
    notifyFiikun("permission", "通知、つながったよ", `${getDisplayNickname()}、これでぼくの声が届くね。えへへ、待ってて🍓`);
  }
  renderNotificationSettings();
});

notificationSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  notificationSettings.notificationEnabled = notificationEnabledInput.checked;
  notificationSettings.morningNotificationEnabled = morningNotificationEnabledInput.checked;
  notificationSettings.nightNotificationEnabled = nightNotificationEnabledInput.checked;
  notificationSettings.unopenedNotificationEnabled = unopenedNotificationEnabledInput.checked;
  notificationSettings.morningNotificationTime = morningNotificationTimeInput.value || defaultNotificationSettings.morningNotificationTime;
  notificationSettings.nightNotificationTime = nightNotificationTimeInput.value || defaultNotificationSettings.nightNotificationTime;
  notificationSettings.notificationFrequency = notificationFrequencyInput.value || defaultNotificationSettings.notificationFrequency;
  saveNotificationSettings();
  renderNotificationSettings();
  checkScheduledNotifications();
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
  render();
});

templateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = templateTitle.value.trim();
  if (!title) return;

  taskTemplates.unshift(createTaskTemplate(
    title,
    templateCategory.value,
    templateIcon.value,
    templateTopic.value,
    templateRepeat.value,
    templateWeekday.value,
    templateStart.value,
    templateEnd.value,
  ));
  templateForm.reset();
  saveTaskTemplates();
  renderTemplates();
  templateTitle.focus();
});

document.querySelectorAll("[data-template-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const [title, category, icon, topic = ""] = button.dataset.templatePreset.split("|");
    templateTitle.value = title;
    templateCategory.value = category;
    templateIcon.value = icon;
    templateTopic.value = topic;
    templateTitle.focus();
  });
});

gardenStageImage.addEventListener("error", () => {
  gardenStageImage.closest(".garden-visual").classList.add("missing-stage");
});

homeGardenStageImage.addEventListener("error", () => {
  homeGardenStageImage.closest(".garden-visual").classList.add("missing-stage");
});

function createTask(title, category, icon, topic = "") {
  return {
    id: crypto.randomUUID(),
    title,
    category,
    icon,
    topic,
    done: false,
    completedAt: null,
    pointsAwarded: false,
  };
}

function createTaskTemplate(title, category, icon, topic = "", repeat = "daily", weekday = "1", startDate = "", endDate = "") {
  return {
    id: crypto.randomUUID(),
    title,
    category,
    icon,
    topic,
    repeat,
    weekday,
    startDate,
    endDate,
    createdAt: new Date().toISOString(),
  };
}

function createGoal(title, category, deadline, conditionType, currentValue, targetValue, rewardId, note, metricCategory = "") {
  return {
    id: crypto.randomUUID(),
    title,
    category,
    deadline,
    conditionType,
    metricCategory,
    currentValue,
    targetValue,
    rewardId,
    note,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
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

function loadBoolean(key, fallback) {
  const saved = localStorage.getItem(key);
  if (saved === null) return fallback;
  return saved === "true";
}

function loadString(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved === null || saved === "" ? fallback : saved;
}

function loadNotificationSettings() {
  return {
    notificationEnabled: loadBoolean(STORAGE_KEYS.notificationEnabled, defaultNotificationSettings.notificationEnabled),
    morningNotificationEnabled: loadBoolean(STORAGE_KEYS.morningNotificationEnabled, defaultNotificationSettings.morningNotificationEnabled),
    nightNotificationEnabled: loadBoolean(STORAGE_KEYS.nightNotificationEnabled, defaultNotificationSettings.nightNotificationEnabled),
    unopenedNotificationEnabled: loadBoolean(STORAGE_KEYS.unopenedNotificationEnabled, defaultNotificationSettings.unopenedNotificationEnabled),
    morningNotificationTime: loadString(STORAGE_KEYS.morningNotificationTime, defaultNotificationSettings.morningNotificationTime),
    nightNotificationTime: loadString(STORAGE_KEYS.nightNotificationTime, defaultNotificationSettings.nightNotificationTime),
    notificationFrequency: loadString(STORAGE_KEYS.notificationFrequency, defaultNotificationSettings.notificationFrequency),
    lastOpenedDate: loadString(STORAGE_KEYS.lastOpenedDate, defaultNotificationSettings.lastOpenedDate),
    unopenedDays: loadNumber(STORAGE_KEYS.unopenedDays) || defaultNotificationSettings.unopenedDays,
    notificationHistory: loadJson(STORAGE_KEYS.notificationHistory, defaultNotificationSettings.notificationHistory),
  };
}

function normalizeTasks(items) {
  return items.map((task) => ({
    ...task,
    topic: task.topic || "",
    completedAt: task.done && !task.completedAt ? new Date().toISOString() : task.completedAt || null,
    pointsAwarded: Boolean(task.pointsAwarded || task.done),
  }));
}

function normalizeTaskTemplates(items) {
  return items.map((template) => ({
    ...template,
    topic: template.topic || "",
    repeat: template.repeat || "daily",
    weekday: template.weekday || "1",
    startDate: template.startDate || "",
    endDate: template.endDate || "",
  }));
}

function normalizeGoals(items) {
  return items.map((goal) => ({
    ...goal,
    category: goal.category || "その他",
    deadline: goal.deadline || "",
    conditionType: goal.conditionType || "manual",
    metricCategory: goal.metricCategory || "",
    currentValue: Number(goal.currentValue) || 0,
    targetValue: Math.max(1, Number(goal.targetValue) || 1),
    rewardId: goal.rewardId || "",
    note: goal.note || "",
    completed: Boolean(goal.completed),
    completedAt: goal.completedAt || null,
  }));
}

function mergeDefaultLetters(savedLetters) {
  const savedById = new Map(savedLetters.map((letter) => [letter.id, letter]));
  return defaultLetters.map((letter) => ({
    ...letter,
    locked: savedById.has(letter.id) ? Boolean(savedById.get(letter.id).locked) : letter.locked,
  }));
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function savePomodoroRecords() {
  localStorage.setItem(STORAGE_KEYS.pomodoroRecords, JSON.stringify(pomodoroRecords));
}

function saveRestRecords() {
  localStorage.setItem(STORAGE_KEYS.restRecords, JSON.stringify(restRecords));
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

function saveNotificationSettings() {
  localStorage.setItem(STORAGE_KEYS.notificationEnabled, String(notificationSettings.notificationEnabled));
  localStorage.setItem(STORAGE_KEYS.morningNotificationTime, notificationSettings.morningNotificationTime);
  localStorage.setItem(STORAGE_KEYS.nightNotificationTime, notificationSettings.nightNotificationTime);
  localStorage.setItem(STORAGE_KEYS.notificationFrequency, notificationSettings.notificationFrequency);
  localStorage.setItem(STORAGE_KEYS.lastOpenedDate, notificationSettings.lastOpenedDate);
  localStorage.setItem(STORAGE_KEYS.unopenedDays, String(notificationSettings.unopenedDays));
  localStorage.setItem(STORAGE_KEYS.notificationHistory, JSON.stringify(notificationSettings.notificationHistory));
  localStorage.setItem(STORAGE_KEYS.morningNotificationEnabled, String(notificationSettings.morningNotificationEnabled));
  localStorage.setItem(STORAGE_KEYS.nightNotificationEnabled, String(notificationSettings.nightNotificationEnabled));
  localStorage.setItem(STORAGE_KEYS.unopenedNotificationEnabled, String(notificationSettings.unopenedNotificationEnabled));
}

function saveTaskTemplates() {
  localStorage.setItem(STORAGE_KEYS.taskTemplates, JSON.stringify(taskTemplates));
}

function saveGoals() {
  localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
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

function getDisplayNickname() {
  const name = getDisplayName();
  return /(?:ちゃん|くん|さん)$/.test(name) ? name : `${name}ちゃん`;
}

function personalizeFiikunMessage(message) {
  return String(message || "").replaceAll("〇〇ちゃん", getDisplayNickname()).replaceAll("〇〇", getDisplayName());
}

function formatUnlockCondition(condition) {
  const labels = {
    "default": "最初から選べます",
    "garden.stage >= 2": "いちご畑がステージ2になると解放",
    "garden.stage >= 3": "いちご畑がステージ3になると解放",
    "garden.stage >= 4": "いちご畑がステージ4になると解放",
    "garden.stage >= 5": "いちご畑がステージ5になると解放",
    "garden.stage >= 6": "いちご畑がステージ6になると解放",
    "garden.stage >= 7": "いちご畑がステージ7になると解放",
    "garden.stage >= 8": "いちご畑がステージ8になると解放",
    "completedTaskCount >= 10": "タスクを10こ完了すると解放",
    "pomodoroCount >= 5": "ポモドーロを5回完了すると解放",
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
  renderInsights();
  renderCalendar();
  renderLetter();
  renderGoals();
  renderNameSettings();
  renderNotificationSettings();
  renderTemplates();
  renderRewards();
}

function renderTasks() {
  const visibleTasks =
    activeFilter === "all" ? tasks : tasks.filter((task) => task.category === activeFilter);
  const activeTasks = visibleTasks.filter((task) => !task.done);
  const completedTasks = visibleTasks
    .filter((task) => task.done)
    .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

  taskCount.textContent = `${activeTasks.length}件`;
  taskList.innerHTML = "";
  taskHistoryList.innerHTML = "";
  taskHistoryCount.textContent = `${completedTasks.length}件`;

  if (activeTasks.length === 0) {
    taskList.appendChild(createEmptyState("この表示にタスクはありません。", "fiikun_sleep.png"));
  } else {
    activeTasks.forEach((task) => {
      taskList.appendChild(createTaskItem(task));
    });
  }

  if (completedTasks.length === 0) {
    taskHistoryList.appendChild(createEmptyState("完了したタスクはここに残ります。", "fiikun_happy.png"));
  } else {
    completedTasks.forEach((task) => {
      taskHistoryList.appendChild(createTaskItem(task));
    });
  }
}

function createTaskItem(task) {
  const item = document.createElement("article");
  item.className = `task-item ${task.done ? "done" : ""}`;

  item.innerHTML = `
    <img class="task-icon-img" src="./assets/${task.icon}" alt="" />
    <div>
      <p class="task-title"></p>
      <p class="task-meta">${task.done ? formatCompletedTaskMeta(task) : "これから育てるタスク"}${formatTopicSuffix(task.topic)}</p>
    </div>
    <span class="category-pill ${task.category}">${formatPriorityLabel(task.category)}</span>
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
  return item;
}

function formatCompletedTaskMeta(task) {
  if (!task.completedAt) return "完了済み";
  const date = new Date(task.completedAt);
  return `完了済み / ${date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}`;
}

function renderHome() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const activeTasks = tasks.filter((task) => !task.done);
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

  renderHomeRecommendations();

  homeTaskList.innerHTML = "";
  activeTasks.slice(0, 4).forEach((task) => {
    const item = document.createElement("article");
    item.className = `mini-task ${task.done ? "done" : ""}`;
    item.innerHTML = `
      <img src="./assets/${task.icon}" alt="" />
      <div>
        <p class="task-title"></p>
        <p class="task-meta">${task.done ? "できた" : "今日の約束"}${formatTopicSuffix(task.topic)}</p>
      </div>
      <span class="category-pill ${task.category}">${formatPriorityLabel(task.category)}</span>
    `;
    item.querySelector(".task-title").textContent = task.title;
    homeTaskList.appendChild(item);
  });

  if (activeTasks.length === 0 && tasks.length > 0) {
    homeTaskList.appendChild(createEmptyState("今日のタスクは全部できました。", "fiikun_happy.png"));
  } else if (tasks.length === 0) {
    homeTaskList.appendChild(createEmptyState("タスクを追加すると、ここに表示されます。", "fiikun_think.png"));
  }
}

function renderHomeRecommendations() {
  const recommendations = getTodayRecommendations();
  homeRecommendationList.innerHTML = "";
  recommendations.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.title;
    homeRecommendationList.appendChild(li);
  });
}

function getTodayRecommendations() {
  const picks = [];
  ["Main", "Sub", "Tiny"].forEach((category) => {
    const task = tasks.find((item) => item.category === category && !item.done);
    if (task) picks.push(task);
  });

  getActiveTemplatesForDate(new Date()).forEach((template) => {
    if (picks.length >= 3) return;
    const alreadyPicked = picks.some((item) => item.title === template.title);
    const alreadyInTasks = tasks.some((task) => task.title === template.title && !task.done);
    if (!alreadyPicked && !alreadyInTasks) picks.push(template);
  });

  if (picks.length === 0) {
    return [{ title: "今日は休むだけでもOK" }, { title: "水分をとる" }, { title: "ふぃーくんを見に来る" }];
  }

  return picks.slice(0, 3);
}

function renderTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timerDisplay.textContent = timeText;
  focusTimerDisplay.textContent = timeText;
  timerStart.textContent = timerRunning ? "一時停止" : "スタート";
  focusPause.textContent = timerRunning ? "一時停止" : "再開";
  timerMode.textContent = timerRunning ? "集中しています" : "集中時間";
}

function renderRecords() {
  const todayRecords = getTodayRecords();
  const todayRestRecords = getTodayRestRecords();
  const minutes = todayRecords.reduce((sum, record) => sum + record.minutes, 0);

  recordTotal.textContent = `${todayRecords.length}回 / ${minutes}分${todayRestRecords.length ? ` / 休み${todayRestRecords.length}件` : ""}`;
  recordList.innerHTML = "";

  if (todayRecords.length === 0 && todayRestRecords.length === 0) {
    recordList.appendChild(createEmptyState("まだ今日の記録はありません。", "fiikun_nightcap.png"));
    return;
  }

  todayRestRecords
    .slice()
    .reverse()
    .forEach((record) => {
      const item = document.createElement("article");
      const time = new Date(record.createdAt).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });

      item.className = "record-item";
      item.innerHTML = `
        <img src="./assets/${record.type === "tiny" ? "flower.png" : "fiikun_sleep.png"}" alt="" />
        <div>
          <p class="record-title">${record.label}</p>
          <p class="record-meta">${time}に記録</p>
        </div>
        <span class="category-pill Tiny">${record.type === "tiny" ? "★" : "Rest"}</span>
      `;
      recordList.appendChild(item);
    });

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

function renderInsights() {
  const todayKey = toDateKey(new Date());
  const todayRecords = getRecordsForDate(todayKey);
  const todayMinutes = sumRecordMinutes(todayRecords);
  const lastSevenMinutes = getLastSevenDateKeys().map((dateKey) => sumRecordMinutes(getRecordsForDate(dateKey)));
  const averageMinutes = Math.round(lastSevenMinutes.reduce((sum, minutes) => sum + minutes, 0) / 7);
  const completedToday = tasks.filter((task) => task.completedAt && toDateKey(task.completedAt) === todayKey).length;

  insightsDate.textContent = new Date().toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  insightTodayMinutes.textContent = formatInsightMinutes(todayMinutes);
  insightAverageMinutes.textContent = formatInsightMinutes(averageMinutes);
  insightTodayPomos.textContent = String(todayRecords.length);
  insightCompletedTasks.textContent = String(completedToday);
  insightBerryCount.textContent = `${todayRecords.length}こ`;

  insightBerryGrid.innerHTML = "";
  const berryCount = Math.max(todayRecords.length, todayMinutes > 0 ? 1 : 0);
  if (berryCount === 0) {
    insightBerryGrid.appendChild(createEmptyState("集中すると、ここにいちごが並びます。", "fiikun_sleep.png"));
  } else {
    Array.from({ length: Math.min(berryCount, 32) }, (_, index) => {
      const img = document.createElement("img");
      img.src = "./assets/strawberry.png";
      img.alt = "";
      img.style.transform = `rotate(${(index % 5 - 2) * 5}deg)`;
      insightBerryGrid.appendChild(img);
      return img;
    });
  }

  renderInsightBreakdown(todayRecords, completedToday);
}

function renderInsightBreakdown(todayRecords, completedToday) {
  const rows = [
    {
      label: "ポモドーロ",
      value: `${formatInsightMinutes(sumRecordMinutes(todayRecords))} / ${todayRecords.length}回`,
      icon: "clock.png",
      percent: Math.min(100, todayRecords.length * 20),
    },
    {
      label: "タスク",
      value: `${completedToday}件完了`,
      icon: "plant.png",
      percent: Math.min(100, completedToday * 20),
    },
    {
      label: "いちご畑",
      value: `ステージ ${garden.stage} / ${garden.maxStage}`,
      icon: "strawberry.png",
      percent: Math.round((garden.stage / garden.maxStage) * 100),
    },
  ];

  insightBreakdownList.innerHTML = "";
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "insight-breakdown-item";
    item.innerHTML = `
      <img src="./assets/${row.icon}" alt="" />
      <div>
        <div class="insight-breakdown-heading">
          <strong>${row.label}</strong>
          <span>${row.value}</span>
        </div>
        <div class="insight-progress"><span style="width: ${row.percent}%"></span></div>
      </div>
    `;
    insightBreakdownList.appendChild(item);
  });
}

function getRecordsForDate(dateKey) {
  return pomodoroRecords.filter((record) => toDateKey(record.completedAt) === dateKey);
}

function sumRecordMinutes(records) {
  return records.reduce((sum, record) => sum + record.minutes, 0);
}

function getLastSevenDateKeys() {
  const date = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(date);
    day.setDate(date.getDate() - index);
    return toDateKey(day);
  });
}

function formatInsightMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
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
  letterGreeting.textContent = `${getDisplayNickname()}へ`;

  letterDate.textContent = date.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  letterBody.textContent = getDailyLetterMessage(achievement.type, selectedDateKey);
}

function getDailyLetterMessage(type, dateKey) {
  const triggers = {
    gift: "reward_unlocked",
    first_task: "first_task_done",
    streak_7: "seven_day_streak",
    streak_3: "three_day_streak",
    dance: "dance_task_done",
    meal: "meal_task_done",
    study: "study_task_done",
    strawberry: "main_task_done",
    flower: "tiny_only_done",
    clock: "pomodoro_done",
    rest: "no_progress_day",
    none: "no_progress_day",
  };
  return getTriggeredLetterMessage(triggers[type] || "no_progress_day", dateKey);
}

function getTriggeredLetterMessage(trigger, dateKey) {
  const variants = letters.filter((letter) => letter.trigger === trigger && letter.message);
  if (variants.length === 0) {
    return `${getDisplayNickname()}、今日も来てくれたの？えへへ、ぼくはここにいるよ。ゆっくりで大丈夫なの。`;
  }
  const index = getDateVariantIndex(dateKey, variants.length);
  return personalizeFiikunMessage(variants[index]?.message || "");
}

function getDateVariantIndex(dateKey, count) {
  return [...dateKey].reduce((sum, char) => sum + char.charCodeAt(0), 0) % count;
}

function renderGoals() {
  updateGoalRewardOptions();
  syncAutoGoalProgress();
  goalList.innerHTML = "";

  if (goals.length === 0) {
    goalList.appendChild(createEmptyState("目標を追加すると、ここにカードが並びます。", "fiikun_think.png"));
    return;
  }

  goals.forEach((goal) => {
    const current = getGoalCurrentValue(goal);
    const percent = Math.min(100, Math.round((current / goal.targetValue) * 100));
    const reward = rewards.find((item) => item.id === goal.rewardId);
    const item = document.createElement("article");
    item.className = `goal-card ${goal.completed ? "completed" : ""}`;
    item.innerHTML = `
      <div class="goal-card-main">
        <img src="./assets/${getGoalImage(goal)}" alt="" />
        <div>
          <div class="goal-title-row">
            <h3></h3>
            <span class="category-pill ${goal.completed ? "Tiny" : "Main"}">${goal.completed ? "達成" : goal.category}</span>
          </div>
          <p class="goal-meta">${formatGoalCondition(goal)}${goal.deadline ? ` / ${formatDateShort(goal.deadline)}まで` : ""}</p>
        </div>
      </div>
      <div class="goal-progress" aria-label="目標の進捗">
        <span style="width: ${percent}%"></span>
      </div>
      <div class="goal-progress-row">
        <strong>${current} / ${goal.targetValue}</strong>
        <span>${percent}%</span>
      </div>
      <p class="goal-comment">${getGoalComment(goal, percent)}</p>
      ${goal.note ? `<p class="goal-note">${escapeHtml(goal.note)}</p>` : ""}
      ${reward ? `<p class="goal-linked-reward"><img src="./assets/${reward.icon}" alt="" />${escapeHtml(reward.title)}</p>` : ""}
      <div class="goal-update-row">
        <input type="number" min="0" max="9999" value="${current}" aria-label="現在値" />
        <button class="exchange-button" type="button" data-action="update">更新</button>
      </div>
      <div class="goal-actions">
        <button class="exchange-button" type="button" data-action="complete">${goal.completed ? "達成済み" : "達成にする"}</button>
        <button class="exchange-button" type="button" data-action="edit">編集</button>
        <button class="exchange-button" type="button" data-action="delete">削除</button>
      </div>
    `;

    item.querySelector("h3").textContent = goal.title;
    item.querySelector('[data-action="update"]').addEventListener("click", () => {
      const value = Number(item.querySelector("input").value);
      updateGoalProgress(goal.id, value);
    });
    item.querySelector('[data-action="complete"]').addEventListener("click", () => completeGoal(goal.id));
    item.querySelector('[data-action="edit"]').addEventListener("click", () => editGoal(goal.id));
    item.querySelector('[data-action="delete"]').addEventListener("click", () => deleteGoal(goal.id));
    goalList.appendChild(item);
  });
}

function updateGoalRewardOptions() {
  const currentValue = goalRewardInput.value;
  goalRewardInput.innerHTML = '<option value="">なし</option>';
  rewards.forEach((reward) => {
    const option = document.createElement("option");
    option.value = reward.id;
    option.textContent = reward.title;
    goalRewardInput.appendChild(option);
  });
  goalRewardInput.value = [...goalRewardInput.options].some((option) => option.value === currentValue) ? currentValue : "";
}

function syncAutoGoalProgress() {
  let changed = false;
  goals = goals.map((goal) => {
    if (goal.conditionType === "manual" || goal.completed) return goal;
    const currentValue = Math.max(goal.currentValue, getGoalMetricValue(goal.conditionType, goal));
    const completed = currentValue >= goal.targetValue;
    if (currentValue === goal.currentValue && completed === goal.completed) return goal;
    changed = true;
    return {
      ...goal,
      currentValue,
      completed,
      completedAt: completed ? (goal.completedAt || new Date().toISOString()) : null,
    };
  });
  if (changed) saveGoals();
}

function getGoalCurrentValue(goal) {
  return goal.conditionType === "manual" ? goal.currentValue : Math.max(goal.currentValue, getGoalMetricValue(goal.conditionType, goal));
}

function getGoalMetricValue(type, goal = {}) {
  if (type === "tasks") {
    return tasks.filter((task) => {
      if (!task.pointsAwarded) return false;
      return !goal.metricCategory || task.topic === goal.metricCategory;
    }).length;
  }
  if (type === "strawberries") return strawberryPoints;
  if (type === "pomodoros") return pomodoroRecords.length;
  return 0;
}

function formatGoalCondition(goal) {
  const labels = {
    tasks: "タスク回数",
    strawberries: "いちご数",
    pomodoros: "ポモドーロ回数",
    manual: "手動入力",
  };
  const label = labels[goal.conditionType] || "手動入力";
  if (goal.conditionType === "tasks" && goal.metricCategory) return `${label} / ${goal.metricCategory}`;
  return label;
}

function formatTopicSuffix(topic) {
  return topic ? ` / ${topic}` : "";
}

function formatPriorityLabel(category) {
  const labels = {
    Main: "★★★",
    Sub: "★★",
    Tiny: "★",
  };
  return labels[category] || category;
}

function formatDateShort(dateKey) {
  const date = parseDateKey(dateKey);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getGoalImage(goal) {
  if (goal.completed) return "fiikun_king.png";
  const images = {
    "ダンス": "fiikun_cheer.png",
    "勉強": "fiikun_think.png",
    "からだ": "fiikun_strawberry.png",
    "暮らし": "fiikun_letter.png",
  };
  return images[goal.category] || "fiikun_stand.png";
}

function getGoalComment(goal, percent) {
  if (goal.completed || percent >= 100) return `${getDisplayNickname()}、やったね。ぼく、すっごく誇らしいの。ぎゅっ✨`;
  if (percent >= 70) return `あと少しだよ。${getDisplayNickname()}なら届くって、ぼく知ってるの🍓`;
  if (percent >= 35) return `いい感じに近づいてるよ。ぼく、ちゃんと横で見てるからね。`;
  return `${getDisplayNickname()}の理由、ここに置いておこ。小さく進めば大丈夫だよ🐰`;
}

function updateGoalProgress(id, value) {
  if (!Number.isFinite(value) || value < 0) return;
  goals = goals.map((goal) => {
    if (goal.id !== id) return goal;
    const currentValue = Math.min(9999, value);
    const completed = currentValue >= goal.targetValue || goal.completed;
    return {
      ...goal,
      currentValue,
      completed,
      completedAt: completed ? (goal.completedAt || new Date().toISOString()) : null,
    };
  });
  saveGoals();
  render();
}

function completeGoal(id) {
  goals = goals.map((goal) => goal.id === id ? {
    ...goal,
    completed: true,
    currentValue: Math.max(goal.currentValue, goal.targetValue),
    completedAt: goal.completedAt || new Date().toISOString(),
  } : goal);
  saveGoals();
  render();
}

function editGoal(id) {
  const goal = goals.find((item) => item.id === id);
  if (!goal) return;
  goalIdInput.value = goal.id;
  goalTitleInput.value = goal.title;
  goalCategoryInput.value = goal.category;
  goalDeadlineInput.value = goal.deadline;
  goalConditionTypeInput.value = goal.conditionType;
  goalMetricCategoryInput.value = goal.metricCategory || "";
  goalCurrentValueInput.value = getGoalCurrentValue(goal);
  goalTargetValueInput.value = goal.targetValue;
  goalRewardInput.value = goal.rewardId;
  goalNoteInput.value = goal.note;
  goalSubmit.textContent = "更新";
  goalCancel.hidden = false;
  setView("goals");
  goalTitleInput.focus();
}

function deleteGoal(id) {
  goals = goals.filter((goal) => goal.id !== id);
  saveGoals();
  resetGoalForm();
  render();
}

function resetGoalForm() {
  goalForm.reset();
  goalIdInput.value = "";
  goalTargetValueInput.value = 10;
  goalCurrentValueInput.value = 0;
  goalMetricCategoryInput.value = "";
  goalSubmit.textContent = "保存";
  goalCancel.hidden = true;
  updateGoalRewardOptions();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function renderNameSettings() {
  userDisplayNameInput.value = getDisplayName();
}

function renderNotificationSettings() {
  notificationEnabledInput.checked = notificationSettings.notificationEnabled;
  morningNotificationEnabledInput.checked = notificationSettings.morningNotificationEnabled;
  nightNotificationEnabledInput.checked = notificationSettings.nightNotificationEnabled;
  unopenedNotificationEnabledInput.checked = notificationSettings.unopenedNotificationEnabled;
  morningNotificationTimeInput.value = notificationSettings.morningNotificationTime;
  nightNotificationTimeInput.value = notificationSettings.nightNotificationTime;
  notificationFrequencyInput.value = notificationSettings.notificationFrequency;

  notificationStatus.textContent = getNotificationStatusText();
  notificationHistoryList.innerHTML = "";
  const recentHistory = notificationSettings.notificationHistory.slice(0, 5);

  if (recentHistory.length === 0) {
    notificationHistoryList.appendChild(createEmptyState("通知が届くと、ここに履歴が残ります。", "fiikun_letter.png"));
    return;
  }

  recentHistory.forEach((item) => {
    const row = document.createElement("article");
    row.className = "notification-history-item";
    row.innerHTML = `
      <img src="./assets/letter.png" alt="" />
      <div>
        <strong></strong>
        <p></p>
      </div>
    `;
    row.querySelector("strong").textContent = item.title;
    row.querySelector("p").textContent = `${item.body} / ${formatDateTime(item.createdAt)}`;
    notificationHistoryList.appendChild(row);
  });
}

function getNotificationStatusText() {
  if (!("Notification" in window)) return "このブラウザでは通知が使えません。";
  if (Notification.permission === "granted") return "通知OK。ふぃーくん、呼びに行けるよ🍓";
  if (Notification.permission === "denied") return "通知がオフです。iPhoneの設定から許可してね。";
  return "ボタンを押すと、通知の許可を確認します。";
}

async function requestFiikunNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

async function registerPwaServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!/^https?:$/.test(window.location.protocol)) return;

  try {
    const registration = await navigator.serviceWorker.register("./service-worker.js");
    await registration.update();
  } catch {
    // file://や一部のプレビュー環境では登録できないため、静かに通常表示へ戻します。
  }
}

function initializeNotificationState() {
  const todayKey = toDateKey(new Date());
  const previousOpenedDate = notificationSettings.lastOpenedDate;
  const missedDays = previousOpenedDate ? Math.max(0, getDateDiffDays(previousOpenedDate, todayKey) - 1) : 0;
  notificationSettings.unopenedDays = missedDays;
  notificationSettings.lastOpenedDate = todayKey;
  saveNotificationSettings();

  if (missedDays > 0 && notificationSettings.unopenedNotificationEnabled) {
    notifyFiikun(
      "missed_login",
      "ふぃーくん、待ってたよ",
      getMissedLoginMessage(missedDays),
      { dedupeKey: `missed_login:${todayKey}:${missedDays}` },
    );
  }
}

function startNotificationScheduler() {
  checkScheduledNotifications();
  if (notificationCheckInterval) window.clearInterval(notificationCheckInterval);
  notificationCheckInterval = window.setInterval(checkScheduledNotifications, 30000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkScheduledNotifications();
  });
}

function checkScheduledNotifications() {
  if (!canUseFiikunNotifications()) return;
  if (!isNotificationFrequencyActive(new Date())) return;

  const now = new Date();
  const todayKey = toDateKey(now);

  if (notificationSettings.morningNotificationEnabled && isTimeReached(notificationSettings.morningNotificationTime, now)) {
    notifyFiikun(
      "morning_reminder",
      "おはようのお知らせ",
      `${getDisplayNickname()}、おはよ。ぼく待ってたよ🍓`,
      { dedupeKey: `morning_reminder:${todayKey}` },
    );
  }

  if (notificationSettings.nightNotificationEnabled && isTimeReached(notificationSettings.nightNotificationTime, now)) {
    notifyFiikun(
      "night_reminder",
      "夜のお知らせ",
      `${getDisplayNickname()}、今日もここにいるよ。ちょっとだけ会いに来てくれる？`,
      { dedupeKey: `night_reminder:${todayKey}` },
    );
  }
}

function canUseFiikunNotifications() {
  return (
    notificationSettings.notificationEnabled &&
    "Notification" in window &&
    Notification.permission === "granted"
  );
}

function isNotificationFrequencyActive(date) {
  const day = date.getDay();
  if (notificationSettings.notificationFrequency === "weekday") return day >= 1 && day <= 5;
  if (notificationSettings.notificationFrequency === "weekend") return day === 0 || day === 6;
  return true;
}

function isTimeReached(timeValue, date) {
  const [hours, minutes] = String(timeValue || "00:00").split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return false;
  const target = new Date(date);
  target.setHours(hours, minutes, 0, 0);
  return date >= target;
}

function getDateDiffDays(fromDateKey, toDateKeyValue) {
  const from = parseDateKey(fromDateKey);
  const to = parseDateKey(toDateKeyValue);
  return Math.round((to - from) / 86400000);
}

function getMissedLoginMessage(days) {
  if (days >= 3) return `${getDisplayNickname()}、3日も会えなかったよ？……ぷん！でも戻ってきてくれて、ぼくうれしいの。`;
  if (days === 2) return `${getDisplayNickname()}、2日ぶりだね。ぼく、ちょっと寂しかったけど、また一緒にいこ。`;
  return `${getDisplayNickname()}、昨日来なかったでしょ。ぷん！でも今日は会えたから、許してあげる。`;
}

async function notifyFiikun(type, title, body, options = {}) {
  if (!canUseFiikunNotifications()) return false;

  const dedupeKey = options.dedupeKey || `${type}:${toDateKey(new Date())}`;
  if (hasNotificationHistory(dedupeKey)) return false;

  const notificationOptions = {
    body,
    icon: "./assets/fiikun_princess_favicon.png",
    badge: "./assets/fiikun_princess_apple_touch.png",
    tag: dedupeKey,
    data: {
      type,
      url: "./",
    },
  };

  try {
    if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, notificationOptions);
    } else {
      new Notification(title, notificationOptions);
    }
    addNotificationHistory(type, title, body, dedupeKey);
    renderNotificationSettings();
    return true;
  } catch {
    return false;
  }
}

function hasNotificationHistory(dedupeKey) {
  return notificationSettings.notificationHistory.some((item) => item.dedupeKey === dedupeKey);
}

function addNotificationHistory(type, title, body, dedupeKey) {
  notificationSettings.notificationHistory = [
    {
      id: crypto.randomUUID(),
      type,
      title,
      body,
      dedupeKey,
      createdAt: new Date().toISOString(),
    },
    ...notificationSettings.notificationHistory,
  ].slice(0, 30);
  saveNotificationSettings();
}

function formatDateTime(value) {
  const date = new Date(value);
  return date.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderTemplates() {
  templateList.innerHTML = "";

  taskTemplates.forEach((template) => {
    const item = document.createElement("article");
    item.className = "template-card";
    item.innerHTML = `
      <img src="./assets/${template.icon}" alt="" />
      <div>
        <h3></h3>
        <p>${formatTemplateSchedule(template)}</p>
      </div>
      <div class="template-actions">
        <button class="exchange-button" type="button" data-action="add">今日に追加</button>
        <button class="exchange-button" type="button" data-action="delete">削除</button>
      </div>
    `;
    item.querySelector("h3").textContent = template.title;
    item.querySelector('[data-action="add"]').addEventListener("click", () => addTaskFromTemplate(template.id));
    item.querySelector('[data-action="delete"]').addEventListener("click", () => deleteTaskTemplate(template.id));
    templateList.appendChild(item);
  });
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

  if (notificationSettings.unopenedDays >= 2) {
    return { image: "fiikun_angry.png", alt: "ぷんとしているふぃーくん" };
  }
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

  letters.filter((letter) => letter.unlockCondition).forEach((letter) => {
    const status = letter.locked
      ? createLockStatus("lock_closed.png", "未解放")
      : createLockStatus("lock_open.png", "開封可");
    const item = document.createElement("article");
    item.className = `letter-unlock-card ${letter.locked ? "locked" : ""}`;
    item.innerHTML = `
      <img src="./assets/letter.png" alt="" />
      <div>
        <h3></h3>
        <p>${letter.locked ? formatUnlockCondition(letter.unlockCondition) : personalizeFiikunMessage(letter.message || letter.body)}</p>
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

function addRestRecord(type, label) {
  const todayKey = toDateKey(new Date());
  restRecords = restRecords.filter((record) => !(toDateKey(record.createdAt) === todayKey && record.type === type));
  restRecords.push({
    id: crypto.randomUUID(),
    type,
    label,
    createdAt: new Date().toISOString(),
  });
  saveRestRecords();
  restSaveNote.hidden = false;
  window.setTimeout(() => {
    restSaveNote.hidden = true;
  }, 1800);
  render();
}

function addTaskFromTemplate(id) {
  const template = taskTemplates.find((item) => item.id === id);
  if (!template) return;
  tasks.unshift(createTask(template.title, template.category, template.icon, template.topic));
  saveTasks();
  render();
}

function deleteTaskTemplate(id) {
  taskTemplates = taskTemplates.filter((template) => template.id !== id);
  saveTaskTemplates();
  renderTemplates();
  renderHomeRecommendations();
}

function getActiveTemplatesForDate(date) {
  return taskTemplates.filter((template) => isTemplateActiveOnDate(template, date));
}

function isTemplateActiveOnDate(template, date) {
  const dateKey = toDateKey(date);
  if (template.startDate && dateKey < template.startDate) return false;
  if (template.endDate && dateKey > template.endDate) return false;

  const day = date.getDay();
  if (template.repeat === "weekday") return day >= 1 && day <= 5;
  if (template.repeat === "weekend") return day === 0 || day === 6;
  if (template.repeat === "weekly") return String(day) === String(template.weekday);
  return true;
}

function formatTemplateSchedule(template) {
  const repeatLabels = {
    daily: "毎日",
    weekday: "平日",
    weekend: "週末",
    weekly: `${["日", "月", "火", "水", "木", "金", "土"][Number(template.weekday || 1)]}曜`,
    custom: "期間だけ",
  };
  const range = [template.startDate, template.endDate].filter(Boolean).join("〜");
  return `${formatPriorityLabel(template.category)}${formatTopicSuffix(template.topic)} / ${repeatLabels[template.repeat] || "毎日"}${range ? ` / ${range}` : ""}`;
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
  notifyFiikun(
    "reward_exchanged",
    "ごほうび交換したよ",
    `${reward.title}、交換できたよ！ぼくも一緒に喜んでいい？えへへ✨`,
    { dedupeKey: `reward_exchanged:${reward.id}` },
  );
  renderRewards();
}

function prepareRewardAnimation() {
  rewardAnimation.dataset.ready = "true";
}

function startTimer() {
  timerRunning = true;
  showFocusMode();
  renderTimer();
  timerInterval = window.setInterval(() => {
    remainingSeconds -= 1;
    focusElapsedSeconds += 1;
    updateFocusStrawberries();
    if (remainingSeconds <= 0) {
      addPomodoroRecord(timerMinutes, "自動で記録");
      notifyPomodoroFinished(timerMinutes);
      pauseTimer();
      remainingSeconds = timerMinutes * 60;
      resetFocusMode();
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

function showFocusMode() {
  focusOverlay.hidden = false;
  document.body.classList.add("focus-mode-active");
}

function hideFocusMode() {
  focusOverlay.hidden = true;
  document.body.classList.remove("focus-mode-active");
}

function resetFocusMode() {
  focusElapsedSeconds = 0;
  focusStrawberryCount = 0;
  focusSky.innerHTML = "";
  focusBasket.innerHTML = "";
  hideFocusMode();
}

function updateFocusStrawberries() {
  const nextCount = Math.floor(focusElapsedSeconds / 30);
  while (focusStrawberryCount < nextCount) {
    focusStrawberryCount += 1;
    dropFocusStrawberry(focusStrawberryCount);
  }
}

function dropFocusStrawberry(count) {
  const berry = document.createElement("img");
  const left = 12 + ((count * 23) % 76);
  berry.src = "./assets/strawberry.png";
  berry.alt = "";
  berry.className = "focus-falling-strawberry";
  berry.style.left = `${left}%`;
  berry.style.animationDuration = `${1.7 + (count % 4) * 0.12}s`;
  focusSky.appendChild(berry);

  window.setTimeout(() => {
    berry.remove();
    addFocusBasketStrawberry(count);
  }, 1800);
}

function addFocusBasketStrawberry(count) {
  const berry = document.createElement("img");
  const row = Math.floor((count - 1) / 9);
  const left = 4 + Math.random() * 88;
  const bottom = 8 + row * 19 + Math.random() * 14;
  const size = 24 + Math.random() * 14;
  berry.src = "./assets/strawberry.png";
  berry.alt = "";
  berry.className = "focus-stacked-strawberry";
  berry.style.left = `${left}%`;
  berry.style.bottom = `${bottom}px`;
  berry.style.width = `${size}px`;
  berry.style.height = `${size}px`;
  berry.style.transform = `translateX(-50%) rotate(${Math.round(Math.random() * 34 - 17)}deg)`;
  focusBasket.appendChild(berry);
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

function notifyPomodoroFinished(minutes) {
  const isBreak = minutes <= 5;
  notifyFiikun(
    isBreak ? "break_finished" : "focus_finished",
    isBreak ? "休憩おしまいだよ" : "集中できたね",
    isBreak
      ? `${getDisplayNickname()}、休憩おしまい。ぼくもそばにいるから、また少しだけいこ。`
      : `${minutes}分がんばったの？えへへ、ぼく見てたよ。ぎゅっ🍓`,
    { dedupeKey: `${isBreak ? "break_finished" : "focus_finished"}:${Date.now()}` },
  );
}

function updateGardenState() {
  garden.completedTaskCount = tasks.filter((task) => task.pointsAwarded).length;
  garden.stage = Math.min(garden.maxStage, Math.max(1, garden.completedTaskCount + 1));
  saveGarden();
}

function unlockLetters() {
  const newlyUnlocked = [];
  letters = letters.map((letter) => {
    if (letter.locked && isLetterUnlocked(letter)) {
      newlyUnlocked.push(letter);
      return { ...letter, locked: false };
    }
    if (isLetterUnlocked(letter)) return { ...letter, locked: false };
    return letter;
  });
  saveLetters();

  newlyUnlocked.forEach((letter) => {
    notifyFiikun(
      "reward_unlocked",
      "ごほうびが開いたよ",
      `ごほうび開いたよ！${getDisplayNickname()}、ぼくも一緒に喜んでいい？`,
      { dedupeKey: `reward_unlocked:${letter.id}` },
    );
  });
}

function isLetterUnlocked(letter) {
  const unlockChecks = {
    "garden.stage >= 2": () => garden.stage >= 2,
    "garden.stage >= 3": () => garden.stage >= 3,
    "garden.stage >= 4": () => garden.stage >= 4,
    "garden.stage >= 5": () => garden.stage >= 5,
    "garden.stage >= 6": () => garden.stage >= 6,
    "garden.stage >= 7": () => garden.stage >= 7,
    "garden.stage >= 8": () => garden.stage >= 8,
    "completedTaskCount >= 10": () => garden.completedTaskCount >= 10,
    "pomodoroCount >= 5": () => pomodoroRecords.length >= 5,
    "strawberryPoints >= 30": () => strawberryPoints >= 30,
  };

  return Boolean(unlockChecks[letter.unlockCondition]?.());
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
    notifyFiikun(
      "letter_arrived",
      "おてがみが届いたよ",
      "ふぃーくんからおてがみが届いたよ💌",
      { dedupeKey: `letter_arrived:${todayKey}` },
    );
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

function getTodayRestRecords() {
  return restRecords.filter((record) => isToday(record.createdAt));
}

function getAchievementForDate(dateKey) {
  const tasksOnDate = tasks.filter((task) => task.completedAt && toDateKey(task.completedAt) === dateKey);
  const hasMain = tasksOnDate.some((task) => task.category === "Main");
  const hasSub = tasksOnDate.some((task) => task.category === "Sub");
  const hasTiny = tasksOnDate.some((task) => task.category === "Tiny");
  const hasPomodoro = pomodoroRecords.some((record) => toDateKey(record.completedAt) === dateKey);
  const restOnDate = restRecords.filter((record) => toDateKey(record.createdAt) === dateKey);
  const hasTinyDay = restOnDate.some((record) => record.type === "tiny");
  const hasRestDay = restOnDate.some((record) => record.type === "rest");
  const hasAnyTask = tasksOnDate.length > 0;
  const hasDance = tasksOnDate.some((task) => /ダンス|dance|踊|発表会/i.test(task.title) || task.icon === "heart.png");
  const hasMeal = tasksOnDate.some((task) => /食|ごはん|水|体重|ダイエット|diet|meal/i.test(task.title) || task.icon === "cup.png");
  const hasStudy = tasksOnDate.some((task) => /勉強|学習|読書|ノート|TOEIC|英語|study|book/i.test(task.title) || ["book.png", "pencil.png"].includes(task.icon));
  const isFirstTaskDone =
    hasAnyTask && tasks.filter((task) => task.completedAt && toDateKey(task.completedAt) <= dateKey).length === tasksOnDate.length;
  const streakCount = getConsecutiveRecordDays(dateKey);
  const allTasksDoneOnDate =
    tasks.length > 0 && tasks.every((task) => task.completedAt && toDateKey(task.completedAt) === dateKey);

  if (allTasksDoneOnDate && hasPomodoro) return { type: "gift", icon: "gift.png" };
  if (streakCount >= 7) return { type: "streak_7", icon: "crown.png" };
  if (streakCount >= 3) return { type: "streak_3", icon: "flower.png" };
  if (isFirstTaskDone) return { type: "first_task", icon: "strawberry.png" };
  if (hasDance) return { type: "dance", icon: "heart.png" };
  if (hasMeal) return { type: "meal", icon: "cup.png" };
  if (hasStudy) return { type: "study", icon: "book.png" };
  if (hasPomodoro) return { type: "clock", icon: "clock.png" };
  if (hasMain) return { type: "strawberry", icon: "strawberry.png" };
  if (hasSub) return { type: "flower", icon: "flower.png" };
  if (hasTiny || hasTinyDay) return { type: "flower", icon: "flower.png" };
  if (hasRestDay) return { type: "rest", icon: "fiikun_sleep.png" };
  return { type: "none", icon: "" };
}

function getConsecutiveRecordDays(dateKey) {
  let count = 0;
  const date = parseDateKey(dateKey);

  while (true) {
    const currentKey = toDateKey(date);
    const hasTask = tasks.some((task) => task.completedAt && toDateKey(task.completedAt) === currentKey);
    const hasPomodoro = pomodoroRecords.some((record) => toDateKey(record.completedAt) === currentKey);
    const hasRest = restRecords.some((record) => toDateKey(record.createdAt) === currentKey);
    if (!hasTask && !hasPomodoro && !hasRest) return count;
    count += 1;
    date.setDate(date.getDate() - 1);
  }
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
saveRestRecords();
saveRewards();
saveLetters();
saveAchievements();
saveFiikun();
saveStrawberryPoints();
saveDailyLetterNotice();
saveTaskTemplates();
saveGoals();
saveNotificationSettings();
registerPwaServiceWorker();
initializeNotificationState();
startNotificationScheduler();
render();
