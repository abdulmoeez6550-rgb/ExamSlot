// ---------------------------------------------------------------------------
// DEMO DATA ONLY
// ---------------------------------------------------------------------------
// Nothing in this file is connected to the ExamSlot backend, database, or any
// Supabase project. It exists so the student dashboard UI can be built and
// reviewed before the data layer is wired up.
//
// When the real API/auth layer is available, replace these exports with
// server-fetched data and pass it into the section components as props. The
// section components are already prop-driven so no UI rewrite is required.
// ---------------------------------------------------------------------------

export type ExamStatus = "confirmed" | "pending" | "action-required";
export type RequestStatus = "pending" | "approved" | "rejected";
export type SlotStatus = "confirmed" | "awaiting-approval" | "needs-selection";

export interface StudentProfile {
  name: string;
  studentId: string;
  program: string;
  semester: string;
  email: string;
}

export interface UpcomingExam {
  id: string;
  courseCode: string;
  courseTitle: string;
  dateLabel: string;
  timeLabel: string;
  slot: string;
  room: string;
  status: ExamStatus;
}

export interface EnrolledCourse {
  id: string;
  code: string;
  title: string;
  instructor: string;
  creditHours: number;
  slotStatus: SlotStatus;
}

export interface AvailableSlot {
  id: string;
  label: string;
  time: string;
  venue: string;
  seatsLeft: number;
}

export interface CourseSlotOptions {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  options: AvailableSlot[];
}

export interface DateSheetEntry {
  id: string;
  courseCode: string;
  courseTitle: string;
  dateLabel: string;
  timeLabel: string;
  room: string;
}

export interface ChangeRequest {
  id: string;
  courseCode: string;
  courseTitle: string;
  submittedLabel: string;
  status: RequestStatus;
  remarks: string;
}

export const studentProfile: StudentProfile = {
  name: "Ayesha Khan",
  studentId: "S-2026-0148",
  program: "BS Computer Science",
  semester: "Spring 2026",
  email: "ayesha.khan@student.examslot.app",
};

export const overviewStats = {
  enrolledCourses: 5,
  scheduledExams: 4,
  pendingRequests: 1,
};

export const upcomingExams: UpcomingExam[] = [
  {
    id: "ex-301",
    courseCode: "CS-301",
    courseTitle: "Data Structures",
    dateLabel: "Mon, 12 May 2026",
    timeLabel: "09:00 - 11:00",
    slot: "Slot A",
    room: "Hall B-12",
    status: "confirmed",
  },
  {
    id: "ex-305",
    courseCode: "CS-305",
    courseTitle: "Operating Systems",
    dateLabel: "Wed, 14 May 2026",
    timeLabel: "13:00 - 15:00",
    slot: "Slot B",
    room: "Hall A-04",
    status: "confirmed",
  },
  {
    id: "ex-201",
    courseCode: "MA-201",
    courseTitle: "Linear Algebra",
    dateLabel: "Fri, 16 May 2026",
    timeLabel: "09:00 - 11:00",
    slot: "Slot A",
    room: "Hall C-07",
    status: "pending",
  },
  {
    id: "ex-310",
    courseCode: "CS-310",
    courseTitle: "Database Systems",
    dateLabel: "Not scheduled",
    timeLabel: "Select a slot",
    slot: "-",
    room: "-",
    status: "action-required",
  },
  {
    id: "ex-102",
    courseCode: "EN-102",
    courseTitle: "Technical Writing",
    dateLabel: "Thu, 22 May 2026",
    timeLabel: "09:00 - 11:00",
    slot: "Slot A",
    room: "Hall D-01",
    status: "confirmed",
  },
];

export const enrolledCourses: EnrolledCourse[] = [
  {
    id: "ex-301",
    code: "CS-301",
    title: "Data Structures",
    instructor: "Dr. Imran Sheikh",
    creditHours: 3,
    slotStatus: "confirmed",
  },
  {
    id: "ex-305",
    code: "CS-305",
    title: "Operating Systems",
    instructor: "Ms. Hina Raza",
    creditHours: 3,
    slotStatus: "confirmed",
  },
  {
    id: "ex-201",
    code: "MA-201",
    title: "Linear Algebra",
    instructor: "Dr. Saad Mehmood",
    creditHours: 4,
    slotStatus: "awaiting-approval",
  },
  {
    id: "ex-310",
    code: "CS-310",
    title: "Database Systems",
    instructor: "Dr. Nadia Farooq",
    creditHours: 3,
    slotStatus: "needs-selection",
  },
  {
    id: "ex-102",
    code: "EN-102",
    title: "Technical Writing",
    instructor: "Mr. Kamran Ali",
    creditHours: 2,
    slotStatus: "confirmed",
  },
];

export const courseSlotOptions: CourseSlotOptions[] = [
  {
    courseId: "ex-310",
    courseCode: "CS-310",
    courseTitle: "Database Systems",
    options: [
      { id: "slot-b", label: "Slot B", time: "13:00 - 15:00", venue: "Hall A-04", seatsLeft: 0 },
      { id: "slot-c", label: "Slot C", time: "16:00 - 18:00", venue: "Hall C-02", seatsLeft: 18 },
      { id: "slot-d", label: "Slot D", time: "18:30 - 20:30", venue: "Hall C-05", seatsLeft: 7 },
    ],
  },
];

export const dateSheet: DateSheetEntry[] = [
  {
    id: "ds-301",
    courseCode: "CS-301",
    courseTitle: "Data Structures",
    dateLabel: "Mon, 12 May 2026",
    timeLabel: "09:00 - 11:00",
    room: "Hall B-12",
  },
  {
    id: "ds-305",
    courseCode: "CS-305",
    courseTitle: "Operating Systems",
    dateLabel: "Wed, 14 May 2026",
    timeLabel: "13:00 - 15:00",
    room: "Hall A-04",
  },
  {
    id: "ds-201",
    courseCode: "MA-201",
    courseTitle: "Linear Algebra",
    dateLabel: "Fri, 16 May 2026",
    timeLabel: "09:00 - 11:00",
    room: "Hall C-07",
  },
  {
    id: "ds-102",
    courseCode: "EN-102",
    courseTitle: "Technical Writing",
    dateLabel: "Thu, 22 May 2026",
    timeLabel: "09:00 - 11:00",
    room: "Hall D-01",
  },
];

export const changeRequests: ChangeRequest[] = [
  {
    id: "CR-1042",
    courseCode: "CS-301",
    courseTitle: "Data Structures",
    submittedLabel: "02 May 2026",
    status: "pending",
    remarks: "Under review by the examinations office.",
  },
  {
    id: "CR-1038",
    courseCode: "MA-201",
    courseTitle: "Linear Algebra",
    submittedLabel: "28 Apr 2026",
    status: "approved",
    remarks: "Slot moved to Friday 16 May, 09:00.",
  },
  {
    id: "CR-1031",
    courseCode: "EN-102",
    courseTitle: "Technical Writing",
    submittedLabel: "21 Apr 2026",
    status: "rejected",
    remarks: "Request window has closed for this course.",
  },
];
