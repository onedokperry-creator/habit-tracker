import { deleteRemoteTask, fetchRemoteTasks, getSessionUser, hasSupabaseConfig, onAuthChange, signInWithEmail, signUpWithEmail, upsertRemoteTask } from "./supabase-client.js";

const STORAGE_KEY = "fiikun-tasks-v1";

const starterTasks = [
  {
    id: crypto.randomUUID(),
    title: "朝のストレッチ 5分",
    category: "Tiny",
    icon: "flower.png",
    done: false,
  },
  {
    id: crypto.randomUUID(),
    title: "ベリーダンス基礎練習 20分",
    category: "Main",
    icon: "heart.png",
    done: false,
  },
  {
    id: crypto.randomUUID(),
    title: "読書ノート 1ページ",
    category: "Sub",
    icon: "book.png",
    done: true,
  },
];

let tasks = loadTasks();
let activeFilter = "all";
let currentUser = null;
let isRemoteReady = false;

const views = {
  home: document.querySelector("#home-view"),
  tasks: document.querySelector("#tasks-view"),
};

const taskList = document.querySelector("#task-list");
const homeTaskList = document.querySelector("#home-task-list");
const taskForm = document.querySelector("#task-form");
const taskTitle = document.querySelector("#task-title");
const taskCategory = document.querySelector("#task-category");
const taskIcon = document.querySelector("#task-icon");
const strawberryField = document.querySelector("#strawberry-field");
const progressLabel = document.querySelector("#progress-label");
const fieldMessage = document.querySelector("#field-message");
const taskCount = document.querySelector("#task-count");
const encourageText = document.querySelector("#encourage-text");
const appShell = document.querySelector("#app-shell");
const authScreen = document.querySelector("#auth-screen");
const authForm = document.querySelector("#auth-form");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authMessage = document.querySelector("#auth-message");
const signupButton = document.querySelector("#signup-button");
const syncStatus = document.querySelector("#sync-status");

document.querySelectorAll(".nav-tab").forEach((button) => {
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

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = taskTitle.value.trim();
  if (!title) return;

  const task = {
    id: crypto.randomUUID(),
    title,
    category: taskCategory.value,
    icon: taskIcon.value,
    done: false,
    completedAt: null,
    remoteId: null,
  };

  tasks.unshift(task);
  taskForm.reset();
  saveTasks();
  render();
  taskTitle.focus();
  await syncTask(task);
});

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return starterTasks;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : starterTasks;
  } catch {
    return starterTasks;
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function normalizeLocalTask(task) {
  return {
    ...task,
    completedAt: task.completedAt || (task.done ? new Date().toISOString() : null),
    remoteId: task.remoteId || task.supabaseId || null,
  };
}

function setSyncStatus(message) {
  if (syncStatus) syncStatus.textContent = message;
}

function setAuthMessage(message) {
  if (authMessage) authMessage.textContent = message;
}

function showApp() {
  authScreen?.classList.add("hidden");
  appShell?.classList.remove("hidden");
}

function showAuth() {
  appShell?.classList.add("hidden");
  authScreen?.classList.remove("hidden");
}

function setView(name) {
  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle("active", key === name);
  });

  document.querySelectorAll(".nav-tab").forEach((button) => {
    const isActive = button.dataset.view === name;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function render() {
  renderTasks();
  renderHome();
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
  const plots = Math.max(total, 5);

  progressLabel.textContent = `${done} / ${total}`;
  fieldMessage.textContent =
    total === 0
      ? "タスクを追加して、いちご畑を育てよう。"
      : done === total
        ? "今日の畑は満開。ふぃーくんもにこにこです。"
        : `あと${total - done}つで、今日のいちごが全部育ちます。`;

  encourageText.textContent =
    done === 0
      ? "まずはひとつ。ゆっくりでだいじょうぶ。"
      : done === total
        ? "全部できたね。今日のあなた、とてもすてきです。"
        : "いい調子。小さな一歩がちゃんと積み重なっているよ。";

  strawberryField.innerHTML = "";
  for (let index = 0; index < plots; index += 1) {
    const plot = document.createElement("div");
    plot.className = `berry-plot ${index < done ? "done" : ""}`;
    plot.innerHTML = `<img src="./assets/${index < done ? "strawberry.png" : "plant.png"}" alt="" />`;
    strawberryField.appendChild(plot);
  }

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

function createEmptyState(message, image) {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.innerHTML = `
    <img src="./assets/${image}" alt="" />
    <p>${message}</p>
  `;
  return empty;
}

async function toggleTask(id) {
  let changedTask = null;
  tasks = tasks.map((task) => {
    if (task.id !== id) return task;
    const done = !task.done;
    changedTask = { ...task, done, completedAt: done ? new Date().toISOString() : null };
    return changedTask;
  });
  saveTasks();
  render();
  if (changedTask) await syncTask(changedTask);
}

async function deleteTask(id) {
  const task = tasks.find((item) => item.id === id);
  tasks = tasks.filter((item) => item.id !== id);
  saveTasks();
  render();

  if (task?.remoteId && currentUser) {
    try {
      await deleteRemoteTask({ userId: currentUser.id, taskId: task.remoteId });
      setSyncStatus("Synced with Bloom OS");
    } catch (error) {
      setSyncStatus(`Sync error: ${error.message}`);
    }
  }
}

async function syncTask(task) {
  if (!isRemoteReady || !currentUser) return;

  try {
    setSyncStatus("Syncing...");
    const saved = await upsertRemoteTask({ userId: currentUser.id, task: normalizeLocalTask(task) });
    tasks = tasks.map((item) => (item.id === task.id ? { ...item, remoteId: saved.id } : item));
    saveTasks();
    setSyncStatus("Synced with Bloom OS");
  } catch (error) {
    setSyncStatus(`Sync error: ${error.message}`);
  }
}

function mergeRemoteTasks(remoteTasks) {
  const byRemoteId = new Map(tasks.filter((task) => task.remoteId).map((task) => [task.remoteId, task]));
  const mergedRemote = remoteTasks.map((remoteTask) => {
    const existing = byRemoteId.get(remoteTask.remoteId);
    return existing ? { ...existing, ...remoteTask } : remoteTask;
  });
  const remoteIds = new Set(mergedRemote.map((task) => task.remoteId));
  const localOnly = tasks.filter((task) => !task.remoteId || !remoteIds.has(task.remoteId));
  tasks = [...mergedRemote, ...localOnly].map(normalizeLocalTask);
  saveTasks();
  render();
}

async function loadRemoteTasks() {
  if (!currentUser) return;

  try {
    setSyncStatus("Loading Bloom OS tasks...");
    const remoteTasks = await fetchRemoteTasks({ userId: currentUser.id });
    mergeRemoteTasks(remoteTasks);
    setSyncStatus("Synced with Bloom OS");
  } catch (error) {
    setSyncStatus(`Sync error: ${error.message}`);
  }
}

async function startAuthenticated(user) {
  currentUser = user;
  isRemoteReady = true;
  showApp();
  setSyncStatus(user.email ? `Bloom sync: ${user.email}` : "Bloom sync enabled");
  await loadRemoteTasks();
}

async function initializeAuth() {
  tasks = tasks.map(normalizeLocalTask);

  if (!hasSupabaseConfig) {
    showApp();
    setSyncStatus("Local mode: Supabase env missing");
    render();
    return;
  }

  authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      setAuthMessage("Logging in...");
      const user = await signInWithEmail({ email: authEmail.value.trim(), password: authPassword.value });
      setAuthMessage("");
      await startAuthenticated(user);
    } catch (error) {
      setAuthMessage(error.message);
    }
  });

  signupButton?.addEventListener("click", async () => {
    try {
      setAuthMessage("Creating account...");
      const user = await signUpWithEmail({ email: authEmail.value.trim(), password: authPassword.value });
      setAuthMessage(user ? "Account created." : "Please check your confirmation email.");
      if (user) await startAuthenticated(user);
    } catch (error) {
      setAuthMessage(error.message);
    }
  });

  onAuthChange(async (user) => {
    if (user && user.id !== currentUser?.id) await startAuthenticated(user);
    if (!user) {
      currentUser = null;
      isRemoteReady = false;
      showAuth();
      setSyncStatus("Signed out");
    }
  });

  const user = await getSessionUser();
  if (user) {
    await startAuthenticated(user);
  } else {
    showAuth();
  }

  render();
}

initializeAuth();

