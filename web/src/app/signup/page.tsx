import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { SignupForm } from "../../components/auth/SignupForm";
import { ROUTES } from "../../components/home/routes";

export const metadata: Metadata = {
  title: "Sign Up | ExamSlot",
  description: "Request an ExamSlot student account to manage your exam schedule.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register to choose exam slots, track requests and print your date sheet."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={ROUTES.login}
            className="rounded font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
