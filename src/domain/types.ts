export interface NamedValue {
  id: string;
  name: string;
  active: boolean;
}
export interface BusinessArea extends NamedValue {
  external_id: string | null;
}
export interface ManagementArea extends NamedValue {
  external_id: string | null;
  business_area_id: string | null;
}
export interface Property extends NamedValue {
  external_id: string | null;
  property_number: string;
  estate_external_id: string | null;
  business_area_id: string;
  management_area_id: string;
}
export interface Classification extends NamedValue {
  sort_order: number;
}
export interface Person extends NamedValue {
  type: "internal" | "external";
}
export interface Project {
  id: string;
  external_id: string | null;
  project_number: string;
  name: string;
  property_id: string;
  status_id: string;
  project_type_id: string;
  comment: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
}
export interface ProjectPerson {
  id: string;
  project_id: string;
  person_id: string;
  role: "project_manager" | "consultant" | "other";
}
export interface Allocation {
  id: string;
  project_person_id: string;
  start_date: string;
  end_date: string;
  percentage: number;
}
export interface ProjectLevel {
  project_id: string;
  level_id: string;
}
export interface MasterData {
  business_areas: BusinessArea[];
  management_areas: ManagementArea[];
  properties: Property[];
}
export interface AppData extends MasterData {
  people: Person[];
  projects: Project[];
  project_people: ProjectPerson[];
  allocations: Allocation[];
  project_statuses: Classification[];
  project_types: Classification[];
  project_levels: Classification[];
  project_level_links: ProjectLevel[];
}
export interface ProjectDraft {
  project: Project;
  people: ProjectPerson[];
  allocations: Allocation[];
  levelIds: string[];
}
export type AdminTable =
  "people" | "project_statuses" | "project_types" | "project_levels";
export interface PlanningFilters {
  person: string;
  ao: string;
  fo: string;
  property: string;
  type: string;
  status: string;
}
export const emptyFilters: PlanningFilters = {
  person: "",
  ao: "",
  fo: "",
  property: "",
  type: "",
  status: "",
};
