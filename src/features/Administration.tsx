import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
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
import type {
  AdminTable,
  AppData,
  Classification,
  Person,
} from "../domain/types";
import { masterDataSync } from "../services/master-data";

const sections = [
  { value: "project_statuses", label: "Projektstatus" },
  { value: "project_types", label: "Projekttyper" },
  { value: "project_levels", label: "Projektnivåer" },
  { value: "internal", label: "Medarbetare" },
  { value: "external", label: "Konsulter" },
  { value: "master", label: "Masterdata" },
];
export function Administration({
  data,
  onSave,
}: {
  data: AppData;
  onSave: (
    table: AdminTable,
    value: Person | Classification,
  ) => Promise<boolean>;
}) {
  const [tab, setTab] = useState("project_statuses");
  const [editing, setEditing] = useState<Person | Classification | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [syncResult, setSyncResult] = useState("");
  const table: AdminTable =
    tab === "internal" || tab === "external"
      ? "people"
      : tab === "project_types" || tab === "project_levels"
        ? tab
        : "project_statuses";
  const values =
    table === "people"
      ? data.people.filter((p) => p.type === tab)
      : [...data[table]].sort((a, b) => a.sort_order - b.sort_order);
  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      setError("Ange ett namn.");
      return;
    }
    if (
      data[table].some(
        (v) =>
          v.id !== editing.id &&
          v.name.toLocaleLowerCase("sv-SE") ===
            editing.name.trim().toLocaleLowerCase("sv-SE"),
      )
    ) {
      setError("Namnet finns redan.");
      return;
    }
    setBusy(true);
    const ok = await onSave(table, { ...editing, name: editing.name.trim() });
    setBusy(false);
    if (ok) setEditing(null);
  };
  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Administration</h1>
          <p>Gemensamma värden för en konsekvent planering.</p>
        </div>
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value);
          setError("");
        }}
      >
        <TabsList aria-label="Administrationsområde" className="admin-tabs">
          {sections.map((s) => (
            <TabsTrigger value={s.value} key={s.value}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {tab === "master" ? (
        <div className="master-data">
          <div className="section-heading">
            <div>
              <h2>Dalux FM</h2>
              <p>
                Senast synkroniserad: <strong>Inte synkroniserad</strong>
              </p>
            </div>
            <Badge>Förberedd integration</Badge>
          </div>
          <p>
            AO, FO och fastigheter är testdata. De ska framöver hämtas från
            Dalux och underhålls därför inte manuellt här.
          </p>
          <div className="master-counts">
            <div>
              <strong>{data.properties.length}</strong>Fastigheter
            </div>
            <div>
              <strong>{data.business_areas.length}</strong>Affärsområden
            </div>
            <div>
              <strong>{data.management_areas.length}</strong>Förvaltningsområden
            </div>
          </div>
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const result = await masterDataSync.sync();
                setSyncResult(
                  `Test klart ${new Date(result.completedAt).toLocaleString("sv-SE")}. ${result.counts[2]} fastigheter lästes. Ingen kontakt med Dalux och inga data ändrades.`,
                );
              } catch {
                setError(
                  "Testet misslyckades. Kontrollera anslutningen och försök igen.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Testar…" : "Synkronisera (test)"}
          </Button>
          <p className="view-note">
            Startas endast med knappen. Ingen automatisk synkronisering.
          </p>
          {syncResult && <p role="status">{syncResult}</p>}
          {error && <p role="alert">{error}</p>}
          <h2>Fastighetsregister</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fastighet</TableHead>
                <TableHead>AO</TableHead>
                <TableHead>FO</TableHead>
                <TableHead>Käll-ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.properties.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.property_number} · {p.name}
                  </TableCell>
                  <TableCell>
                    {
                      data.business_areas.find(
                        (v) => v.id === p.business_area_id,
                      )?.name
                    }
                  </TableCell>
                  <TableCell>
                    {
                      data.management_areas.find(
                        (v) => v.id === p.management_area_id,
                      )?.name
                    }
                  </TableCell>
                  <TableCell>{p.external_id ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="section-heading">
            <h2>{sections.find((s) => s.value === tab)?.label}</h2>
            <Button
              onClick={() => {
                setError("");
                setEditing(
                  table === "people"
                    ? {
                        id: crypto.randomUUID(),
                        name: "",
                        active: true,
                        type: tab === "external" ? "external" : "internal",
                      }
                    : {
                        id: crypto.randomUUID(),
                        name: "",
                        active: true,
                        sort_order: values.length,
                      },
                );
              }}
            >
              Lägg till
            </Button>
          </div>
          <p className="view-note">
            Inaktiva värden behålls på befintliga projekt och kan återaktiveras.
          </p>
          {!values.length ? (
            <p className="empty-state">
              Inga värden ännu. Lägg till det första.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Åtgärd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {values.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>
                      <Badge>{v.active ? "Aktiv" : "Inaktiv"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setError("");
                          setEditing({ ...v });
                        }}
                      >
                        Redigera<span className="sr-only"> {v.name}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && !busy && setEditing(null)}
      >
        <DialogContent closeLabel="Stäng">
          <DialogHeader>
            <DialogTitle>
              Redigera {table === "people" ? "resurs" : "värde"}
            </DialogTitle>
            <DialogDescription>
              Ändra namn eller inaktivera för framtida val.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void save();
              }}
            >
              <div className="field">
                <Label htmlFor="admin-name">Namn</Label>
                <Input
                  id="admin-name"
                  value={editing.name}
                  disabled={busy}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  maxLength={200}
                />
              </div>
              {"sort_order" in editing && (
                <div className="field">
                  <Label htmlFor="admin-order">Sorteringsordning</Label>
                  <Input
                    id="admin-order"
                    type="number"
                    step={1}
                    value={editing.sort_order}
                    disabled={busy}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        sort_order: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
              <Label className="checkbox-label">
                <Checkbox
                  disabled={busy}
                  checked={editing.active}
                  onCheckedChange={(active) =>
                    setEditing({ ...editing, active: active === true })
                  }
                />
                Aktiv
              </Label>
              {error && <p role="alert">{error}</p>}
              <div className="dialog-actions">
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => setEditing(null)}
                >
                  Avbryt
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? "Sparar…" : "Spara"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
