import type { Member } from "@/lib/types";

export function Avatar({ member, size = "md" }: { member: Pick<Member, "name" | "avatarUrl">; size?: "sm" | "md" | "lg" }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return member.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`avatar avatar-${size}`} src={member.avatarUrl} alt={`${member.name}'s profile`} />
  ) : (
    <span className={`avatar avatar-${size}`} aria-label={`${member.name}'s initials`}>
      {initials}
    </span>
  );
}
