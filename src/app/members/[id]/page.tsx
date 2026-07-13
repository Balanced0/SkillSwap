import { MemberProfileClient } from "@/components/member-profile-client";

export const metadata = {
  title: "Member Profile",
};

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MemberProfileClient id={id} />;
}
