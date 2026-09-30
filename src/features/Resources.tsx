import { useState } from "react";
import {
  Badge,
  Button,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hufvudstaden/design-system";
import type { AppData } from "../domain/types";
import { getPersonUtilization, monthRange, percent } from "../domain/planning";

export function Resources({
  data,
  onPerson,
}: {
  data: AppData;
  onPerson: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("2026-10");
  const people = data.people.filter((p) =>
    p.name
      .toLocaleLowerCase("sv-SE")
      .includes(search.toLocaleLowerCase("sv-SE")),
  );
  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Resurser</h1>
          <p>
            Medarbetare och konsulter. Välj en person för att se belastning över
            tid.
          </p>
        </div>
      </div>
      <div className="list-toolbar">
        <div className="field">
          <Label htmlFor="resource-search">Sök resurs</Label>
          <Input
            id="resource-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök namn"
          />
        </div>
        <div className="field">
          <Label htmlFor="resource-month">Månad</Label>
          <Input
            id="resource-month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
      </div>
      {!people.length && <p className="empty-state">Inga resurser hittades.</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Månadsmedel</TableHead>
            <TableHead>Topp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => {
            const range = month ? monthRange(month) : null;
            const u = range
              ? getPersonUtilization(data, person.id, range.start, range.end)
              : null;
            return (
              <TableRow key={person.id}>
                <TableCell>
                  <Button variant="link" onClick={() => onPerson(person.id)}>
                    {person.name}
                  </Button>
                </TableCell>
                <TableCell>
                  {person.type === "internal" ? "Medarbetare" : "Konsult"}
                </TableCell>
                <TableCell>
                  <Badge>{person.active ? "Aktiv" : "Inaktiv"}</Badge>
                </TableCell>
                <TableCell>
                  {u ? percent(u.totalPercentage) : "Välj månad"}
                </TableCell>
                <TableCell>
                  {u
                    ? `${u.peakPercentage > 100 ? "! " : ""}${percent(u.peakPercentage)}`
                    : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
