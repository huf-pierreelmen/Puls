import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@hufvudstaden/design-system";
import type { AppData } from "../domain/types";
import { percent } from "../domain/planning";

export function ProjectDetail({
  id,
  data,
  onClose,
  onEdit,
  onArchive,
}: {
  id: string;
  data: AppData;
  onClose: () => void;
  onEdit: () => void;
  onArchive: (id: string, archived: boolean) => Promise<boolean>;
}) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const p = data.projects.find((p) => p.id === id);
  if (!p) return null;
  const property = data.properties.find((v) => v.id === p.property_id);
  const details = [
    ["Projektnummer", p.project_number],
    [
      "AO",
      data.business_areas.find((v) => v.id === property?.business_area_id)
        ?.name,
    ],
    [
      "FO",
      data.management_areas.find((v) => v.id === property?.management_area_id)
        ?.name,
    ],
    ["Fastighet", property?.name],
    ["Status", data.project_statuses.find((v) => v.id === p.status_id)?.name],
    [
      "Projekttyp",
      data.project_types.find((v) => v.id === p.project_type_id)?.name,
    ],
    [
      "Projektnivå",
      data.project_level_links
        .filter((v) => v.project_id === id)
        .map((v) => data.project_levels.find((l) => l.id === v.level_id)?.name)
        .join(", ") || "Ej angiven",
    ],
  ];
  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent closeLabel="Stäng" className="detail-dialog">
          <DialogHeader>
            <DialogTitle>{p.name}</DialogTitle>
            <DialogDescription>
              {p.project_number} · Projektöversikt
            </DialogDescription>
          </DialogHeader>
          {p.archived && <Badge>Arkiverat · ingår inte i planeringen</Badge>}
          <dl className="project-facts">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="section-heading">
            <h2>Resurser och planering</h2>
            <Button variant="outline" onClick={onEdit}>
              Redigera projekt
            </Button>
          </div>
          {data.project_people
            .filter((v) => v.project_id === id)
            .map((link) => (
              <section className="resource-periods" key={link.id}>
                <h3>
                  {data.people.find((v) => v.id === link.person_id)?.name}{" "}
                  <small>
                    {link.role === "consultant"
                      ? "Konsult"
                      : link.role === "project_manager"
                        ? "Projektledare"
                        : "Resurs"}
                  </small>
                </h3>
                {data.allocations
                  .filter((v) => v.project_person_id === link.id)
                  .map((a) => (
                    <div className="contribution" key={a.id}>
                      <span>
                        {a.start_date} – {a.end_date}
                      </span>
                      <strong>{percent(a.percentage)}</strong>
                    </div>
                  ))}
              </section>
            ))}
          <h2>Kommentar</h2>
          <p className="project-comment">
            {p.comment || "Ingen kommentar ännu."}
          </p>
          <Button variant="outline" onClick={() => setConfirm(true)}>
            {p.archived ? "Återställ projekt" : "Arkivera projekt"}
          </Button>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={confirm}
        onOpenChange={(open) => !busy && setConfirm(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {p.archived ? "Återställ projektet?" : "Arkivera projektet?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {p.archived
                ? "Projektets perioder kommer att ingå i planeringen igen."
                : "Projektet sparas, men dess perioder tas bort från planeringsvyerna. Du kan återställa det senare."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="dialog-actions">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => setConfirm(false)}
            >
              Avbryt
            </Button>
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const ok = await onArchive(id, !p.archived);
                setBusy(false);
                if (ok) setConfirm(false);
              }}
            >
              {busy ? "Sparar…" : p.archived ? "Återställ" : "Arkivera"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
