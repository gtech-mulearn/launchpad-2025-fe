export interface InterestGroup {
  id: string;
  name: string;
  icon?: string;
  code?: string;
  category?: string;
  members?: number;
  updated_by?: string;
  updated_at?: string;
  created_by?: string;
  created_at?: string;
}

export interface KarmaDistribution {
  task_type: string;
  karma: number;
}

export interface JobOffer {
  id: string;
  title: string;
  company_id: string;
  salaryRange: string | null;
  location: string | null;
  experience: string | null;
  skills: string | null;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | null;
  interestGroups: string;
  minKarma: number;
  task_id: string | null;
  task_description: string | null;
  task_hashtag: string | null;
  task_verified: boolean | null;
  createdAt: string;
  openingType: 'General' | 'Task' | null;
}

export interface JobInvite {
  id: number;
  candidateId?: string; 
  jobId?: string;
  application_id?: string;
  candidateName: string;
  title: string;
  company_id: string;
  salaryRange: string | null;
  location: string | null;
  experience: string | null;
  skills: string | null;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | null;
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'hired';
  interestGroups: string;
  minKarma: number;
  task_id: string | null;
  task_description: string | null;
  task_hashtag: string | null;
  task_verified: boolean | null;
  sentDate: string;
  updatedAt: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewPlatform?: string;
  interviewLink?: string;
   resume_link?: string; 
  linkedin_link?: string; 
  portfolio_link?: string; 
  cover_letter?: string; 
  other_link?: string; 
  openingType: 'General' | 'Task' | null;
}

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  muid: string;
  profile_pic: string | null;
  karma: number;
  level: string;
  college_name: string;
  interest_groups: InterestGroup[];
  roles: string[];
  rank: number;
  karma_distribution: KarmaDistribution[];
}


export interface InterviewDetails {
  application_id: string; 
  interview_date: string; 
  interview_time: string; 
  interview_platform: string; 
  interview_link: string; 
}
