import UsersClient from "@/components/admin/UsersClient";
import { requireAdminPage } from "@/lib/auth";
import { getUsers } from "@/lib/data/users";

export default async function UsersPage() {
  await requireAdminPage();

  const users = await getUsers();

  return (
    <UsersClient initialUsers={users} />
  );
}
