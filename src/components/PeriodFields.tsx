import { DatePicker, Input, Label, Slider } from "@hufvudstaden/design-system";
import { sv } from "date-fns/locale";
import type { Allocation } from "../domain/types";

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field">
      <Label>{label}</Label>
      <DatePicker
        locale={sv}
        aria-label={label}
        selected={value ? new Date(`${value}T12:00:00`) : undefined}
        onSelect={(date) =>
          onChange(
            date
              ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
              : "",
          )
        }
        formatDate={(date) => date.toLocaleDateString("sv-SE")}
        placeholder="Välj datum"
        calendarLabel={`Välj ${label.toLowerCase()}`}
        calendarProps={{ weekStartsOn: 1 }}
      />
    </div>
  );
}
export function PeriodFields({
  value,
  onChange,
}: {
  value: Allocation;
  onChange: (value: Allocation) => void;
}) {
  return (
    <div className="period-fields">
      <div className="form-grid">
        <DateField
          label="Startdatum"
          value={value.start_date}
          onChange={(start_date) => onChange({ ...value, start_date })}
        />
        <DateField
          label="Slutdatum"
          value={value.end_date}
          onChange={(end_date) => onChange({ ...value, end_date })}
        />
      </div>
      <div className="field">
        <Label htmlFor={`percent-${value.id}`}>Belastning (%)</Label>
        <div className="percentage-control">
          <Slider
            min={0}
            max={200}
            step={5}
            value={[Number.isFinite(value.percentage) ? value.percentage : 0]}
            onValueChange={([percentage]) => onChange({ ...value, percentage })}
            thumbLabels={["Belastning i procent"]}
          />
          <Input
            id={`percent-${value.id}`}
            type="number"
            min={0}
            max={200}
            step="any"
            value={Number.isFinite(value.percentage) ? value.percentage : ""}
            onChange={(event) =>
              onChange({
                ...value,
                percentage:
                  event.target.value === "" ? NaN : Number(event.target.value),
              })
            }
          />
        </div>
        <small>
          {Number.isFinite(value.percentage)
            ? `≈ ${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(value.percentage / 20)} dagar/vecka`
            : "Ange en belastning"}
          {value.percentage === 100 ? " · heltid" : ""}
        </small>
        {value.percentage > 100 && (
          <p className="conflict-note" role="status">
            Över kapacitet med {value.percentage - 100} %. Värdet går att spara.
          </p>
        )}
      </div>
    </div>
  );
}
