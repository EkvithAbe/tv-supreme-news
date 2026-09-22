import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function getSafeNextPath(
  value: string | string[] | undefined,
) {
  const path =
    typeof value === "string" ? value : "";

  if (
    path.startsWith("/admin") &&
    !path.startsWith("//")
  ) {
    return path;
  }

  return undefined;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const [user, params] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);

  if (user) {
    redirect(
      user.role === "EDITOR"
        ? "/admin/news"
        : "/admin",
    );
  }

  return (
    <LoginForm
      redirectTo={
        getSafeNextPath(
          params.next,
        )
      }
    />
  );
}
