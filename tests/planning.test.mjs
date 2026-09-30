import test from "node:test";
import assert from "node:assert/strict";
import {
  getPersonUtilization,
  monthRange,
  monthsBetween,
  overlapDays,
  filteredProjects,
} from "../src/domain/planning.ts";
import { validateProject } from "../src/domain/validation.ts";
import { createSeedData } from "../src/services/seed.ts";

function fixture(periods) {
  const data = createSeedData();
  data.allocations = periods.map((p, i) => ({
    id: String(i),
    project_person_id: data.project_people[0].id,
    ...p,
  }));
  return data;
}
test("inclusive overlap handles boundaries, leap years, and no overlap", () => {
  assert.equal(
    overlapDays("2026-10-31", "2026-11-01", "2026-10-01", "2026-10-31"),
    1,
  );
  assert.equal(
    overlapDays("2026-11-01", "2026-11-30", "2026-10-01", "2026-10-31"),
    0,
  );
  assert.equal(monthRange("2028-02").end, "2028-02-29");
  assert.deepEqual(monthsBetween("2026-12", "2027-02"), [
    "2026-12",
    "2027-01",
    "2027-02",
  ]);
  assert.deepEqual(monthsBetween("2027-02", "2026-12"), []);
});
test("partial months are weighted by calendar days, not rounded periods", () => {
  const data = fixture([
    { start_date: "2026-11-01", end_date: "2026-11-15", percentage: 40 },
  ]);
  const result = getPersonUtilization(
    data,
    data.people[0].id,
    "2026-11-01",
    "2026-11-30",
  );
  assert.equal(result.totalPercentage, 20);
  assert.equal(result.peakPercentage, 40);
});
test("concurrent assignments exceed 100 and drill-down sums to the total", () => {
  const data = createSeedData();
  const result = getPersonUtilization(
    data,
    data.people[0].id,
    "2026-11-01",
    "2026-11-30",
  );
  assert.equal(result.totalPercentage, 110);
  assert.equal(result.overAllocatedBy, 10);
  assert.equal(result.allocations.length, 4);
  assert.equal(result.peakPercentage, 110);
  assert.equal(
    result.allocations.reduce((n, a) => n + a.percentage, 0),
    result.totalPercentage,
  );
});
test("short peaks are exposed and adjacent periods do not double-count", () => {
  const data = fixture([
    { start_date: "2026-11-01", end_date: "2026-11-15", percentage: 120 },
    { start_date: "2026-11-16", end_date: "2026-11-30", percentage: 40 },
  ]);
  const result = getPersonUtilization(
    data,
    data.people[0].id,
    "2026-11-01",
    "2026-11-30",
  );
  assert.equal(result.totalPercentage, 80);
  assert.equal(result.peakPercentage, 120);
});
test("arbitrary ranges, archived projects and unallocated resources", () => {
  const data = fixture([
    { start_date: "2026-10-01", end_date: "2026-12-31", percentage: 120 },
  ]);
  assert.equal(
    getPersonUtilization(data, data.people[0].id, "2026-10-14", "2026-11-07")
      .totalPercentage,
    120,
  );
  data.projects[0].archived = true;
  assert.equal(
    getPersonUtilization(data, data.people[0].id, "2026-10-01", "2026-10-31")
      .totalPercentage,
    0,
  );
  assert.equal(
    getPersonUtilization(data, data.people[11].id, "2026-10-01", "2026-10-31")
      .totalPercentage,
    0,
  );
});
test("filters restrict contributions to the selected project dimensions", () => {
  const data = createSeedData();
  const p = data.projects[0];
  const property = data.properties[0];
  const projects = filteredProjects(data, {
    person: data.people[0].id,
    ao: property.business_area_id,
    fo: property.management_area_id,
    property: property.id,
    type: p.project_type_id,
    status: p.status_id,
  });
  assert.deepEqual(
    projects.map((p) => p.id),
    [p.id],
  );
  assert.equal(
    getPersonUtilization(
      data,
      data.people[0].id,
      "2026-11-01",
      "2026-11-30",
      projects,
    ).totalPercentage,
    40,
  );
});
test("project validation rejects invalid ranges, percentages and duplicate resources", () => {
  const data = createSeedData();
  const project = data.projects[0];
  const people = data.project_people.filter((p) => p.project_id === project.id);
  const draft = {
    project,
    people,
    allocations: data.allocations.filter((a) =>
      people.some((p) => p.id === a.project_person_id),
    ),
    levelIds: [],
  };
  assert.equal(validateProject(draft, data), null);
  draft.allocations[0].percentage = 150;
  assert.equal(validateProject(draft, data), null);
  draft.allocations[0].percentage = NaN;
  assert.match(validateProject(draft, data), /200/);
  draft.allocations[0].percentage = 40;
  draft.allocations[0].start_date = "2026-02-30";
  assert.match(validateProject(draft, data), /giltig period/);
  draft.allocations[0].start_date = "2028-01-01";
  assert.match(validateProject(draft, data), /giltig period/);
  draft.allocations[0].start_date = "2026-10-01";
  draft.people.push({ ...people[0], id: "duplicate" });
  assert.match(validateProject(draft, data), /en gång/);
});
