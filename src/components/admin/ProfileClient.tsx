"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock3,
  KeyRound,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import MediaImagePicker, {
  type SelectedImage,
} from "@/components/admin/MediaImagePicker";

type Role = "ADMIN" | "EDITOR";

type Activity = {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  summary: string;
  createdAt: string | Date;
};

type ChangeRequest = {
  id: string;
  type: "EMAIL" | "PASSWORD";
  requestedEmail: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNote: string | null;
  createdAt: string | Date;
  reviewedAt: string | Date | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  jobTitle: string | null;
  bio: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  profileImage: SelectedImage | null;
  activityLogs: Activity[];
  changeRequests: ChangeRequest[];
};

type Props = {
  initialProfile: Profile;
  initialPendingRequests: ChangeRequest[];
};

function formatDateTime(value: string | Date | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

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

function requestLabel(request: ChangeRequest) {
  if (request.type === "EMAIL") {
    return request.requestedEmail
      ? `Email change to ${request.requestedEmail}`
      : "Email change";
  }

  return "Password change";
}

export default function ProfileClient({
  initialProfile,
  initialPendingRequests,
}: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [name, setName] = useState(initialProfile.name);
  const [phone, setPhone] = useState(initialProfile.phone ?? "");
  const [jobTitle, setJobTitle] = useState(initialProfile.jobTitle ?? "");
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [profileImage, setProfileImage] = useState<SelectedImage | null>(
    initialProfile.profileImage,
  );
  const [email, setEmail] = useState(initialProfile.email);
  const [password, setPassword] = useState("");
  const [credentialValue, setCredentialValue] = useState("");
  const [credentialType, setCredentialType] = useState<"EMAIL" | "PASSWORD">("EMAIL");
  const [requests, setRequests] = useState(initialPendingRequests);
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = profile.role === "ADMIN";

  const ownPendingCredentialRequests = useMemo(
    () =>
      profile.changeRequests.filter(
        (request) => request.status === "PENDING",
      ),
    [profile.changeRequests],
  );

  const saveProfile = async () => {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Your name is required.");
      return;
    }

    if (isAdmin && !email.trim().includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (isAdmin && password && password.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          jobTitle: jobTitle.trim() || null,
          bio: bio.trim() || null,
          profileImageId: profileImage?.id ?? null,
          ...(isAdmin
            ? {
                email: email.trim().toLowerCase(),
                password: password || undefined,
              }
            : {}),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to save your profile.");
      }

      setProfile((current) => ({
        ...current,
        ...data.profile,
        activityLogs: [
          {
            id: `pending-${Date.now()}`,
            action: "PROFILE_UPDATED",
            resourceType: "PROFILE",
            resourceId: current.id,
            summary: "Updated own profile details.",
            createdAt: new Date(),
          },
          ...current.activityLogs,
        ],
      }));
      setPassword("");
      setSuccess("Profile saved.");
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const submitCredentialRequest = async () => {
    setError("");
    setSuccess("");

    if (!credentialValue.trim()) {
      setError(`Enter the new ${credentialType === "EMAIL" ? "email address" : "password"}.`);
      return;
    }

    setRequesting(true);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: credentialType,
          value: credentialValue,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to submit your request.");
      }

      setProfile((current) => ({
        ...current,
        changeRequests: [data.changeRequest, ...current.changeRequests],
        activityLogs: [
          {
            id: `pending-${Date.now()}`,
            action: `${credentialType}_CHANGE_REQUESTED`,
            resourceType: "PROFILE_CHANGE_REQUEST",
            resourceId: data.changeRequest.id,
            summary: `Requested a ${credentialType === "EMAIL" ? "email address" : "password"} change.`,
            createdAt: new Date(),
          },
          ...current.activityLogs,
        ],
      }));
      setCredentialValue("");
      setSuccess("Your request was sent to the administrator for approval.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit your request.",
      );
    } finally {
      setRequesting(false);
    }
  };

  const reviewRequest = async (
    id: string,
    decision: "APPROVE" | "REJECT",
  ) => {
    setError("");
    setSuccess("");
    setReviewingId(id);

    try {
      const response = await fetch("/api/admin/profile/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, decision }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to review the request.");
      }

      setRequests((current) => current.filter((request) => request.id !== id));
      setSuccess(`Request ${decision === "APPROVE" ? "approved" : "rejected"}.`);
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Unable to review the request.",
      );
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#111d4a] via-[#3c2372] to-[#8b1fc8] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          {profileImage ? (
            <img
              src={profileImage.url}
              alt={profileImage.altText || profile.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/40"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <UserRound size={30} />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white/70">My profile</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">{profile.name}</h1>
            <p className="mt-1 text-sm text-white/75">{isAdmin ? "Administrator" : "Editor"}</p>
          </div>
        </div>
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      {success && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-pink-50 p-2.5 text-pink-600"><UserRound size={19} /></div>
            <div><h2 className="text-lg font-bold text-slate-900">Personal details</h2><p className="mt-1 text-sm text-slate-500">Keep your public CMS profile up to date.</p></div>
          </div>

          <div className="mt-6"><MediaImagePicker label="Profile photo" value={profileImage} onChange={setProfileImage} disabled={saving} /></div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">Full name<input value={name} onChange={(event) => setName(event.target.value)} disabled={saving} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" /></label>
            <label className="block text-sm font-semibold text-slate-700">Phone number<input value={phone} onChange={(event) => setPhone(event.target.value)} disabled={saving} placeholder="+94 ..." className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" /></label>
            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Job title<input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} disabled={saving} placeholder="News Editor" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" /></label>
            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Bio<textarea value={bio} onChange={(event) => setBio(event.target.value)} disabled={saving} rows={4} placeholder="A short profile description" className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" /></label>
          </div>

          {isAdmin && <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/60 p-4"><div className="flex items-center gap-2 text-sm font-bold text-violet-900"><ShieldCheck size={17} /> Administrator credentials</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={saving} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" /></label><label className="block text-sm font-semibold text-slate-700">New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={saving} placeholder="Leave blank to keep it" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" /></label></div></div>}

          <button type="button" onClick={saveProfile} disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Saving..." : "Save profile"}</button>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Mail size={18} /></div><div><h2 className="font-bold text-slate-900">Login details</h2><p className="text-sm text-slate-500">{profile.email}</p></div></div>{!isAdmin && <><p className="mt-4 text-sm leading-6 text-slate-500">Email and password changes require administrator approval.</p><div className="mt-4 flex gap-2"><button type="button" onClick={() => { setCredentialType("EMAIL"); setCredentialValue(""); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${credentialType === "EMAIL" ? "bg-pink-600 text-white" : "bg-slate-100 text-slate-600"}`}>Email</button><button type="button" onClick={() => { setCredentialType("PASSWORD"); setCredentialValue(""); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${credentialType === "PASSWORD" ? "bg-pink-600 text-white" : "bg-slate-100 text-slate-600"}`}>Password</button></div><input type={credentialType === "EMAIL" ? "email" : "password"} value={credentialValue} onChange={(event) => setCredentialValue(event.target.value)} disabled={requesting} placeholder={credentialType === "EMAIL" ? "New email address" : "New password (8+ characters)"} className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" /><button type="button" onClick={submitCredentialRequest} disabled={requesting} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-100 disabled:opacity-60">{requesting ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}Request approval</button></>}{!isAdmin && ownPendingCredentialRequests.length > 0 && <div className="mt-4 border-t border-slate-100 pt-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pending requests</p>{ownPendingCredentialRequests.map((request) => <p key={request.id} className="mt-2 text-sm text-amber-700">{requestLabel(request)} · Waiting for approval</p>)}</div>}</section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Clock3 size={18} className="text-pink-600" /><h2 className="font-bold text-slate-900">My activity</h2></div><p className="mt-1 text-sm text-slate-500">Only your own changes are visible here.</p><div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">{profile.activityLogs.length ? profile.activityLogs.map((activity) => <div key={activity.id} className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-700">{activity.summary}</p><p className="mt-1 text-xs text-slate-500">{formatDateTime(activity.createdAt)}</p></div>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Your activity will appear here.</p>}</div></section>
        </aside>
      </div>

      {isAdmin && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><ShieldCheck size={19} /></div><div><h2 className="text-lg font-bold text-slate-900">Editor credential requests</h2><p className="mt-1 text-sm text-slate-500">Approve or reject Editor email and password changes.</p></div></div><div className="mt-5 space-y-3">{requests.length ? requests.map((request) => <div key={request.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-800">{request.user?.name || "Editor"} · {requestLabel(request)}</p><p className="mt-1 text-xs text-slate-500">Requested {formatDateTime(request.createdAt)}</p></div><div className="flex gap-2"><button type="button" onClick={() => reviewRequest(request.id, "APPROVE")} disabled={reviewingId === request.id} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"><Check size={14} />Approve</button><button type="button" onClick={() => reviewRequest(request.id, "REJECT")} disabled={reviewingId === request.id} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-60"><X size={14} />Reject</button></div></div>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No Editor credential requests are waiting.</p>}</div></section>}
    </div>
  );
}
