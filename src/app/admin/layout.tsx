import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAccessGuard from "@/components/admin/AdminAccessGuard";
import { AdminUserProvider } from "@/components/admin/AdminUserContext";
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
        <div className="min-h-screen bg-slate-50">
          <div className="flex min-h-screen">
            <AdminSidebar role={user.role} />

            <div className="flex min-w-0 flex-1 flex-col">
              <AdminHeader
                user={{
                  name: user.name,
                  role: user.role,
                }}
              />

              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </div>
      </AdminAccessGuard>
    </AdminUserProvider>
  );
}
