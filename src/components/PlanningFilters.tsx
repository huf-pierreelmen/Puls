import { Button, Combobox, Label } from "@hufvudstaden/design-system";
import type { AppData, PlanningFilters as Filters } from "../domain/types";
import { emptyFilters } from "../domain/types";

export function PlanningFilters({
  data,
  value,
  onChange,
}: {
  data: AppData;
  value: Filters;
  onChange: (value: Filters) => void;
}) {
  const fields = [
    ["person", "Person", data.people],
    ["ao", "AO", data.business_areas],
    [
      "fo",
      "FO",
      data.management_areas.filter(
        (v) => !value.ao || v.business_area_id === value.ao,
      ),
    ],
    [
      "property",
      "Fastighet",
      data.properties.filter(
        (v) =>
          (!value.ao || v.business_area_id === value.ao) &&
          (!value.fo || v.management_area_id === value.fo),
      ),
    ],
    ["type", "Projekttyp", data.project_types],
    ["status", "Status", data.project_statuses],
  ] as const;
  return (
    <div className="filters">
      {fields.map(([key, label, values]) => (
        <div className="field" key={key}>
          <Label htmlFor={`filter-${key}`}>{label}</Label>
          <Combobox
            id={`filter-${key}`}
            aria-label={`Filtrera ${label}`}
            value={value[key]}
            onValueChange={(selected) =>
              onChange({
                ...value,
                [key]: selected,
                ...(key === "ao"
                  ? { fo: "", property: "" }
                  : key === "fo"
                    ? { property: "" }
                    : {}),
              })
            }
            options={[
              { value: "", label: "Alla" },
              ...values.map((v) => ({ value: v.id, label: v.name })),
            ]}
            searchLabel={`Sök ${label.toLowerCase()}`}
            emptyMessage="Inga träffar"
            placeholder="Alla"
          />
        </div>
      ))}
      <Button variant="ghost" onClick={() => onChange({ ...emptyFilters })}>
        Rensa filter
      </Button>
    </div>
  );
}
