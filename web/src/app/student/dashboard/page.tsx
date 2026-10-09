import type { Metadata } from "next";
import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import { OverviewCards } from "../../../components/dashboard/OverviewCards";
import { UpcomingExams } from "../../../components/dashboard/UpcomingExams";
import { SlotSelection } from "../../../components/dashboard/SlotSelection";
import { DateSheet } from "../../../components/dashboard/DateSheet";
import { ChangeRequests } from "../../../components/dashboard/ChangeRequests";
import {
  changeRequests,
  courseSlotOptions,
  dateSheet,
  enrolledCourses,
  upcomingExams,
} from "../../../components/dashboard/demo-data";

export const metadata: Metadata = {
  title: "Student Dashboard | ExamSlot",
  description:
    "View your enrolled courses, upcoming exams, slot selection, personal date sheet and change requests.",
};

export default function StudentDashboardPage() {
  return (
    <DashboardShell>
      <OverviewCards />
      <UpcomingExams exams={upcomingExams} />
      <SlotSelection courses={courseSlotOptions} />
      <DateSheet entries={dateSheet} />
      <ChangeRequests requests={changeRequests} courses={enrolledCourses} />
    </DashboardShell>
  );
}
