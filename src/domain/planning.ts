import type { Allocation, AppData, PlanningFilters, Project } from "./types";

const DAY = 86_400_000;
export function dayNumber(value: string): number {
  return Date.parse(`${value}T00:00:00Z`) / DAY;
}
export function validDate(value: string): boolean {
  const time = dayNumber(value);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(time) &&
    new Date(time * DAY).toISOString().slice(0, 10) === value
  );
}
export function overlapDays(
  start: string,
  end: string,
  from: string,
  to: string,
): number {
  return Math.max(
    0,
    Math.min(dayNumber(end), dayNumber(to)) -
      Math.max(dayNumber(start), dayNumber(from)) +
      1,
  );
}
export function monthRange(month: string) {
  const [year, number] = month.split("-").map(Number);
  return {
    start: `${month}-01`,
    end: new Date(Date.UTC(year, number, 0)).toISOString().slice(0, 10),
  };
}
export function monthsBetween(from: string, to: string): string[] {
  if (!validDate(`${from}-01`) || !validDate(`${to}-01`) || from > to)
    return [];
  const result: string[] = [];
  const date = new Date(`${from}-01T00:00:00Z`);
  while (date.toISOString().slice(0, 7) <= to && result.length < 36) {
    result.push(date.toISOString().slice(0, 7));
    date.setUTCMonth(date.getUTCMonth() + 1);
  }
  return result;
}
export function monthLabel(month: string): string {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString("sv-SE", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
export function percent(value: number): string {
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(value)} %`;
}
export function utilizationTone(value: number): string {
  return value > 100
    ? "over"
    : value >= 90
      ? "near"
      : value >= 50
        ? "normal"
        : "low";
}
export function filteredProjects(
  data: AppData,
  filters: PlanningFilters,
): Project[] {
  return data.projects.filter((project) => {
    const property = data.properties.find((p) => p.id === project.property_id);
    return (
      !project.archived &&
      (!filters.ao || property?.business_area_id === filters.ao) &&
      (!filters.fo || property?.management_area_id === filters.fo) &&
      (!filters.property || project.property_id === filters.property) &&
      (!filters.type || project.project_type_id === filters.type) &&
      (!filters.status || project.status_id === filters.status) &&
      (!filters.person ||
        data.project_people.some(
          (p) => p.project_id === project.id && p.person_id === filters.person,
        ))
    );
  });
}
// Inclusive calendar-day weighted average. A 40% assignment for 15 of 30 days
// contributes 20%. Concurrent periods add together; never clamp overloads.
// Peak is also reported so short conflicts cannot disappear into a monthly mean.
export function getPersonUtilization(
  data: AppData,
  personId: string,
  start: string,
  end: string,
  projects = data.projects.filter((p) => !p.archived),
) {
  const days = overlapDays(start, end, start, end);
  const contributions: {
    allocation: Allocation;
    project: Project;
    percentage: number;
  }[] = [];
  const events = new Map<number, number>();
  for (const allocation of data.allocations) {
    const link = data.project_people.find(
      (p) => p.id === allocation.project_person_id && p.person_id === personId,
    );
    const project = projects.find((p) => p.id === link?.project_id);
    const overlap = overlapDays(
      allocation.start_date,
      allocation.end_date,
      start,
      end,
    );
    if (!project || !overlap || !days) continue;
    contributions.push({
      allocation,
      project,
      percentage: (allocation.percentage * overlap) / days,
    });
    const first = Math.max(dayNumber(start), dayNumber(allocation.start_date));
    const last = Math.min(dayNumber(end), dayNumber(allocation.end_date)) + 1;
    events.set(first, (events.get(first) ?? 0) + allocation.percentage);
    events.set(last, (events.get(last) ?? 0) - allocation.percentage);
  }
  let running = 0,
    peakPercentage = 0;
  for (const [, delta] of [...events].sort(([a], [b]) => a - b)) {
    running += delta;
    peakPercentage = Math.max(peakPercentage, running);
  }
  const totalPercentage = contributions.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );
  return {
    totalPercentage,
    peakPercentage,
    overAllocatedBy: Math.max(0, totalPercentage - 100),
    allocations: contributions,
  };
}
