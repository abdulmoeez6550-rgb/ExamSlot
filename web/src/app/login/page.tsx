import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { LoginForm } from "../../components/auth/LoginForm";
import { ROUTES } from "../../components/home/routes";

export const metadata: Metadata = {
  title: "Login | ExamSlot",
  description: "Sign in to view your exams, slot selection and date sheet.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your slot selection, personal date sheet and change requests."
      footer={
        <>
          New to ExamSlot?{" "}
          <Link
            href={ROUTES.signup}
            className="rounded font-semibold text-accent hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
