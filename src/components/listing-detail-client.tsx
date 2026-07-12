"use client";

import { Calendar, Clock, Star } from "@gravity-ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { ListingCard } from "@/components/listing-card";
import { getToken, skillApi, type Review } from "@/lib/api";
import type { Listing } from "@/lib/types";

export function ListingDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Listing[]>([]);
  const [proposedTime, setProposedTime] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => { skillApi.listing(id).then((data) => { setListing(data.listing); setReviews(data.reviews); setRelated(data.relatedListings); }).catch((error: Error) => setMessage(error.message)).finally(() => setIsLoading(false)); }, [id]);
  async function requestSession() {
    if (!getToken()) { router.push(`/login?next=/skills/${id}`); return; }
    if (!proposedTime) { setMessage("Choose a proposed date and time before sending your request."); return; }
    setIsSending(true); setMessage("");
    try { await skillApi.requestSession({ listingId: id, proposedTime }); setMessage("Request sent. Your teacher can now accept or decline it from My sessions."); }
    catch (error) { setMessage((error as Error).message); }
    finally { setIsSending(false); }
  }
  if (isLoading) return <div className="shell page-loading"><div className="skeleton title" /><div className="skeleton card" /></div>;
  if (!listing) return <div className="shell page-section"><div className="empty-panel"><h1>That listing isn’t available.</h1><p>{message || "It may have been removed or paused by its teacher."}</p><Link className="button button-rust" href="/explore">Explore skills</Link></div></div>;
  return <div className="shell page-section skill-detail">
    <Link className="back-link" href="/explore">← Back to explore</Link>
    <div className="detail-grid">
      <section className="detail-main"><p className="eyebrow rust">{listing.category} · {listing.level}</p><h1>{listing.title}</h1><p className="detail-description">{listing.description}</p><div className="tag-row">{listing.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="teacher-summary"><Avatar member={listing.teacher} size="lg" /><div><p className="eyebrow">YOUR TEACHER</p><h2>{listing.teacher.name}</h2><p>{listing.teacher.location || "SkillSwap member"} · {listing.teacher.sessionsCompleted ? `${listing.teacher.sessionsCompleted} completed swaps` : "New member"}</p></div></div><section className="detail-section"><h2>Availability</h2>{listing.availability.length ? <div className="availability-list">{listing.availability.map((slot) => <div key={slot.day}><Calendar /> <strong>{slot.day}</strong><span>{slot.timeSlots.join(" · ")}</span></div>)}</div> : <p className="muted-copy">Ask the teacher to find a time that works for both of you.</p>}</section></section>
      <aside className="booking-card"><span className="eyebrow rust">ONE SIMPLE RATE</span><h2>1 hour = 1 credit</h2><p>Credits move only when you and your teacher both confirm the lesson happened.</p><label className="form-label">Propose a time<input type="datetime-local" value={proposedTime} onChange={(event) => setProposedTime(event.target.value)} /></label><button className="button button-rust full-width" type="button" disabled={isSending} onClick={requestSession}>{isSending ? "Sending request…" : "Request this session"}</button>{message && <p className={message.startsWith("Request sent") ? "form-message success" : "form-message error"}>{message}</p>}<p className="booking-note"><Clock /> Sessions are booked in one-hour blocks.</p></aside>
    </div>
    <section className="detail-section reviews-section"><div className="review-title"><div><p className="eyebrow rust">COMMUNITY FEEDBACK</p><h2>What members say</h2></div>{listing.teacher.averageRating > 0 && <span className="large-rating"><Star /> {listing.teacher.averageRating.toFixed(1)}</span>}</div>{reviews.length ? <div className="review-grid">{reviews.map((review) => <article className="review-card" key={review._id}><div><Avatar member={review.reviewer} size="sm" /><strong>{review.reviewer.name}</strong><span className="rating"><Star /> {review.rating}.0</span></div><p>“{review.comment}”</p></article>)}</div> : <div className="empty-panel compact-empty"><p>Reviews appear here once members complete their first swap with {listing.teacher.name.split(" ")[0]}.</p></div>}</section>
    {related.length > 0 && <section className="detail-section"><h2>More {listing.category.toLowerCase()} skills</h2><div className="listing-grid">{related.map((item) => <ListingCard listing={item} key={item._id} />)}</div></section>}
  </div>;
}
