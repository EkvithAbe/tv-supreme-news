import AdminAccessGuard from "@/components/admin/AdminAccessGuard";
import { AdminUserProvider } from "@/components/admin/AdminUserContext";
import AdminShell from "@/components/admin/AdminShell";
import { requireCmsUserPage } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCmsUserPage();

  return (
    <AdminUserProvider
      user={{
        id: user.id,
        name: user.name,
        role: user.role,
      }}
    >
      <AdminAccessGuard role={user.role}>
        <AdminShell
          user={{
            id: user.id,
            name: user.name,
            role: user.role,
          }}
        >
          {children}
        </AdminShell>
      </AdminAccessGuard>
    </AdminUserProvider>
  );
}
