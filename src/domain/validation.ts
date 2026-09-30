import type { AppData, ProjectDraft } from "./types";
import { validDate } from "./planning.ts";

export function validateProject(
  draft: ProjectDraft,
  data: AppData,
): string | null {
  const p = draft.project;
  if (!p.name.trim() || !p.project_number.trim())
    return "Ange projektnamn och projektnummer.";
  if (
    data.projects.some(
      (other) =>
        other.id !== p.id &&
        other.project_number.toLowerCase() ===
          p.project_number.trim().toLowerCase(),
    )
  )
    return "Projektnumret används redan.";
  if (!data.properties.some((v) => v.id === p.property_id))
    return "Välj en fastighet.";
  if (
    !data.project_statuses.some((v) => v.id === p.status_id) ||
    !data.project_types.some((v) => v.id === p.project_type_id)
  )
    return "Välj status och projekttyp.";
  if (
    draft.levelIds.some((id) => !data.project_levels.some((v) => v.id === id))
  )
    return "Välj giltiga projektnivåer.";
  if (
    !draft.people.length ||
    !draft.people.some((v) => v.role === "project_manager")
  )
    return "Välj minst en intern projektledare.";
  if (
    new Set(draft.people.map((v) => v.person_id)).size !== draft.people.length
  )
    return "En person kan bara tilldelas en gång per projekt.";
  if (
    draft.people.some(
      (v) =>
        !data.people.some(
          (person) =>
            person.id === v.person_id &&
            (v.role !== "project_manager" || person.type === "internal"),
        ),
    )
  )
    return "Välj giltiga resurser.";
  if (!draft.allocations.length) return "Lägg till minst en planeringsperiod.";
  for (const a of draft.allocations) {
    if (!draft.people.some((v) => v.id === a.project_person_id))
      return "Välj en resurs för varje period.";
    if (
      !validDate(a.start_date) ||
      !validDate(a.end_date) ||
      a.start_date > a.end_date
    )
      return "Välj en giltig period där slutdatum är efter startdatum.";
    if (
      !Number.isFinite(a.percentage) ||
      a.percentage < 0 ||
      a.percentage > 200
    )
      return "Belastningen måste vara mellan 0 och 200 %.";
  }
  return null;
}
