"use client";

import {
  createContext,
  useContext,
} from "react";

export type AdminUser = {
  id: string;
  name: string;
  role: "ADMIN" | "EDITOR";
};

const AdminUserContext =
  createContext<AdminUser | null>(null);

export function AdminUserProvider({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  return (
    <AdminUserContext.Provider value={user}>
      {children}
    </AdminUserContext.Provider>
  );
}

export function useAdminUser() {
  const user = useContext(AdminUserContext);

  if (!user) {
    throw new Error(
      "useAdminUser must be used inside the admin layout.",
    );
  }

  return user;
}
