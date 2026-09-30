import type { MasterData } from "../domain/types";
import { supabase } from "../lib/supabase";
import { createSeedData } from "./seed";

export interface MasterDataProvider {
  getBusinessAreas(): Promise<MasterData["business_areas"]>;
  getManagementAreas(
    businessAreaId?: string,
  ): Promise<MasterData["management_areas"]>;
  getProperties(managementAreaId?: string): Promise<MasterData["properties"]>;
}
export const mockMasterDataProvider: MasterDataProvider = {
  async getBusinessAreas() {
    return createSeedData().business_areas;
  },
  async getManagementAreas(id) {
    return createSeedData().management_areas.filter(
      (v) => !id || v.business_area_id === id,
    );
  },
  async getProperties(id) {
    return createSeedData().properties.filter(
      (v) => !id || v.management_area_id === id,
    );
  },
};
async function read<T>(
  table: string,
  column?: string,
  id?: string,
): Promise<T[]> {
  if (!supabase) throw new Error("Supabase är inte konfigurerat.");
  let query = supabase.from(table).select("*").order("name");
  if (column && id) query = query.eq(column, id);
  const { data, error } = await query;
  if (error) throw new Error(`Masterdata kunde inte läsas: ${error.message}`);
  return data as T[];
}
export const supabaseMasterDataProvider: MasterDataProvider = {
  getBusinessAreas: () => read("business_areas"),
  getManagementAreas: (id) => read("management_areas", "business_area_id", id),
  getProperties: (id) => read("properties", "management_area_id", id),
};
export const masterData: MasterDataProvider = supabase
  ? supabaseMasterDataProvider
  : mockMasterDataProvider;
// Manual test only. A future server-side adapter will synchronize Dalux into
// Supabase; neither this provider nor React will hold Dalux credentials.
export const masterDataSync = {
  async sync() {
    const [areas, management, properties] = await Promise.all([
      masterData.getBusinessAreas(),
      masterData.getManagementAreas(),
      masterData.getProperties(),
    ]);
    return {
      mode: "mock" as const,
      completedAt: new Date().toISOString(),
      counts: [areas.length, management.length, properties.length],
    };
  },
};
