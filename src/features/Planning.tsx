import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@hufvudstaden/design-system";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AppData } from "../domain/types";
import { emptyFilters } from "../domain/types";
import {
  dayNumber,
  filteredProjects,
  getPersonUtilization,
  monthLabel,
  monthRange,
  monthsBetween,
  overlapDays,
  percent,
  utilizationTone,
} from "../domain/planning";
import { PlanningFilters } from "../components/PlanningFilters";

export function Planning({
  data,
  initialPerson = "",
  onProject,
}: {
  data: AppData;
  initialPerson?: string;
  onProject: (id: string) => void;
}) {
  const [filters, setFilters] = useState({
    ...emptyFilters,
    person: initialPerson,
  });
  const [from, setFrom] = useState("2026-09");
  const [to, setTo] = useState("2027-02");
  const [tab, setTab] = useState(initialPerson ? "workload" : "overview");
  const [selected, setSelected] = useState<{
    person: string;
    month: string;
  } | null>(null);
  const months = monthsBetween(from, to);
  const projects = filteredProjects(data, filters);
  const people = data.people.filter(
    (p) =>
      (p.active ||
        data.project_people.some(
          (v) =>
            v.person_id === p.id &&
            projects.some((project) => project.id === v.project_id),
        )) &&
      (!filters.person || p.id === filters.person),
  );
  const utilization = (person: string, month: string) => {
    const range = monthRange(month);
    return getPersonUtilization(data, person, range.start, range.end, projects);
  };
  const detail = selected ? utilization(selected.person, selected.month) : null;
  const conflicts = people.filter((p) =>
    months.some((m) => utilization(p.id, m).peakPercentage > 100),
  ).length;
  const periodValid = months.length > 0 && months[months.length - 1] === to;
  const workloadPeople = filters.person ? people : people.slice(0, 1);
  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Planering</h1>
          <p>Resurser, projekt och kapacitet i samma vy.</p>
        </div>
        <Badge>
          {people.length} resurser · {projects.length} projekt
        </Badge>
      </div>
      <PlanningFilters data={data} value={filters} onChange={setFilters} />
      <div className="planning-toolbar">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList aria-label="Planeringsvy">
            <TabsTrigger value="overview">Översikt</TabsTrigger>
            <TabsTrigger value="timeline">Tidslinje</TabsTrigger>
            <TabsTrigger value="workload">Belastning</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="month-range">
          <Label htmlFor="from-month">Från</Label>
          <Input
            id="from-month"
            type="month"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Label htmlFor="to-month">Till</Label>
          <Input
            id="to-month"
            type="month"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>
      {!periodValid ? (
        <p role="alert">Välj en giltig period på högst 36 månader.</p>
      ) : (
        <>
          <div className="legend">
            <span className="legend-low">0–49 % · Låg</span>
            <span className="legend-normal">50–89 % · Normal</span>
            <span className="legend-near">90–100 % · Nära kapacitet</span>
            <strong>! Över 100 % · {conflicts} resurser</strong>
          </div>
          <p className="view-note">
            Kalenderdagsviktat månadsmedel. Topp visar högsta samtidiga
            belastning. Filter begränsar vilka projekt som räknas.
          </p>
          {!people.length && (
            <p className="empty-state">Inga resurser matchar filtret.</p>
          )}
          {tab === "overview" && people.length > 0 && (
            <div className="planning-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="person-column">Resurs</TableHead>
                    {months.map((m) => (
                      <TableHead key={m}>{monthLabel(m)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="person-column">
                        <strong>{person.name}</strong>
                        <small>
                          {person.type === "external"
                            ? "Konsult"
                            : "Projektledare"}
                          {!person.active && " · Inaktiv"}
                        </small>
                      </TableCell>
                      {months.map((month) => {
                        const u = utilization(person.id, month);
                        return (
                          <TableCell key={month}>
                            <Button
                              variant="ghost"
                              className={`allocation-cell ${utilizationTone(u.totalPercentage)}`}
                              onClick={() =>
                                setSelected({ person: person.id, month })
                              }
                              aria-label={`${person.name}, ${monthLabel(month)}, ${percent(u.totalPercentage)}${u.peakPercentage > 100 ? ", över kapacitet" : ""}`}
                            >
                              <strong>{percent(u.totalPercentage)}</strong>
                              {u.overAllocatedBy > 0 ? (
                                <small>
                                  +{percent(u.overAllocatedBy)} över
                                </small>
                              ) : u.peakPercentage > 100 ? (
                                <small>
                                  ! Topp {percent(u.peakPercentage)}
                                </small>
                              ) : (
                                <small>
                                  {u.totalPercentage === 0
                                    ? "Oplanerad"
                                    : "Visa projekt"}
                                </small>
                              )}
                            </Button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {tab === "timeline" && (
            <div className="timeline-scroll">
              <div
                className="timeline"
                style={{ minWidth: Math.max(850, months.length * 140 + 230) }}
              >
                <div className="timeline-header">
                  <strong>Resurs / projekt</strong>
                  <div className="timeline-months">
                    {months.map((m) => (
                      <span key={m} style={{ flex: dayNumber(monthRange(m).end) - dayNumber(monthRange(m).start) + 1 }}>{monthLabel(m)}</span>
                    ))}
                  </div>
                </div>
                {people.map((person) => {
                  const range = {
                    start: monthRange(from).start,
                    end: monthRange(to).end,
                  };
                  const contributions = getPersonUtilization(
                    data,
                    person.id,
                    range.start,
                    range.end,
                    projects,
                  ).allocations;
                  const duration =
                    dayNumber(range.end) - dayNumber(range.start) + 1;
                  return (
                    <div key={person.id} className="timeline-person">
                      <strong>{person.name}</strong>
                      {!contributions.length && <p>Ingen planerad tid</p>}
                      {contributions.map(({ allocation: a, project }) => (
                        <div className="timeline-row" key={a.id}>
                          <Button
                            variant="ghost"
                            onClick={() => onProject(project.id)}
                          >
                            {project.name}
                          </Button>
                          <div className="timeline-track">
                            <Button
                              className="timeline-bar"
                              style={{
                                left: `${(Math.max(0, dayNumber(a.start_date) - dayNumber(range.start)) / duration) * 100}%`,
                                width: `${(overlapDays(a.start_date, a.end_date, range.start, range.end) / duration) * 100}%`,
                              }}
                              onClick={() => onProject(project.id)}
                              title={`${project.name} · ${a.start_date} – ${a.end_date} · ${percent(a.percentage)}`}
                              aria-label={`${person.name}, ${project.name}, ${a.start_date} till ${a.end_date}, ${percent(a.percentage)}`}
                            >
                              {percent(a.percentage)} · {a.start_date} –{" "}
                              {a.end_date}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {tab === "workload" &&
            workloadPeople.map((person) => {
              const values = months.map((month) => ({
                month: monthLabel(month),
                value: utilization(person.id, month).totalPercentage,
              }));
              return (
                <div className="workload" key={person.id}>
                  <h2>{person.name}</h2>
                  {!filters.person && (
                    <p>Välj en annan person med personfiltret ovan.</p>
                  )}
                  <div className="workload-chart" aria-hidden="true">
                    <ResponsiveContainer width="100%" height={230}>
                      <BarChart data={values}>
                        <CartesianGrid
                          vertical={false}
                          stroke="var(--ds-subtle)"
                        />
                        <XAxis dataKey="month" />
                        <YAxis unit="%" domain={[0, (maximum: number) => Math.max(100, Math.ceil(maximum / 20) * 20)]} />
                        <Tooltip
                          formatter={(value) => percent(Number(value))}
                        />
                        <ReferenceLine
                          y={100}
                          stroke="var(--ds-ink)"
                          strokeDasharray="4 4"
                          label="Kapacitet 100 %"
                        />
                        <Bar
                          dataKey="value"
                          name="Belastning"
                          fill="var(--ds-primary)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="workload-months">
                    {months.map((month) => {
                      const u = utilization(person.id, month);
                      return (
                        <Button
                          variant="outline"
                          className={`workload-month ${utilizationTone(u.totalPercentage)}`}
                          key={month}
                          onClick={() =>
                            setSelected({ person: person.id, month })
                          }
                        >
                          <span>{monthLabel(month)}</span>
                          <strong>{percent(u.totalPercentage)}</strong>
                          {u.peakPercentage > 100 && (
                            <small>! Topp {percent(u.peakPercentage)}</small>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent closeLabel="Stäng" className="detail-dialog">
          <DialogHeader>
            <DialogTitle>
              {data.people.find((p) => p.id === selected?.person)?.name}
            </DialogTitle>
            <DialogDescription>
              {selected && monthLabel(selected.month)} · Projektens bidrag till
              månadsmedel
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <>
              <div className="detail-total">
                <strong>{percent(detail.totalPercentage)}</strong>
                <span>
                  {detail.overAllocatedBy > 0
                    ? `+${percent(detail.overAllocatedBy)} över kapacitet`
                    : "Planerat månadsmedel"}
                </span>
              </div>
              {detail.peakPercentage > 100 && (
                <p className="conflict-note">
                  ! Högsta samtidiga belastning:{" "}
                  {percent(detail.peakPercentage)}
                </p>
              )}
              {!detail.allocations.length ? (
                <p>Ingen planerad tid under perioden.</p>
              ) : (
                detail.allocations.map(
                  ({ project, allocation, percentage }) => (
                    <div className="contribution" key={allocation.id}>
                      <div>
                        <Button
                          variant="link"
                          onClick={() => {
                            setSelected(null);
                            onProject(project.id);
                          }}
                        >
                          {project.name}
                        </Button>
                        <small>
                          {allocation.start_date} – {allocation.end_date} ·
                          tilldelat {percent(allocation.percentage)}
                        </small>
                      </div>
                      <strong>{percent(percentage)}</strong>
                    </div>
                  ),
                )
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
