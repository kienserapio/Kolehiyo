import { supabase } from '../utils/supabase';

interface EntranceExam {
    exam_date_start: string;
    exam_date_end: string;
    exam_coverage: string;
}

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface PublicCollegeCard{
  id: string;
  name: string;
  application_status: string;
  application_start: string;
  application_end: string;
  university_type: string;
  tuition_fee: string;
  logo_url: string;
  address: string;
}

interface PublicCollege {
  id: string;
  name: string;
  address: string;
  application_status: string;
  application_start: string;
  application_end: string;
  requirements: string[];
  university_type: string;
  tuition_fee: string;
  entrance_exam: EntranceExam;
  official_link: string;
  review_links: string[];
  logo_url: string;
  header_image_url: string;
  top_programs: string[];
  mock_exam: string[];
  contact_num: string;
  email: string;
  location: string;
}

interface TrackedCollege {
  tracker_id: number;
  user_id: string;
  college_id: string;
  status: string;
  checklist: ChecklistItem[];
  progress: number;
}

export const getPublicCollegeList = async () => { 
  const DBtable = 'college';

  const query = 'id, name, application_status, application_start, application_end, university_type, tuition_fee, logo_url, address';

    try {
      const { data, error } = await supabase
      .from(DBtable)
      .select(query);

      if (error) {
        console.warn(`SUPABASE: getPublicCollegeList - table=${DBtable} error=`, error.message);
      }

      return (data ?? []) as PublicCollegeCard[];
    } catch (err: any) {

      console.warn(`getPublicCollegeList: unexpected error querying ${DBtable}:`, err?.message ?? err);

      throw new Error('getPublicCollegeList: no colleges table found or all queries failed');
    }
};

export const getPublicCollegeDetails = async (college_id: string) => {
  const DBtable = 'college';

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

  try {
    const { data, error } = await supabase
      .from(DBtable)
      .select('*')
      .eq('id', college_id)
      .single();

    if (error) {
      console.warn(`SUPABASE: getPublicCollegeDetails - table=${DBtable} id=${college_id} error=`, error.message);
      throw new Error(`Failed to fetch college details: ${error.message}`);
    }

    if (!data) {
      throw new Error('College not found');
    }

    const row: any = data;

    const entranceRaw = row.entrance_exam ?? {};

    const entrance_exam = {
      exam_date_start: entranceRaw?.exam_date_start ?? '',
      exam_date_end: entranceRaw?.exam_date_end ?? '',
      exam_coverage: entranceRaw?.exam_coverage ?? '',
    } as EntranceExam;
    
    const review_links = parseArrayField(
      row.review_links ?? row.reviewLinks ?? row.reviews
    );
    const mock_exam = parseArrayField(
      row.mock_exam ?? row.mockExam ?? row.mock_exam_links
    );

    const publicCollege: PublicCollege = {
      id: String(row.id),
      name: row.name ?? '',
      address: row.address ?? '',
      application_status: row.application_status ?? '',
      application_start: row.application_start ?? '',
      application_end: row.application_end ?? '',
      requirements: parseArrayField(row.requirements ?? row.requirements_list ?? row.requirement_list),
      university_type: row.university_type ?? '',
      tuition_fee: row.tuition_fee ?? '',
      entrance_exam,
      official_link: row.official_link ?? row.officialUrl ?? row.official_url ?? '',
      review_links,
      mock_exam,
      logo_url: row.logo_url ?? row.logoUrl ?? '',
      header_image_url: row.header_image_url ?? row.headerImageUrl ?? row.header_image ?? '',
      top_programs: parseArrayField(row.top_programs ?? row.topPrograms ?? row.top_program ?? []),
      contact_num: row.contact_num ?? '',
      email: row.email ?? '',
      location: row.location ?? '', 
    } as PublicCollege;

    return publicCollege;
  } catch (err: any) {
    console.warn(`getPublicCollegeDetails: unexpected error querying ${DBtable} id=${college_id}:`, err?.message ?? err);
    throw err;
  }
};

export const getTrackedColleges = async (userId: string): Promise<Array<TrackedCollege & { college: PublicCollegeCard | null }>> => {
  const trackerTable = 'user_college_tracker';
  const collegeTable = 'college';

  const joinQuery = `
    *, 
    ${collegeTable}(
      id, name, application_status, application_start, application_end, university_type, tuition_fee, logo_url, address
    )
  `;

  try {
    const { data, error } = await supabase
      .from(trackerTable)
      .select(joinQuery)
      .eq('auth_user_id', userId);

    if (error) {
      console.warn(`SUPABASE: getTrackedColleges - table=${trackerTable} error=`, error.message);
      throw new Error(`Failed to fetch tracked colleges: ${error.message}`);
    }

    if (!data) {
      return []; 
    }

    const trackedColleges = data.map((row: any) => {
      
      const collegeData = row.college ? {
        id: row.college.id,
        name: row.college.name ?? '',
        application_status: row.college.application_status ?? '',
        application_start: row.college.application_start ?? '',
        application_end: row.college.application_end ?? '',
        university_type: row.college.university_type ?? '',
        tuition_fee: row.college.tuition_fee ?? '',
        logo_url: row.college.logo_url ?? '',
        address: row.college.address ?? '',
      } as PublicCollegeCard : null;

      return {
        tracker_id: row.tracker_id ?? row.id ?? null,
        user_id: row.user_id,
        college_id: row.college_id,
        status: row.status ?? 'Open',
        checklist: (Array.isArray(row.checklist) ? row.checklist : []) as ChecklistItem[],
        progress: typeof row.progress === 'number' ? row.progress : Number(row.progress) || 0,
        college: collegeData,
      };
    });

    return trackedColleges;

  } catch (err: any) {
    console.warn(`getTrackedColleges: unexpected error for user ${userId}:`, err?.message ?? err);
    return []; 
  }
};

export const addCollegeToTracker = async (userId: string, collegeId: string) => {
  const trackerTable = 'user_college_tracker';

  try {
    const { data: existing, error: checkError } = await supabase
      .from(trackerTable)
      .select('tracker_id')
      .eq('auth_user_id', userId)
      .eq('college_id', collegeId)
      .limit(1);

    if (checkError) {
      throw new Error(`Failed to check existing tracker: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.warn(`User ${userId} is already tracking college ${collegeId}.`);
      return existing[0]; 
    }

    const college = await getPublicCollegeDetails(collegeId);
    if (!college) {
      throw new Error('College not found');
    }

    const newChecklist: ChecklistItem[] = college.requirements.map((req) => ({
      text: req,
      checked: false,
    }));

    const defaultStatus = college.application_status ?? 'Open'; 

    const { data, error } = await supabase
      .from(trackerTable)
      .insert({
        auth_user_id: userId,
        college_id: collegeId,
        status: defaultStatus,
        checklist: newChecklist, 
        progress: 0, 
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add college to tracker: ${error.message}`);
    }

    return data;
  } catch (err: any) {
    console.error(`addCollegeToTracker: unexpected error:`, err?.message ?? err);
    throw err;
  }
};

export const removeCollegeFromTracker = async (userId: string, collegeId: string) => {
  const trackerTable = 'user_college_tracker';

  try {
    const { data: existing, error: checkError } = await supabase
      .from(trackerTable)
      .select('*')
      .eq('auth_user_id', userId)
      .eq('college_id', collegeId)
      .limit(1);

    if (checkError) {
      throw new Error(`Failed to query existing tracker: ${checkError.message}`);
    }

    if (!existing || existing.length === 0) {
      return null;
    }

    const trackerRow = existing[0] as any;
    const trackerId = trackerRow.tracker_id ?? trackerRow.id ?? null;

    if (trackerId != null) {
      const { data, error } = await supabase
        .from(trackerTable)
        .delete()
        .eq('tracker_id', trackerId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to delete tracker row: ${error.message}`);
      }

      return data;
    }

    const { data, error } = await supabase
      .from(trackerTable)
      .delete()
      .match({ user_id: userId, college_id: collegeId })
      .select();

    if (error) {
      throw new Error(`Failed to delete tracker row: ${error.message}`);
    }

    return data;
  } catch (err: any) {
    console.error(`removeCollegeFromTracker: unexpected error:`, err?.message ?? err);
    throw err;
  }
};

export const updateTrackerChecklist = async (
  trackerId: number, 
  newChecklist: ChecklistItem[]
) => {
  const trackerTable = 'user_college_tracker';
  const total = newChecklist.length;
  const completed = newChecklist.filter(item => item.checked).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  try {
    const { data, error } = await supabase
      .from(trackerTable)
      .update({ 
        checklist: newChecklist,
        progress
      })
      .eq('tracker_id', trackerId)
      .select();

    if (error) {
      throw new Error(`Failed to update checklist: ${error.message}`);
    }

    return data;
  } catch (err: any) {
    console.error(`updateTrackerChecklist: unexpected error:`, err?.message ?? err);
    throw err;
  }
};