import UsersClient from "@/components/admin/UsersClient";
import { getUsers } from "@/lib/data/users";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <UsersClient initialUsers={users} />
  );
}