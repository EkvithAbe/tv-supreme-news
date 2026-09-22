import ProfileClient from "@/components/admin/ProfileClient";
import { requireCmsUserPage } from "@/lib/auth";
import {
  getPendingProfileChangeRequests,
  getProfile,
} from "@/lib/data/profile";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireCmsUserPage();

  const [profile, pendingRequests] = await Promise.all([
    getProfile(user.id),
    user.role === "ADMIN"
      ? getPendingProfileChangeRequests()
      : Promise.resolve([]),
  ]);

  return (
    <ProfileClient
      initialProfile={profile}
      initialPendingRequests={pendingRequests}
    />
  );
}
