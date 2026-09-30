import type {
  AdminTable,
  AppData,
  Classification,
  Person,
  ProjectDraft,
} from "../domain/types";
import { supabase, supabaseConfig } from "../lib/supabase";
import { masterData } from "./master-data";
import { createSeedData } from "./seed";

const DEMO_KEY = "puls-demo-v1";
export const isDemo = !supabase;
function readDemo(): AppData {
  const stored = localStorage.getItem(DEMO_KEY);
  return stored ? (JSON.parse(stored) as AppData) : createSeedData();
}
function writeDemo(data: AppData) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(data));
}
export async function loadData(): Promise<AppData> {
  if (supabaseConfig.status === "invalid")
    throw new Error(
      "Kontrollera Supabase-inställningarna i .env.local. Ange en giltig URL och en publik sb_publishable_-nyckel och starta om appen.",
    );
  if (!supabase) return readDemo();
  const tables = [
    "people",
    "projects",
    "project_people",
    "allocations",
    "project_statuses",
    "project_types",
    "project_levels",
    "project_level_links",
  ] as const;
  const rows = await Promise.all(
    tables.map(async (table) => {
      const { data, error } = await supabase!.from(table).select("*");
      if (error) throw new Error(`Kunde inte läsa ${table}: ${error.message}`);
      return [table, data];
    }),
  );
  const [business_areas, management_areas, properties] = await Promise.all([
    masterData.getBusinessAreas(),
    masterData.getManagementAreas(),
    masterData.getProperties(),
  ]);
  return {
    ...Object.fromEntries(rows),
    business_areas,
    management_areas,
    properties,
  } as AppData;
}
export async function saveProject(draft: ProjectDraft): Promise<void> {
  if (supabase) {
    // One database transaction: project, people, levels and all allocation periods.
    const { error } = await supabase.rpc("save_project", { payload: draft });
    if (error) throw new Error(error.message);
    return;
  }
  const data = readDemo();
  const previous = data.projects.find((p) => p.id === draft.project.id);
  if (previous && previous.updated_at !== draft.project.updated_at)
    throw new Error("Projektet har ändrats. Ladda om och försök igen.");
  const oldLinks = new Set(
    data.project_people
      .filter((p) => p.project_id === draft.project.id)
      .map((p) => p.id),
  );
  data.projects = [
    ...data.projects.filter((p) => p.id !== draft.project.id),
    { ...draft.project, updated_at: new Date().toISOString() },
  ];
  data.project_people = [
    ...data.project_people.filter((p) => p.project_id !== draft.project.id),
    ...draft.people,
  ];
  data.allocations = [
    ...data.allocations.filter((a) => !oldLinks.has(a.project_person_id)),
    ...draft.allocations,
  ];
  data.project_level_links = [
    ...data.project_level_links.filter(
      (p) => p.project_id !== draft.project.id,
    ),
    ...draft.levelIds.map((level_id) => ({
      project_id: draft.project.id,
      level_id,
    })),
  ];
  writeDemo(data);
}
export async function archiveProject(
  id: string,
  archived: boolean,
): Promise<void> {
  if (supabase) {
    const { data, error } = await supabase
      .from("projects")
      .update({ archived })
      .eq("id", id)
      .select("id")
      .single();
    if (error || !data)
      throw new Error(error?.message ?? "Projektet kunde inte uppdateras.");
  } else {
    const data = readDemo();
    data.projects = data.projects.map((p) =>
      p.id === id
        ? { ...p, archived, updated_at: new Date().toISOString() }
        : p,
    );
    writeDemo(data);
  }
}
export async function saveAdminValue(
  table: AdminTable,
  value: Person | Classification,
): Promise<void> {
  if (!value.name.trim()) throw new Error("Ange ett namn.");
  if (supabase) {
    const { error } = await supabase
      .from(table)
      .upsert({ ...value })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
  } else {
    const data = readDemo();
    if (table === "people")
      data.people = [
        ...data.people.filter((v) => v.id !== value.id),
        value as Person,
      ];
    else
      data[table] = [
        ...data[table].filter((v) => v.id !== value.id),
        value as Classification,
      ];
    writeDemo(data);
  }
}
