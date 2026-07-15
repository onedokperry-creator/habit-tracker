import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const env = import.meta.env ?? {};
const runtimeConfig = globalThis.BLOOM_SUPABASE_CONFIG ?? {};

function normalizeSupabaseUrl(value) {
  if (!value) return "";
  try {
    return new URL(String(value).trim()).origin;
  } catch (_error) {
    return String(value).trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  }
}

const supabaseUrl = normalizeSupabaseUrl(
  env.VITE_SUPABASE_URL ?? runtimeConfig.supabaseUrl ?? ""
);
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ?? runtimeConfig.supabaseAnonKey ?? "";

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function getSessionUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user ?? null;
}

export function onAuthChange(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUpWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.session?.user ?? data.user ?? null;
}

function parseTaskMeta(description) {
  if (!description) return {};
  try {
    const value = JSON.parse(description);
    return value && typeof value === "object" ? value : {};
  } catch (_error) {
    return {};
  }
}

function toLocalTask(row) {
  const meta = parseTaskMeta(row.description);
  return {
    id: meta.local_id || row.id,
    remoteId: row.id,
    title: row.title,
    category: meta.category || "Main",
    icon: meta.icon || "pencil.png",
    done: row.status === "done",
    completedAt: row.completed_at || null,
  };
}

function toRemotePayload({ userId, task }) {
  return {
    user_id: userId,
    title: task.title,
    description: JSON.stringify({
      local_id: task.id,
      category: task.category || "Main",
      icon: task.icon || "pencil.png",
    }),
    status: task.done ? "done" : "todo",
    due_date: new Date().toISOString().slice(0, 10),
    completed_at: task.done ? task.completedAt || new Date().toISOString() : null,
    source_app: "task_app",
    updated_at: new Date().toISOString(),
  };
}

export async function fetchRemoteTasks({ userId }) {
  const { data, error } = await supabase
    .from("tasks")
    .select("id,title,description,status,completed_at,created_at,updated_at")
    .eq("user_id", userId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toLocalTask);
}

export async function upsertRemoteTask({ userId, task }) {
  const payload = toRemotePayload({ userId, task });

  if (task.remoteId) {
    const { data, error } = await supabase
      .from("tasks")
      .update(payload)
      .eq("id", task.remoteId)
      .eq("user_id", userId)
      .select("id,title,description,status,completed_at,created_at,updated_at")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select("id,title,description,status,completed_at,created_at,updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRemoteTask({ userId, taskId }) {
  const { error } = await supabase
    .from("tasks")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw error;
}
