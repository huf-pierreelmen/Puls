import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  NativeSelect,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hufvudstaden/design-system";
import type { AppData } from "../domain/types";
import { emptyFilters } from "../domain/types";
import { filteredProjects, percent } from "../domain/planning";
import { PlanningFilters } from "../components/PlanningFilters";

export function Projects({
  data,
  onProject,
  onCreate,
}: {
  data: AppData;
  onProject: (id: string) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ ...emptyFilters });
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState("name");
  const source = archived
    ? {
        ...data,
        projects: data.projects.map((p) => ({ ...p, archived: false })),
      }
    : data;
  const projects = filteredProjects(source, filters)
    .filter((p) =>
      `${p.name} ${p.project_number}`
        .toLocaleLowerCase("sv-SE")
        .includes(search.toLocaleLowerCase("sv-SE")),
    )
    .sort((a, b) =>
      sort === "number"
        ? a.project_number.localeCompare(b.project_number, "sv")
        : a.name.localeCompare(b.name, "sv"),
    );
  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Projekt</h1>
          <p>Projekt, ansvariga och planerad tid.</p>
        </div>
        <Button onClick={onCreate}>Nytt projekt</Button>
      </div>
      <div className="list-toolbar">
        <div className="field">
          <Label htmlFor="project-search">Sök projekt</Label>
          <Input
            id="project-search"
            placeholder="Namn eller projektnummer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="field">
          <Label htmlFor="project-sort">Sortera</Label>
          <NativeSelect
            id="project-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">Projektnamn A–Ö</option>
            <option value="number">Projektnummer</option>
          </NativeSelect>
        </div>
        <Label className="checkbox-label">
          <Checkbox
            checked={archived}
            onCheckedChange={(value) => setArchived(value === true)}
          />
          Visa även arkiverade
        </Label>
      </div>
      <PlanningFilters data={data} value={filters} onChange={setFilters} />
      <p className="view-note">
        {projects.length} projekt · Belastning visar summan av resursernas
        högsta tilldelade procent per period.
      </p>
      {!projects.length ? (
        <p className="empty-state">
          Inga projekt hittades. Ändra filtren eller skapa ett nytt projekt.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Projekt",
                "AO / FO",
                "Fastighet",
                "Intern projektledare",
                "Status / typ",
                "Period",
                "Belastning",
              ].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const property = data.properties.find(
                (p) => p.id === project.property_id,
              );
              const links = data.project_people.filter(
                (p) => p.project_id === project.id,
              );
              const periods = data.allocations.filter((a) =>
                links.some((p) => p.id === a.project_person_id),
              );
              const starts = periods.map((a) => a.start_date).sort(),
                ends = periods.map((a) => a.end_date).sort();
              const amount = links.reduce(
                (sum, link) =>
                  sum +
                  Math.max(
                    0,
                    ...periods
                      .filter((a) => a.project_person_id === link.id)
                      .map((a) => a.percentage),
                  ),
                0,
              );
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => onProject(project.id)}
                    >
                      {project.name}
                    </Button>
                    <small>
                      {project.project_number}
                      {data.projects.find((p) => p.id === project.id)
                        ?.archived && " · Arkiverat"}
                    </small>
                  </TableCell>
                  <TableCell>
                    {
                      data.business_areas.find(
                        (v) => v.id === property?.business_area_id,
                      )?.name
                    }
                    <small>
                      {
                        data.management_areas.find(
                          (v) => v.id === property?.management_area_id,
                        )?.name
                      }
                    </small>
                  </TableCell>
                  <TableCell>{property?.name}</TableCell>
                  <TableCell>
                    {links
                      .filter((v) => v.role === "project_manager")
                      .map(
                        (v) =>
                          data.people.find((p) => p.id === v.person_id)?.name,
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Badge>
                      {
                        data.project_statuses.find(
                          (v) => v.id === project.status_id,
                        )?.name
                      }
                    </Badge>
                    <small>
                      {
                        data.project_types.find(
                          (v) => v.id === project.project_type_id,
                        )?.name
                      }
                    </small>
                  </TableCell>
                  <TableCell className="nowrap">
                    {starts[0] ?? "Ej planerat"}
                    <small>{ends[ends.length - 1]}</small>
                  </TableCell>
                  <TableCell>{percent(amount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
