"use client";

import { Calendar, Clock, Star } from "@gravity-ui/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { ListingCard } from "@/components/listing-card";
import { skillApi, type Review } from "@/lib/api";
import type { Member, Listing } from "@/lib/types";

export function MemberProfileClient({ id }: { id: string }) {
  const [member, setMember] = useState<Member | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      skillApi.memberProfile(id),
      skillApi.memberListings(id),
      skillApi.memberReviews(id),
    ])
      .then(([memberData, listingsData, reviewsData]) => {
        setMember(memberData.user);
        setListings(listingsData.listings);
        setReviews(reviewsData.reviews);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="shell page-loading">
        <div className="skeleton title" />
        <div className="skeleton card" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="shell page-section">
        <div className="empty-panel">
          <h1>Member not found.</h1>
          <p>{error || "This SkillSwap member profile is not available."}</p>
          <Link className="button button-rust" href="/explore">
            Explore marketplace
          </Link>
        </div>
      </div>
    );
  }

  const hasRating = member.averageRating > 0;

  return (
    <div className="shell page-section public-profile-page">
      <Link className="back-link" href="/explore">
        ← Back to explore
      </Link>

      <header className="profile-hero">
        <Avatar member={member} size="lg" />
        <div>
          <p className="eyebrow rust">SKILLSWAP MEMBER</p>
          <h1>{member.name}</h1>
          <p>{member.location || "Location not shared"}</p>
        </div>
        <div className="profile-stats">
          <div>
            <strong>{member.sessionsCompleted}</strong>
            <span>swaps</span>
          </div>
          <div>
            <strong>{hasRating ? member.averageRating.toFixed(1) : "New"}</strong>
            <span>{hasRating ? "rating" : "member"}</span>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <section className="profile-about">
          <div className="section-heading">
            <div>
              <p className="eyebrow rust">ABOUT</p>
              <h2>Bio & Skills</h2>
            </div>
          </div>
          <p className="bio-copy">
            {member.bio || `${member.name.split(" ")[0]} hasn't written a bio yet.`}
          </p>

          <section className="profile-skills" style={{ marginTop: "2rem" }}>
            <h3>Skills offered</h3>
            {member.skillsOffered?.length ? (
              <div className="skill-tags">
                {member.skillsOffered.map((item, idx) => (
                  <span key={idx}>
                    <strong>{item.skillName}</strong>
                    <small>{item.category} · {item.level}</small>
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted-copy">No skills added yet.</p>
            )}
          </section>

          <section className="profile-skills" style={{ marginTop: "2rem" }}>
            <h3>Skills wanted</h3>
            {member.skillsWanted?.length ? (
              <div className="skill-tags">
                {member.skillsWanted.map((item, idx) => (
                  <span key={idx}>
                    <strong>{item.skillName}</strong>
                    <small>{item.category}</small>
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted-copy">No wanted skills added yet.</p>
            )}
          </section>

          <section className="profile-listings" style={{ marginTop: "3rem" }}>
            <div className="section-heading">
              <div>
                <p className="eyebrow rust">OFFERS</p>
                <h2>Active listings ({listings.length})</h2>
              </div>
            </div>
            {listings.length ? (
              <div className="listing-grid">
                {listings.map((listing) => (
                  <ListingCard listing={listing} key={listing._id} />
                ))}
              </div>
            ) : (
              <div className="empty-panel compact-empty">
                <p>{member.name.split(" ")[0]} has no active listings right now.</p>
              </div>
            )}
          </section>
        </section>

        <aside className="profile-trust">
          <p className="eyebrow rust">TRUST & REPUTATION</p>
          <h2>{member.sessionsCompleted ? "Swaps completed" : "New member"}</h2>
          {hasRating ? (
            <p className="trust-rating">
              <Star /> {member.averageRating.toFixed(1)} average rating
            </p>
          ) : (
            <p>Ready to start the first skill swap in the community.</p>
          )}

          <section className="profile-reviews-list" style={{ marginTop: "2rem" }}>
            <h3>Reviews ({reviews.length})</h3>
            {reviews.length ? (
              <div className="review-list-compact" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                {reviews.map((review) => (
                  <article key={review._id} className="review-card" style={{ padding: "1rem", border: "1px solid #e7ded0", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <Avatar member={review.reviewer} size="sm" />
                      <div>
                        <strong>{review.reviewer.name}</strong>
                        <span className="rating" style={{ marginLeft: "0.5rem", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                          <Star /> {review.rating}.0
                        </span>
                      </div>
                    </div>
                    <p style={{ fontStyle: "italic", fontSize: "0.95rem" }}>“{review.comment}”</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted-copy" style={{ marginTop: "1rem" }}>No reviews yet.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
