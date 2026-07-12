import { ArrowRight, Star } from "@gravity-ui/icons";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const rating = listing.teacher.averageRating;
  return (
    <article className="listing-card">
      <div className="listing-card-topline">
        <span className="eyebrow rust">{listing.category}</span>
        <span className="level-pill">{listing.level}</span>
      </div>
      <h3>{listing.title}</h3>
      <p className="listing-description">{listing.description}</p>
      <div className="listing-teacher">
        <Avatar member={listing.teacher} size="sm" />
        <div>
          <strong>{listing.teacher.name}</strong>
          <span>{listing.teacher.location || "SkillSwap member"}</span>
        </div>
        {rating > 0 ? <span className="rating"><Star /> {rating.toFixed(1)}</span> : <span className="new-member">New member</span>}
      </div>
      <Link href={`/skills/${listing._id}`} className="card-link">
        View details <ArrowRight />
      </Link>
    </article>
  );
}
