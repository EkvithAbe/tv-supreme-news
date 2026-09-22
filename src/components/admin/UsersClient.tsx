"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Edit3,
  Eye,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";

type UserRole =
  | "ADMIN"
  | "EDITOR";

type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string | Date;
  updatedAt: string | Date;
  articleCount: number;
};

type EditorActivity = {
  id: string;
  summary: string;
  createdAt: string | Date;
};

type RoleFilter =
  | "ALL"
  | UserRole;

type Props = {
  initialUsers: CmsUser[];
};

const roles: UserRole[] = ["EDITOR"];

const roleLabels: Record<
  UserRole,
  string
> = {
  ADMIN: "Administrator",
  EDITOR: "Editor",
};

const roleFilters: {
  label: string;
  value: RoleFilter;
}[] = [
  {
    label: "All Users",
    value: "ALL",
  },
  {
    label: "Administrators",
    value: "ADMIN",
  },
  {
    label: "Editors",
    value: "EDITOR",
  },
];

function formatDate(
  value: string | Date,
) {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDateTime(
  value: string | Date,
) {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  }).format(date);
}

function getInitials(
  name: string,
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ??
        "",
    )
    .join("");
}

function getRoleDescription(
  role: UserRole,
) {
  switch (role) {
    case "ADMIN":
      return "Full access to manage users, articles, media and CMS settings.";

    case "EDITOR":
      return "Can create, edit, publish and delete articles and videos, and select or upload images for them.";

    default:
      return "CMS permissions are assigned according to the selected role.";
  }
}

export default function UsersClient({
  initialUsers,
}: Props) {
  const [users, setUsers] =
    useState<CmsUser[]>(
      initialUsers,
    );

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");

  const [
    activeTab,
    setActiveTab,
  ] = useState<RoleFilter>("ALL");

  const [showModal, setShowModal] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<CmsUser | null>(
      null,
    );

  const [selectedUser, setSelectedUser] =
    useState<CmsUser | null>(
    null,
  );
  const [selectedActivity, setSelectedActivity] =
    useState<EditorActivity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState<UserRole>(
      "EDITOR",
    );

  const [password, setPassword] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(
      null,
    );

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =========================================================
     COUNTS
  ========================================================== */

  const totalUsers =
    users.length;

  const administrators =
    users.filter(
      (user) =>
        user.role === "ADMIN",
    ).length;

  const editors =
    users.filter(
      (user) =>
        user.role === "EDITOR",
    ).length;

  /* =========================================================
     FILTER USERS
  ========================================================== */

  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const matchesSearch =
            !query ||
            user.name
              .toLowerCase()
              .includes(query) ||
            user.email
              .toLowerCase()
              .includes(query) ||
            roleLabels[
              user.role
            ]
              .toLowerCase()
              .includes(query);

          const effectiveRole =
            activeTab !==
            "ALL"
              ? activeTab
              : roleFilter;

          const matchesRole =
            effectiveRole ===
              "ALL" ||
            user.role ===
              effectiveRole;

          return (
            matchesSearch &&
            matchesRole
          );
        },
      );
    }, [
      users,
      search,
      roleFilter,
      activeTab,
    ]);

  /* =========================================================
     FORM RESET
  ========================================================== */

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("EDITOR");
    setPassword("");
    setEditingUser(null);
    setError("");
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (
    user: CmsUser,
  ) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword("");
    setError("");
    setShowModal(true);
  };

  const openUserDetails = async (
    user: CmsUser,
  ) => {
    setSelectedUser(user);
    setSelectedActivity([]);

    if (user.role !== "EDITOR") {
      return;
    }

    setIsLoadingActivity(true);

    try {
      const response = await fetch(
        `/api/admin/users?id=${encodeURIComponent(user.id)}`,
        { cache: "no-store" },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to load Editor activity.");
      }

      setSelectedActivity(
        Array.isArray(data.activity)
          ? data.activity
          : [],
      );
    } catch (activityError) {
      setError(
        activityError instanceof Error
          ? activityError.message
          : "Unable to load Editor activity.",
      );
    } finally {
      setIsLoadingActivity(false);
    }
  };

  /* =========================================================
     SAVE USER
  ========================================================== */

  const saveUser = async () => {
    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanName) {
      setError(
        "Full name is required.",
      );
      return;
    }

    if (!cleanEmail) {
      setError(
        "Email address is required.",
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError(
        "Please enter a valid email address.",
      );
      return;
    }

    /*
     * Password is required when creating
     * a new account.
     */
    if (
      !editingUser &&
      password.length < 8
    ) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    /*
     * When editing, an empty password means:
     * keep the current password.
     */
    if (
      editingUser &&
      password.length > 0 &&
      password.length < 8
    ) {
      setError(
        "New password must contain at least 8 characters.",
      );
      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          "/api/admin/users",
          {
            method:
              editingUser
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...(editingUser
                ? {
                    id: editingUser.id,
                  }
                : {}),

              name: cleanName,

              email:
                cleanEmail,

              ...(password
                ? {
                    password,
                  }
                : {}),
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save user.",
        );
      }

      const savedUser =
        data.user as CmsUser;

      if (editingUser) {
        setUsers(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                savedUser.id
                  ? savedUser
                  : item,
            ),
        );

        if (
          selectedUser?.id ===
          savedUser.id
        ) {
            setSelectedUser(savedUser);
        }

        setSuccess(
          "User updated successfully.",
        );
      } else {
        setUsers(
          (current) => [
            savedUser,
            ...current,
          ],
        );

        setSuccess(
          "User created successfully.",
        );
      }

      setShowModal(false);
      resetForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save user.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE USER
  ========================================================== */

  const deleteUser = async (
    user: CmsUser,
  ) => {
    if (
      user.role ===
      "ADMIN"
    ) {
      window.alert(
        "Administrator accounts should not be deleted from this screen.",
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${user.name}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(user.id);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/users?id=${encodeURIComponent(
            user.id,
          )}`,
          {
            method: "DELETE",
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete user.",
        );
      }

      setUsers(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              user.id,
          ),
      );

      if (
        selectedUser?.id ===
        user.id
      ) {
        setSelectedUser(
          null,
        );
      }

      setSuccess(
        "User deleted successfully.",
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete user.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-pink-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Users & Roles
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Create and manage Editor accounts. The administrator account is protected.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openAddModal
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
        >
          <UserPlus
            size={17}
          />
          Add Editor
        </button>
      </div>

      {/* =========================================================
          MESSAGES
      ========================================================== */}

      {success && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>
              {success}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
            aria-label="Close success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && !showModal && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            aria-label="Close error message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =========================================================
          STATS
      ========================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UserStatCard
          title="Total Users"
          value={String(
            totalUsers,
          )}
          note="CMS accounts"
          icon={
            <UserCheck
              size={20}
            />
          }
        />

        <UserStatCard
          title="Administrators"
          value={String(
            administrators,
          )}
          note="Full CMS access"
          icon={
            <LockKeyhole
              size={20}
            />
          }
          featured
        />

        <UserStatCard
          title="Editors"
          value={String(
            editors,
          )}
          note="Editorial management"
          icon={
            <ShieldCheck
              size={20}
            />
          }
        />

        <UserStatCard
          title="Content team"
          value={String(editors)}
          note="Article and video management"
          icon={
            <UserPlus
              size={20}
            />
          }
        />
      </div>

      {/* =========================================================
          MAIN TABLE
      ========================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TOOLBAR */}
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* SEARCH */}
            <div className="relative w-full xl:max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search users..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>

            {/* ROLE FILTER */}
            <div className="relative w-full xl:w-auto">
              <select
                value={
                  roleFilter
                }
                onChange={(
                  event,
                ) => {
                  const value =
                    event.target
                      .value as RoleFilter;

                  setRoleFilter(
                    value,
                  );

                  if (
                    activeTab !==
                      "ALL" &&
                    value ===
                      "ALL"
                  ) {
                    setActiveTab(
                      "ALL",
                    );
                  }
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400 xl:w-auto"
              >
                {roleFilters.map(
                  (filter) => (
                    <option
                      key={
                        filter.value
                      }
                      value={
                        filter.value
                      }
                    >
                      {
                        filter.label
                      }
                    </option>
                  ),
                )}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* ROLE TABS */}
          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-100">
            {roleFilters.map(
              (filter) => (
                <button
                  key={
                    filter.value
                  }
                  type="button"
                  onClick={() => {
                    setActiveTab(
                      filter.value,
                    );
                    setRoleFilter(
                      filter.value,
                    );
                  }}
                  className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition sm:px-4 ${
                    activeTab ===
                    filter.value
                      ? "border-pink-600 text-pink-600"
                      : "border-transparent text-slate-500 hover:border-pink-200 hover:text-pink-600"
                  }`}
                >
                  {
                    filter.label
                  }
                </button>
              ),
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Role
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Articles
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Created
                </th>

                <th className="w-[140px] px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length >
              0 ? (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={
                        user.id
                      }
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      {/* USER */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            void openUserDetails(user)
                          }
                          className="flex min-w-0 items-center gap-3 text-left"
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                              user.role ===
                              "ADMIN"
                                ? "bg-gradient-to-br from-pink-600 to-purple-600"
                                : "bg-slate-700"
                            }`}
                          >
                            {getInitials(
                              user.name,
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {
                                user.name
                              }
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-400">
                              {
                                user.email
                              }
                            </p>
                          </div>
                        </button>
                      </td>

                      {/* ROLE */}
                      <td className="px-5 py-4">
                        <RoleBadge
                          role={
                            user.role
                          }
                        />
                      </td>

                      {/* ARTICLES */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-700">
                          {
                            user.articleCount
                          }
                        </span>
                      </td>

                      {/* CREATED */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {formatDate(
                            user.createdAt,
                          )}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              void openUserDetails(user)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`View ${user.name}`}
                          >
                            <Eye
                              size={15}
                            />
                          </button>

                          {user.role === "EDITOR" && (
                            <>
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                user,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                            aria-label={`Edit ${user.name}`}
                          >
                            <Edit3
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              user.id
                            }
                            onClick={() =>
                              deleteUser(
                                user,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Delete ${user.name}`}
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                            </>
                          )}

                          <button
                            type="button"
                            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100 hover:text-slate-700 sm:flex"
                            aria-label={`More actions for ${user.name}`}
                          >
                            <MoreHorizontal
                              size={15}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <UserPlus
                          size={40}
                          className="text-slate-300"
                        />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-slate-700">
                        No users found
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-400">
                        Try another search
                        or create a CMS
                        user.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400">
          Showing{" "}
          {
            filteredUsers.length
          }{" "}
          of {users.length} users
        </div>
      </section>

      {/* =========================================================
          ROLE INFORMATION
      ========================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <ShieldCheck
                size={20}
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900">
                CMS Roles
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Roles are based on the
                MySQL UserRole enum used
                by the TV SUPREME CMS.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5">
          {roles.map(
            (roleItem) => (
              <div
                key={roleItem}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <RoleBadge
                  role={roleItem}
                />

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {getRoleDescription(
                    roleItem,
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* =========================================================
          SELECTED USER
      ========================================================== */}

      {selectedUser && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-pink-600">
                {selectedUser.role === "EDITOR" ? "Editor Details" : "Administrator Details"}
              </p>

              <h2 className="mt-1 truncate text-lg font-semibold text-slate-900">
                {
                  selectedUser.name
                }
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedUser.role === "EDITOR" ? "Editor account and activity" : "Administrator account"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedUser(
                  null,
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close user details"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${
                    selectedUser.role ===
                    "ADMIN"
                      ? "bg-gradient-to-br from-pink-600 to-purple-600"
                      : "bg-slate-700"
                  }`}
                >
                  {getInitials(
                    selectedUser.name,
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-slate-900">
                    {
                      selectedUser.name
                    }
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {
                      selectedUser.email
                    }
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <UserDetail
                  label="Role"
                  value={
                    roleLabels[
                      selectedUser
                        .role
                    ]
                  }
                />

                <UserDetail
                  label="Articles"
                  value={String(
                    selectedUser.articleCount,
                  )}
                />

                <UserDetail
                  label="Created"
                  value={formatDate(
                    selectedUser.createdAt,
                  )}
                />
              </div>

              {selectedUser.role === "EDITOR" && (
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Editor activity
                  </p>
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {isLoadingActivity ? (
                      <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Loading activity...</p>
                    ) : selectedActivity.length ? (
                      selectedActivity.map((activity) => (
                        <div key={activity.id} className="rounded-xl bg-slate-50 p-3">
                          <p className="text-sm font-medium text-slate-700">{activity.summary}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatDateTime(activity.createdAt)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No Editor activity yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Account Actions
              </p>

              {selectedUser.role === "EDITOR" && <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(
                      selectedUser,
                    )
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  <Edit3
                    size={15}
                  />
                  Edit User
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteUser(
                      selectedUser,
                    )
                  }
                  disabled={
                    deletingId ===
                    selectedUser.id
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2
                    size={15}
                  />
                  Delete User
                </button>
              </div>
              }
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-4">
          <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-pink-600">
                  Administration
                </p>

                <h2 className="mt-1 truncate text-xl font-bold text-slate-900">
                  {editingUser
                    ? "Edit User"
                    : "Add User"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={saving}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-5">
                {/* NAME */}
                <div>
                  <label
                    htmlFor="userName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                    <span className="ml-1 text-pink-600">
                      *
                    </span>
                  </label>

                  <input
                    id="userName"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(
                      event,
                    ) =>
                      setName(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Enter full name..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="userEmail"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                    <span className="ml-1 text-pink-600">
                      *
                    </span>
                  </label>

                  <input
                    id="userEmail"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(
                      event,
                    ) =>
                      setEmail(
                        event.target
                          .value,
                      )
                    }
                    placeholder="name@tvsupreme.lk"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>

                {/* ROLE */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    CMS Role
                  </p>

                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    {roleLabels[role]}
                  </p>

                  {!editingUser && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      New CMS accounts are registered as Editors. The existing administrator account is protected.
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="userPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    {editingUser
                      ? "New Password"
                      : "Password"}

                    {!editingUser && (
                      <span className="ml-1 text-pink-600">
                        *
                      </span>
                    )}
                  </label>

                  <input
                    id="userPassword"
                    type="password"
                    autoComplete={
                      editingUser
                        ? "new-password"
                        : "new-password"
                    }
                    value={password}
                    onChange={(
                      event,
                    ) =>
                      setPassword(
                        event.target
                          .value,
                      )
                    }
                    placeholder={
                      editingUser
                        ? "Leave blank to keep current password"
                        : "Enter password..."
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Minimum 8 characters.
                    Passwords are hashed on
                    the server before they are
                    stored.
                  </p>
                </div>

                {/* PERMISSION PREVIEW */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                      <ShieldCheck
                        size={17}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {
                          roleLabels[
                            role
                          ]
                        }
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {getRoleDescription(
                          role,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* FORM ERROR */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={saving}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  saveUser
                }
                disabled={
                  saving
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Check
                  size={16}
                />

                {saving
                  ? "Saving..."
                  : editingUser
                  ? "Save Changes"
                  : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function UserStatCard({
  title,
  value,
  note,
  icon,
  featured = false,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        featured
          ? "border-pink-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {note}
          </p>
        </div>

        <div
          className={`shrink-0 rounded-xl p-3 ${
            featured
              ? "bg-pink-50 text-pink-600"
              : "bg-slate-50 text-slate-500"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ROLE BADGE
========================================================= */

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const styles: Record<
    UserRole,
    string
  > = {
    ADMIN:
      "bg-pink-50 text-pink-700",
    EDITOR:
      "bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function UserDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
