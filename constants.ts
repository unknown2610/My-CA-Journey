import { UserData, EntryRoute, CourseLevel, Status, PeerProfile } from './types';

// Based on Prospectus Page 16 (Foundation), 19 (Inter Subjects), 20 (Final Subjects), 53 (SPOM)

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export const MOTIVATIONAL_QUOTES = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The distance between dreams and reality is called discipline.",
  "Don't watch the clock; do what it does. Keep going.",
  "Hard work beats talent when talent doesn't work hard.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Your positive action combined with positive thinking results in success.",
  "Success represents the 1% of your work which results from the 99% that is called failure.",
  "CA is not just a course, it's a journey of character building.",
  "Discipline is the bridge between goals and accomplishment.",
  "Dream it. Wish it. Do it.",
  "Great things never come from comfort zones.",
  "Push yourself, because no one else is going to do it for you.",
  "Suffer now and live the rest of your life as a champion.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It’s going to be hard, but hard does not mean impossible.",
  "Don’t wait for opportunity. Create it.",
  "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream bigger. Do bigger.",
  "Don't tell people your plans. Show them your results.",
  "There are no shortcuts to any place worth going.",
  "Consistency is what transforms average into excellence.",
  "Focus on being productive instead of busy.",
  "You don’t have to be great to start, but you have to start to be great.",
  "Action is the foundational key to all success.",
  "The only way to do great work is to love what you do.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "If it doesn't challenge you, it doesn't change you.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "Start where you are. Use what you have. Do what you can.",
  "Excellence is not a skill. It is an attitude.",
  "Hustle in silence and let your success make the noise.",
  "Your limitation—it’s only your imagination.",
  "Failure is the tuition you pay for success.",
  "Patience, Persistence, and Perspiration make an unbeatable combination for success.",
  "The Chartered Accountant is the conscience keeper of the national economy.",
  "Audit your own time before you audit others.",
  "Assets = Liabilities + Equity. Success = Hard Work + Determination.",
  "Debit your distractions, Credit your focus.",
  "Balance Sheet of Life: Assets - Friends, Family, Health; Liabilities - Ego, Anger.",
  "Every signature of yours is a testimony of truth.",
  "Quality is never an accident. It is always the result of intelligent effort.",
  "Stay focus and never give up.",
  "Determination today leads to success tomorrow.",
  "You are capable of more than you know."
];

export const MOCK_PEERS: PeerProfile[] = [];

export const INITIAL_USER_DATA: UserData = {
  name: 'Student',
  state: '',
  entryRoute: EntryRoute.Foundation,
  registrationDate: new Date().toISOString().split('T')[0],
  currentLevel: CourseLevel.Foundation,
  foundation: {
    status: Status.Pending,
    papers: [
      { id: 'F1', name: 'Paper 1: Accounting', status: Status.Pending },
      { id: 'F2', name: 'Paper 2: Business Laws', status: Status.Pending },
      { id: 'F3', name: 'Paper 3: Quantitative Aptitude', status: Status.Pending },
      { id: 'F4', name: 'Paper 4: Business Economics', status: Status.Pending },
    ],
  },
  intermediate: {
    group1: {
      id: 'IG1',
      name: 'Group 1',
      status: Status.Pending,
      subjects: [
        { id: 'I1', name: 'Paper 1: Advanced Accounting', status: Status.Pending },
        { id: 'I2', name: 'Paper 2: Corporate and Other Laws', status: Status.Pending },
        { id: 'I3', name: 'Paper 3: Taxation', status: Status.Pending },
      ],
    },
    group2: {
      id: 'IG2',
      name: 'Group 2',
      status: Status.Pending,
      subjects: [
        { id: 'I4', name: 'Paper 4: Cost and Management Accounting', status: Status.Pending },
        { id: 'I5', name: 'Paper 5: Auditing and Ethics', status: Status.Pending },
        { id: 'I6', name: 'Paper 6: FM & SM', status: Status.Pending },
      ],
    },
    icitss: {
      id: 'ICITSS',
      name: 'Integrated Course on IT and Soft Skills (ICITSS)',
      duration: '4 Weeks',
      status: Status.Pending,
      requiredForLevel: CourseLevel.Intermediate, // Prerequisite for Articleship
    },
  },
  articleship: {
    status: Status.Pending,
    leavesTaken: 0,
    industrialTraining: false,
  },
  selfPacedModules: {
    setA: { id: 'SPOM_A', name: 'Set A: Corporate and Economic Laws', status: Status.Pending },
    setB: { id: 'SPOM_B', name: 'Set B: Strategic Cost & Performance Mgmt', status: Status.Pending },
    setC: { id: 'SPOM_C', name: 'Set C: Elective (Specialization)', status: Status.Pending },
    setD: { id: 'SPOM_D', name: 'Set D: Multi-disciplinary', status: Status.Pending },
  },
  final: {
    group1: {
      id: 'FG1',
      name: 'Group 1',
      status: Status.Pending,
      subjects: [
        { id: 'Fin1', name: 'Paper 1: Financial Reporting', status: Status.Pending },
        { id: 'Fin2', name: 'Paper 2: Advanced Financial Management', status: Status.Pending },
        { id: 'Fin3', name: 'Paper 3: Advanced Auditing, Assurance & Ethics', status: Status.Pending },
      ],
    },
    group2: {
      id: 'FG2',
      name: 'Group 2',
      status: Status.Pending,
      subjects: [
        { id: 'Fin4', name: 'Paper 4: Direct Tax Laws & Intl Taxation', status: Status.Pending },
        { id: 'Fin5', name: 'Paper 5: Indirect Tax Laws', status: Status.Pending },
        { id: 'Fin6', name: 'Paper 6: Integrated Business Solutions', status: Status.Pending },
      ],
    },
    advIcitss: {
      id: 'ADVICITSS',
      name: 'Advanced ICITSS',
      duration: '4 Weeks',
      status: Status.Pending,
      requiredForLevel: CourseLevel.Final,
    },
  },
  attempts: [],
};

// Colors for UI
export const LEVEL_COLORS = {
  [CourseLevel.Foundation]: 'border-blue-500 text-blue-600',
  [CourseLevel.Intermediate]: 'border-purple-500 text-purple-600',
  [CourseLevel.Final]: 'border-emerald-500 text-emerald-600',
};

export const STATUS_COLORS = {
  [Status.Pending]: 'bg-gray-100 text-gray-500',
  [Status.InProgress]: 'bg-yellow-100 text-yellow-700',
  [Status.Completed]: 'bg-green-100 text-green-700',
  [Status.Exempted]: 'bg-indigo-100 text-indigo-700',
  [Status.Failed]: 'bg-red-100 text-red-700',
};
