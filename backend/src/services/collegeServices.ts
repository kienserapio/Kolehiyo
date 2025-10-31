import { supabase } from '../utils/supabase';

interface EntranceExam {
    exam_date_start: string;
    exam_date_end: string;
    exam_coverage: string;
}

interface ReviewResource {
    mockExamLinks: { text: string; link: string; }[];
    reviewerLinks: { text: string; link: string; }[];
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
  review_links: ReviewResource;
  last_updated: string;
  logo_url: string;
  header_image_url: string;
  top_programs: string[];
}

interface TrackedCollege {
  tracker_id: number;
  user_id: string;
  college_id: string;
  status: string;
  checklist: string[];
  progress: number;
}

// --- Public Data Functions (No user ID needed) ---

/**
 * Fetches the master list of all public colleges.
 * This is for the "Find the College for You!" page.
 */
export const getPublicCollegeList = async () => {
  // TODO: implement fetching public college list from Supabase
  // Placeholder - to be implemented later
  throw new Error('getPublicCollegeList not implemented');
};

/**
 * Fetches the detailed information for a single public college.
 * This is for the sidebar modal when a user clicks on a college card.
 */
export const getPublicCollegeDetails = async (collegeId: string) => {
  // TODO: implement fetching single college details from Supabase
  // Placeholder - to be implemented later
  throw new Error('getPublicCollegeDetails not implemented');
};

// --- User-Specific Tracker Functions (User ID required) ---

/**
 * Fetches the full college details for all colleges a user is tracking.
 * This function "joins" the user's tracker with the master college list.
 * This is for the user's personal dashboard.
 */
export const getTrackedColleges = async (userId: string) => {
  // TODO: implement fetching tracked colleges (join user_tracked_colleges -> colleges)
  // Placeholder - to be implemented later
  throw new Error('getTrackedColleges not implemented');
};

/**
 * Adds a college to a user's personal tracker (clicks "Add to Board").
 * It first checks to prevent adding the same college twice.
 */
export const addCollegeToTracker = async (userId: string, collegeId: string) => {
  // TODO: implement addCollegeToTracker (check existing -> insert)
  // Placeholder - to be implemented later
  throw new Error('addCollegeToTracker not implemented');
};

/**
 * Removes a college from a user's personal tracker.
 */
export const removeCollegeFromTracker = async (userId: string, collegeId: string) => {
  // TODO: implement removeCollegeFromTracker (delete join row)
  // Placeholder - to be implemented later
  throw new Error('removeCollegeFromTracker not implemented');
};

/**
 * Updates the user's progress for a specific tracked college.
 * (e.g., changes status from 'tracking' to 'applying')
 */
export const updateTrackerStatus = async (userId: string, collegeId: string, newStatus: string) => {
  // TODO: implement updateTrackerStatus (validate status -> update row)
  // Placeholder - to be implemented later
  throw new Error('updateTrackerStatus not implemented');
};
