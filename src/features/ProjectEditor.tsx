import { useState } from "react";
import {
  Button,
  Checkbox,
  Combobox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@hufvudstaden/design-system";
import type { AppData, ProjectDraft, ProjectPerson } from "../domain/types";
import { validateProject } from "../domain/validation";
import { PeriodFields } from "../components/PeriodFields";

export function makeDraft(data: AppData, id?: string): ProjectDraft {
  const project = data.projects.find((p) => p.id === id);
  if (project) {
    const people = data.project_people.filter((p) => p.project_id === id);
    return {
      project: { ...project },
      people,
      allocations: data.allocations.filter((a) =>
        people.some((p) => p.id === a.project_person_id),
      ),
      levelIds: data.project_level_links
        .filter((p) => p.project_id === id)
        .map((p) => p.level_id),
    };
  }
  const now = new Date().toISOString();
  return {
    project: {
      id: crypto.randomUUID(),
      external_id: null,
      project_number: "",
      name: "",
      property_id: "",
      status_id: "",
      project_type_id: "",
      comment: "",
      archived: false,
      created_at: now,
      updated_at: now,
    },
    people: [],
    allocations: [],
    levelIds: [],
  };
}
export function ProjectEditor({
  data,
  projectId,
  onClose,
  onSave,
}: {
  data: AppData;
  projectId?: string;
  onClose: () => void;
  onSave: (draft: ProjectDraft) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState(() => makeDraft(data, projectId));
  const property = data.properties.find(
    (p) => p.id === draft.project.property_id,
  );
  const [ao, setAo] = useState(property?.business_area_id ?? "");
  const [fo, setFo] = useState(property?.management_area_id ?? "");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const setProject = (patch: Partial<ProjectDraft["project"]>) =>
    setDraft((v) => ({ ...v, project: { ...v.project, ...patch } }));
  const choices = (
    values: { id: string; name: string; active: boolean }[],
    selected = "",
  ) =>
    values
      .filter((v) => v.active || v.id === selected)
      .map((v) => ({
        value: v.id,
        label: `${v.name}${v.active ? "" : " (inaktiv)"}`,
      }));
  const addPerson = (personId: string, role: ProjectPerson["role"]) => {
    if (!personId || draft.people.some((p) => p.person_id === personId)) return;
    const link = {
      id: crypto.randomUUID(),
      project_id: draft.project.id,
      person_id: personId,
      role,
    };
    setDraft((v) => ({
      ...v,
      people: [...v.people, link],
      allocations: [
        ...v.allocations,
        {
          id: crypto.randomUUID(),
          project_person_id: link.id,
          start_date: "2026-10-01",
          end_date: "2027-03-31",
          percentage: 20,
        },
      ],
    }));
  };
  const next = () => {
    let message = "";
    if (
      step === 0 &&
      (!ao ||
        !fo ||
        !draft.project.property_id ||
        !draft.project.name.trim() ||
        !draft.project.project_number.trim())
    )
      message = "Ange AO, FO, fastighet, projektnamn och projektnummer.";
    if (
      step === 1 &&
      (!draft.project.status_id || !draft.project.project_type_id)
    )
      message = "Välj status och projekttyp.";
    if (step === 2 && !draft.people.some((p) => p.role === "project_manager"))
      message = "Välj minst en intern projektledare.";
    setError(message);
    if (!message) setStep((v) => v + 1);
  };
  const save = async () => {
    const message = validateProject(draft, data);
    setError(message ?? "");
    if (message) return;
    setBusy(true);
    const saved = await onSave(draft);
    setBusy(false);
    if (saved) onClose();
    else
      setError(
        "Projektet kunde inte sparas. Kontrollera felmeddelandet och försök igen.",
      );
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        closeLabel="Stäng"
        className="editor-dialog"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {projectId ? "Redigera projekt" : "Nytt projekt"}
          </DialogTitle>
          <DialogDescription>
            Steg {step + 1} av 4 ·{" "}
            {["Projekt", "Klassificering", "Resurser", "Planering"][step]}
          </DialogDescription>
        </DialogHeader>
        <ol className="wizard-steps" aria-label="Projektsteg">
          {["Projekt", "Klassificering", "Resurser", "Planering"].map(
            (label, i) => (
              <li key={label} aria-current={i === step ? "step" : undefined}>
                {i + 1}. {label}
              </li>
            ),
          )}
        </ol>
        <fieldset disabled={busy} className="editor-fields">
          {step === 0 && (
            <div className="form-grid">
              <div className="field">
                <Label htmlFor="project-ao">AO</Label>
                <Combobox
                  id="project-ao"
                  options={choices(data.business_areas, ao)}
                  value={ao}
                  onValueChange={(v) => {
                    setAo(v);
                    setFo("");
                    setProject({ property_id: "" });
                  }}
                  placeholder="Välj AO"
                  searchLabel="Sök AO"
                  emptyMessage="Inga affärsområden"
                />
              </div>
              <div className="field">
                <Label htmlFor="project-fo">FO</Label>
                <Combobox
                  id="project-fo"
                  disabled={!ao}
                  options={choices(
                    data.management_areas.filter(
                      (v) => v.business_area_id === ao,
                    ),
                    fo,
                  )}
                  value={fo}
                  onValueChange={(v) => {
                    setFo(v);
                    setProject({ property_id: "" });
                  }}
                  placeholder="Välj FO"
                  searchLabel="Sök FO"
                  emptyMessage="Inga förvaltningsområden"
                />
              </div>
              <div className="field span-2">
                <Label htmlFor="project-property">Fastighet</Label>
                <Combobox
                  id="project-property"
                  disabled={!fo}
                  options={choices(
                    data.properties.filter(
                      (v) =>
                        v.business_area_id === ao &&
                        v.management_area_id === fo,
                    ),
                    draft.project.property_id,
                  )}
                  value={draft.project.property_id}
                  onValueChange={(property_id) => setProject({ property_id })}
                  placeholder="Välj fastighet"
                  searchLabel="Sök fastighet"
                  emptyMessage="Inga fastigheter"
                />
              </div>
              <div className="field">
                <Label htmlFor="project-name">Projektnamn</Label>
                <Input
                  id="project-name"
                  value={draft.project.name}
                  onChange={(e) => setProject({ name: e.target.value })}
                  maxLength={200}
                />
              </div>
              <div className="field">
                <Label htmlFor="project-number">Projektnummer</Label>
                <Input
                  id="project-number"
                  value={draft.project.project_number}
                  onChange={(e) =>
                    setProject({ project_number: e.target.value })
                  }
                  maxLength={80}
                />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="form-grid">
              <div className="field">
                <Label htmlFor="project-status">Status</Label>
                <Combobox
                  id="project-status"
                  options={choices(
                    data.project_statuses,
                    draft.project.status_id,
                  )}
                  value={draft.project.status_id}
                  onValueChange={(status_id) => setProject({ status_id })}
                  placeholder="Välj status"
                  searchLabel="Sök status"
                  emptyMessage="Inga statusar"
                />
              </div>
              <div className="field">
                <Label htmlFor="project-type">Projekttyp</Label>
                <Combobox
                  id="project-type"
                  options={choices(
                    data.project_types,
                    draft.project.project_type_id,
                  )}
                  value={draft.project.project_type_id}
                  onValueChange={(project_type_id) =>
                    setProject({ project_type_id })
                  }
                  placeholder="Välj projekttyp"
                  searchLabel="Sök projekttyp"
                  emptyMessage="Inga projekttyper"
                />
              </div>
              <fieldset className="span-2 level-options">
                <legend>Projektnivå · flera val möjliga</legend>
                {data.project_levels
                  .filter((v) => v.active || draft.levelIds.includes(v.id))
                  .map((level) => (
                    <Label key={level.id} className="checkbox-label">
                      <Checkbox
                        checked={draft.levelIds.includes(level.id)}
                        onCheckedChange={(checked) =>
                          setDraft((v) => ({
                            ...v,
                            levelIds: checked
                              ? [...v.levelIds, level.id]
                              : v.levelIds.filter((id) => id !== level.id),
                          }))
                        }
                      />
                      {level.name}
                    </Label>
                  ))}
              </fieldset>
            </div>
          )}
          {step === 2 && (
            <>
              <div className="form-grid">
                <div className="field">
                  <Label htmlFor="add-manager">
                    Lägg till intern projektledare
                  </Label>
                  <Combobox
                    id="add-manager"
                    value=""
                    options={choices(
                      data.people.filter(
                        (p) =>
                          p.type === "internal" &&
                          !draft.people.some((v) => v.person_id === p.id),
                      ),
                    )}
                    onValueChange={(id) => addPerson(id, "project_manager")}
                    placeholder="Sök medarbetare"
                    searchLabel="Sök medarbetare"
                    emptyMessage="Inga fler medarbetare"
                  />
                </div>
                <div className="field">
                  <Label htmlFor="add-consultant">
                    Lägg till konsult (valfritt)
                  </Label>
                  <Combobox
                    id="add-consultant"
                    value=""
                    options={choices(
                      data.people.filter(
                        (p) =>
                          p.type === "external" &&
                          !draft.people.some((v) => v.person_id === p.id),
                      ),
                    )}
                    onValueChange={(id) => addPerson(id, "consultant")}
                    placeholder="Sök konsult"
                    searchLabel="Sök konsult"
                    emptyMessage="Inga fler konsulter"
                  />
                </div>
              </div>
              <div className="assigned-list">
                {draft.people.map((link) => (
                  <div key={link.id}>
                    <span>
                      {data.people.find((p) => p.id === link.person_id)?.name} ·{" "}
                      {link.role === "consultant" ? "Konsult" : "Projektledare"}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setDraft((v) => ({
                          ...v,
                          people: v.people.filter((p) => p.id !== link.id),
                          allocations: v.allocations.filter(
                            (a) => a.project_person_id !== link.id,
                          ),
                        }))
                      }
                    >
                      Ta bort ur utkast
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p>
                Planera varje resurs i en eller flera perioder. Överlappande
                perioder summeras.
              </p>
              {draft.people.map((link) => (
                <section className="resource-periods" key={link.id}>
                  <h3>
                    {data.people.find((p) => p.id === link.person_id)?.name}
                  </h3>
                  {draft.allocations
                    .filter((a) => a.project_person_id === link.id)
                    .map((a) => (
                      <div className="period" key={a.id}>
                        <PeriodFields
                          value={a}
                          onChange={(value) =>
                            setDraft((v) => ({
                              ...v,
                              allocations: v.allocations.map((item) =>
                                item.id === value.id ? value : item,
                              ),
                            }))
                          }
                        />
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setDraft((v) => ({
                              ...v,
                              allocations: v.allocations.filter(
                                (item) => item.id !== a.id,
                              ),
                            }))
                          }
                        >
                          Ta bort period ur utkast
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setDraft((v) => ({
                        ...v,
                        allocations: [
                          ...v.allocations,
                          {
                            id: crypto.randomUUID(),
                            project_person_id: link.id,
                            start_date: "",
                            end_date: "",
                            percentage: 20,
                          },
                        ],
                      }))
                    }
                  >
                    Lägg till period
                  </Button>
                </section>
              ))}
              <div className="field">
                <Label htmlFor="project-comment">Projektkommentar</Label>
                <Textarea
                  id="project-comment"
                  value={draft.project.comment}
                  onChange={(e) => setProject({ comment: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}
        </fieldset>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <Button variant="ghost" disabled={busy} onClick={onClose}>
            Avbryt
          </Button>
          <div>
            {step > 0 && (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setStep((v) => v - 1);
                  setError("");
                }}
              >
                Tillbaka
              </Button>
            )}{" "}
            {step < 3 ? (
              <Button onClick={next}>Nästa</Button>
            ) : (
              <Button disabled={busy} onClick={() => void save()}>
                {busy ? "Sparar…" : "Spara projekt"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
