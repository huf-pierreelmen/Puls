import type { AppData, ProjectPerson } from "../domain/types";

// Deterministic fictional fixtures, shared by the demo and SQL seed generator.
export const seedId = (kind: number, index: number) =>
  `00000000-0000-4000-${String(kind).padStart(4, "0")}-${String(index).padStart(12, "0")}`;
export function createSeedData(): AppData {
  const names = [
    "Jonas Berg",
    "Mikael Lind",
    "Anna Sjöberg",
    "Sara Ek",
    "Erik Holm",
    "Maria Lund",
    "Johan Nyström",
    "Emma Dahl",
    "Anders West",
    "Sofia Strand",
    "Lars Sand",
    "Karin Blom",
    "Elin Norén",
    "David Hall",
    "Lisa Falk",
  ];
  const people = names.map((name, i) => ({
    id: seedId(1, i),
    name,
    active: true,
    type: i < 12 ? ("internal" as const) : ("external" as const),
  }));
  const business_areas = [
    "Stockholm City",
    "Bibliotekstan",
    "Göteborg",
    "NK",
  ].map((name, i) => ({
    id: seedId(2, i),
    name,
    active: true,
    external_id: `TEST-AO-${i + 1}`,
  }));
  const management_areas = [
    "City väst",
    "City öst",
    "Biblioteksgatan",
    "Norrmalmstorg",
    "Nordstan",
    "Inom Vallgraven",
    "NK Stockholm",
    "NK Göteborg",
  ].map((name, i) => ({
    id: seedId(3, i),
    name,
    active: true,
    external_id: `TEST-FO-${i + 1}`,
    business_area_id: business_areas[Math.floor(i / 2)].id,
  }));
  const properties = [
    "Hästen 19",
    "Hästen 20",
    "Hästen 21",
    "Oxhuvudet 18",
    "Vildmannen 7",
    "Packarhuset 4",
    "Pumpstocken 10",
    "Pumpstocken 12",
    "Rännilen 8",
    "Rännilen 11",
    "Skären 9",
    "Träsket 17",
    "Inom Vallgraven 12",
    "Inom Vallgraven 14",
    "Nordstaden 8",
    "Nordstaden 10",
    "Brunnsparken 2",
    "Fredstan 3",
    "NK-huset Stockholm",
    "NK-annexet Stockholm",
    "Entréhuset Stockholm",
    "NK-huset Göteborg",
    "NK-annexet Göteborg",
    "Entréhuset Göteborg",
  ].map((name, i) => ({
    id: seedId(4, i),
    name,
    active: true,
    external_id: `TEST-P-${i + 1}`,
    estate_external_id: null,
    property_number: String(100 + i),
    business_area_id: management_areas[Math.floor(i / 3)].business_area_id,
    management_area_id: management_areas[Math.floor(i / 3)].id,
  }));
  const classified = (kind: number, values: string[]) =>
    values.map((name, i) => ({
      id: seedId(kind, i),
      name,
      active: true,
      sort_order: i,
    }));
  const project_statuses = classified(5, [
    "Planerat",
    "Pågående",
    "Pausat",
    "Avslutat",
  ]);
  const project_types = classified(6, [
    "Hyresgästanpassning",
    "Underhåll",
    "Installation",
    "Utveckling",
  ]);
  const project_levels = classified(7, [
    "Litet",
    "Mellanstort",
    "Stort",
    "Strategiskt",
  ]);
  const projectNames = [
    "HGA UBS",
    "Passage H20/H21",
    "Arctic",
    "KappAhl",
    "Ventilation plan 4",
    "Entré Biblioteksgatan",
    "Kontor Norrmalmstorg",
    "Fasadrenovering",
    "Tak och tätskikt",
    "Nya mötesrum",
    "Belysning butik",
    "Tillgänglig entré",
    "Kontor Fredstan",
    "Butik Nordstan",
    "Byte av kylaggregat",
    "Trapphusrenovering",
    "Energieffektivisering",
    "Lastintag",
    "NK restaurang",
    "Nya personalytor",
    "Sprinkler etapp 2",
    "Hissmodernisering",
    "Skyltprogram",
    "Ombyggnad butik",
  ];
  const projects = projectNames.map((name, i) => ({
    id: seedId(8, i),
    external_id: null,
    project_number: `P-2026-${String(i + 1).padStart(3, "0")}`,
    name,
    property_id: properties[i].id,
    status_id: project_statuses[i % 7 === 0 ? 0 : 1].id,
    project_type_id: project_types[i % 4].id,
    comment:
      i % 3 === 0 ? "Samordna tidplan med hyresgästen inför nästa etapp." : "",
    archived: false,
    created_at: "2026-09-01T08:00:00Z",
    updated_at: "2026-09-01T08:00:00Z",
  }));
  const project_people: ProjectPerson[] = projects.map((p, i) => ({
    id: seedId(9, i),
    project_id: p.id,
    person_id: people[i < 4 ? 0 : 1 + ((i - 4) % 10)].id,
    role: "project_manager",
  }));
  const allocations = project_people.flatMap((p, i) => [
    {
      id: seedId(10, i),
      project_person_id: p.id,
      start_date: i < 4 ? "2026-09-01" : `2026-${i % 3 === 0 ? "11" : "10"}-01`,
      end_date: "2026-12-31",
      percentage: i < 4 ? [40, 20, 25, 25][i] : [20, 40, 60, 30, 50][i % 5],
    },
    {
      id: seedId(11, i),
      project_person_id: p.id,
      start_date: "2027-01-01",
      end_date: i % 2 ? "2027-03-31" : "2027-02-28",
      percentage: i % 4 === 0 ? 0 : 20,
    },
  ]);
  for (let i = 0; i < 3; i++) {
    project_people.push({
      id: seedId(12, i),
      project_id: projects[i].id,
      person_id: people[12 + i].id,
      role: "consultant",
    });
    allocations.push({
      id: seedId(13, i),
      project_person_id: seedId(12, i),
      start_date: "2026-10-15",
      end_date: "2027-01-31",
      percentage: 40,
    });
  }
  return {
    people,
    business_areas,
    management_areas,
    properties,
    projects,
    project_people,
    allocations,
    project_statuses,
    project_types,
    project_levels,
    project_level_links: projects.map((p, i) => ({
      project_id: p.id,
      level_id: project_levels[i % 4].id,
    })),
  };
}
