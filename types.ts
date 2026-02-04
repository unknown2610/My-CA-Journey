export enum CourseLevel {
  Foundation = 'Foundation',
  Intermediate = 'Intermediate',
  Final = 'Final',
}

export enum EntryRoute {
  Foundation = 'Foundation Route',
  DirectEntry = 'Direct Entry Route',
}

export enum Status {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Exempted = 'Exempted',
  Failed = 'Failed',
}

export interface Subject {
  id: string;
  name: string;
  marks?: number;
  status: Status;
  isElective?: boolean;
}

export interface Group {
  id: string;
  name: string;
  subjects: Subject[];
  status: Status; // Derived from subjects
  attemptNumber?: number;
}

export interface TrainingModule {
  id: string;
  name: string;
  duration: string; // e.g., "4 Weeks", "2 Years"
  status: Status;
  startDate?: string;
  endDate?: string;
  requiredForLevel: CourseLevel;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
}

// Exam History Types
export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  marks: number;
  isExempt: boolean;
}

export interface AttemptGroup {
  name: string; // "Group 1", "Group 2", or "Foundation"
  status: 'Pass' | 'Fail';
  subjects: SubjectResult[];
  totalMarks: number;
}

export interface ExamAttempt {
  id: string;
  level: CourseLevel;
  term: string; // e.g., "May 2024"
  attemptNumber: number;
  groups: AttemptGroup[];
}

export interface UserData {
  name: string;
  state: string; // New Field
  entryRoute: EntryRoute;
  registrationDate: string;
  currentLevel: CourseLevel;
  foundation: {
    papers: Subject[];
    status: Status;
  };
  intermediate: {
    group1: Group;
    group2: Group;
    icitss: TrainingModule; // IT + OC
  };
  articleship: {
    status: Status;
    startDate?: string;
    endDate?: string;
    leavesTaken: number;
    industrialTraining: boolean;
  };
  selfPacedModules: {
    setA: Subject; // Corporate & Economic Laws
    setB: Subject; // Strategic Cost & Performance Management
    setC: Subject; // Elective
    setD: Subject; // Multi-disciplinary (Const. of India etc)
  };
  final: {
    group1: Group;
    group2: Group;
    advIcitss: TrainingModule; // Adv IT + MCS
  };
  attempts: ExamAttempt[]; 
}

// Peer Interface (Subset of UserData for public view)
export type PeerProfile = Omit<UserData, 'attempts'> & {
  id: string;
  progressPercentage: number;
};
