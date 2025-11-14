import { supabase } from '../utils/supabase';

interface ChecklistItem {
  item: string;
  checked: boolean;
}

interface PublicScholarshipCard {
  id: string;
  name: string;
  address: string;
  application_start: string;
  application_end: string;
  scho_type: string;
  benefits: string;
  logo_url: string;
  application_status: string;
}

interface PublicScholarship {
  id: string;
  name: string;
  scho_requirements: string[];
  application_start: string;
  official_link: string;
  guides: string[]; 
  application_end: string;
  reco_links: string[];
  benefits: string;
  scho_type: string;
  prio_programs: string[]; 
  email: string;
  contact_num: string;
  location: string;
  address: string;
  logo_url: string;
  header_image_url: string;
  application_status: string;
}

interface TrackedScholarship {
  tracker_id: number;
  user_id: string;
  scholarship_id: string;
  status: string;
  checklist: ChecklistItem[];
  progress: number;
}

const parseArrayField = (raw: any) => {
  if (!raw) return [] as string[];
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }
  return [] as string[];
};

export const getPublicScholarshipList = async () => {
  const DBtable = 'scholarships';
  
  const query = 'id, name, address, application_start, application_end, scho_type, benefits, logo_url, application_status';

  try {
    const { data, error } = await supabase
      .from(DBtable)
      .select(query);

    if (error) {
      console.warn(`SUPABASE: getPublicScholarshipList - table=${DBtable} error=`, error.message);
    }

    const remappedData = data?.map(s => ({
        id: s.id,
        name: s.name ?? '',
        address: s.address ?? '',
        application_start: s.application_start ?? '',
        application_end: s.application_end ?? '',
        scho_type: s.scho_type ?? '',
        benefits: s.benefits ?? '',
        logo_url: s.logo_url ?? '',
        application_status: s.application_status ?? '',
    })) ?? [];

    return remappedData as PublicScholarshipCard[];
  } catch (err: any) {
    console.warn(`getPublicScholarshipList: unexpected error querying ${DBtable}:`, err?.message ?? err);
    throw new Error('getPublicScholarshipList: no scholarships table found or all queries failed');
  }
};

export const getPublicScholarshipDetails = async (scholarship_id: string) => {
    const DBtable = 'scholarships';

    try {
        const { data, error } = await supabase
        .from(DBtable)
        .select('*')
        .eq('id', scholarship_id)
        .single();

        if (error) {
        console.warn(`SUPABASE: getPublicScholarshipDetails - table=${DBtable} id=${scholarship_id} error=`, error.message);
        throw new Error(`Failed to fetch scholarship details: ${error.message}`);
        }

        if (!data) {
        throw new Error('Scholarship not found');
        }

        const row: any = data;

        const scholarship: PublicScholarship = {
        id: String(row.id),
        name: row.name ?? '',
        scho_requirements: parseArrayField(row.scho_requirements),
        application_start: row.application_start ?? '',
        official_link: row.official_link ?? '',
        guides: parseArrayField(row.guides),
        application_end: row.application_end ?? '',
        reco_links: parseArrayField(row.reco_links),
        benefits: row.benefits ?? '',
        scho_type: row.scho_type ?? '',
        prio_programs: parseArrayField(row.prio_programs),
        email: row.email ?? '',
        contact_num: row.contact_num ?? '',
        location: row.location ?? '',
        address: row.address ?? '',
        logo_url: row.logo_url ?? '',
        header_image_url: row.header_image_url ?? '',
        application_status: row.application_status ?? '',
        };

        return scholarship;
    } catch (err: any) {
        console.warn(`getPublicScholarshipDetails: unexpected error querying ${DBtable} id=${scholarship_id}:`, err?.message ?? err);
        throw err;
    }
    };

export const getTrackedScholarships = async (userId: string): Promise<Array<TrackedScholarship & { scholarship: PublicScholarshipCard | null }>> => {
  const trackerTable = 'user_scholarship_tracker';
  const scholarshipTable = 'scholarships';

  const joinQuery = `
    *,
    ${scholarshipTable}(
      id, name, address, application_start, application_end, scho_type, benefits, logo_url, application_status
    )
  `;

  try {
    const { data, error } = await supabase
      .from(trackerTable)
      .select(joinQuery)
      .eq('auth_user_id', userId);

    if (error) {
      console.warn(`SUPABASE: getTrackedScholarships - table=${trackerTable} error=`, error.message);
      throw new Error(`Failed to fetch tracked scholarships: ${error.message}`);
    }

    if (!data) return [];

    const tracked = data.map((row: any) => {
      const joined = row.scholarships;
      
      const s = joined ? {
        id: row.scholarship_id,
        name: joined.name ?? '',
        address: joined.address ?? '',
        application_start: joined.application_start ?? '',
        application_end: joined.application_end ?? '',
        scho_type: joined.scho_type ?? '',
        benefits: joined.benefits ?? '',
        logo_url: joined.logo_url ?? '',
        application_status: joined.application_status ?? '',
      } as PublicScholarshipCard : null;

      return {
        tracker_id: row.tracker_id ?? row.id ?? null,
        user_id: row.user_id ?? row.auth_user_id,
        scholarship_id: row.scholarship_id,
        status: row.status ?? 'Open',
        checklist: (Array.isArray(row.checklist) ? row.checklist : []) as ChecklistItem[],
        progress: typeof row.progress === 'number' ? row.progress : Number(row.progress) || 0,
        scholarship: s,
      };
    });

    return tracked;
  } catch (err: any) {
    console.warn(`getTrackedScholarships: unexpected error for user ${userId}:`, err?.message ?? err);
    return [];
  }
};

export const addScholarshipToTracker = async (userId: string, scholarshipId: string) => {
  const trackerTable = 'user_scholarship_tracker';

  try {
    const { data: existing, error: checkError } = await supabase
      .from(trackerTable)
      .select('tracker_id')
      .eq('auth_user_id', userId)
      .eq('scholarship_id', scholarshipId)
      .limit(1);

    if (checkError) {
      throw new Error(`Failed to check existing tracker: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.warn(`User ${userId} is already tracking scholarship ${scholarshipId}.`);
      return existing[0];
    }

    const scholarship = await getPublicScholarshipDetails(scholarshipId);
    if (!scholarship) throw new Error('Scholarship not found');

    const newChecklist: ChecklistItem[] = scholarship.scho_requirements.map((req) => ({ 
      item: req, 
      checked: false 
    }));

    const defaultStatus = scholarship.application_status ?? 'Open'; 

    const { data, error } = await supabase
      .from(trackerTable)
      .insert({
        // only `auth_user_id` is used by the schema
        auth_user_id: userId,
        scholarship_id: scholarshipId,
        status: defaultStatus,
        checklist: newChecklist,
        progress: 0,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add scholarship to tracker: ${error.message}`);

    return data;
  } catch (err: any) {
    console.error(`addScholarshipToTracker: unexpected error:`, err?.message ?? err);
    throw err;
  }
};

export const removeScholarshipFromTracker = async (userId: string, scholarshipId: string) => {
  const trackerTable = 'user_scholarship_tracker';

  try {
    const { data: existing, error: checkError } = await supabase
      .from(trackerTable)
      .select('*')
      .eq('auth_user_id', userId)
      .eq('scholarship_id', scholarshipId)
      .limit(1);

    if (checkError) throw new Error(`Failed to query existing tracker: ${checkError.message}`);

    if (!existing || existing.length === 0) return null;

    const trackerRow = existing[0] as any;
    const trackerId = trackerRow.tracker_id ?? trackerRow.id ?? null;

    if (trackerId != null) {
      const { data, error } = await supabase
        .from(trackerTable)
        .delete()
        .eq('tracker_id', trackerId)
        .select()
        .single();

      if (error) throw new Error(`Failed to delete tracker row: ${error.message}`);
      return data;
    }

    const { data, error } = await supabase
      .from(trackerTable)
      .delete()
      .match({ auth_user_id: userId, scholarship_id: scholarshipId })
      .select();

    if (error) throw new Error(`Failed to delete tracker row: ${error.message}`);
    return data;
  } catch (err: any) {
    console.error(`removeScholarshipFromTracker: unexpected error:`, err?.message ?? err);
    throw err;
  }
};

export const updateScholarshipTrackerChecklist = async (
  trackerId: number,
  newChecklist: ChecklistItem[]
) => {
  const trackerTable = 'user_scholarship_tracker';
  const total = newChecklist.length;
  const completed = newChecklist.filter(item => item.checked).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  try {
    const { data, error } = await supabase
      .from(trackerTable)
      .update({ checklist: newChecklist, progress: progress })
      .eq('tracker_id', trackerId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update checklist: ${error.message}`);
    return data;
  } catch (err: any) {
    console.error(`updateScholarshipTrackerChecklist: unexpected error:`, err?.message ?? err);
    throw err;
  }
};
