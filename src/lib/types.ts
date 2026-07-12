export const skillCategories = [
  "Music",
  "Coding",
  "Language",
  "Design",
  "Fitness",
  "Cooking",
  "Art",
  "Business",
  "Other",
] as const;

export const skillLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export type SkillCategory = (typeof skillCategories)[number];
export type SkillLevel = (typeof skillLevels)[number];

export type Member = {
  _id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  creditBalance: number;
  averageRating: number;
  sessionsCompleted: number;
  skillsOffered?: Array<{ skillName: string; category: SkillCategory; level: SkillLevel }>;
  skillsWanted?: Array<{ skillName: string; category: SkillCategory }>;
};

export type Listing = {
  _id: string;
  title: string;
  category: SkillCategory;
  tags: string[];
  description: string;
  level: SkillLevel;
  availability: Array<{ day: string; timeSlots: string[] }>;
  imageUrl?: string;
  status: "Active" | "Paused";
  createdAt: string;
  teacher: Pick<Member, "_id" | "name" | "avatarUrl" | "location" | "averageRating" | "sessionsCompleted">;
};

export type Session = {
  _id: string;
  listing: Pick<Listing, "_id" | "title" | "category">;
  teacher: Pick<Member, "_id" | "name" | "avatarUrl" | "location">;
  learner: Pick<Member, "_id" | "name" | "avatarUrl" | "location">;
  skillName: string;
  proposedTime: string;
  durationHours: number;
  status: "Requested" | "Confirmed" | "Completed" | "Cancelled" | "Declined";
  teacherConfirmedComplete: boolean;
  learnerConfirmedComplete: boolean;
  createdAt: string;
};

export type Transaction = {
  _id: string;
  createdAt: string;
  skillName: string;
  credits: number;
  type: "Earned" | "Spent";
  counterparty: Pick<Member, "_id" | "name">;
  runningBalance?: number;
};

export type DashboardData = {
  member: Member;
  transactions: Transaction[];
  upcomingSessions: Session[];
  creditHistory: Array<{ date: string; earned: number; spent: number }>;
  categoryBreakdown: Array<{ name: string; value: number }>;
};
