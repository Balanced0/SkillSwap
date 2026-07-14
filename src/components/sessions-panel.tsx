"use client";

import { Calendar, Clock } from "@gravity-ui/icons";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Avatar } from "@/components/avatar";
import { skillApi } from "@/lib/api";
import type { Member, Session } from "@/lib/types";

export function SessionsPanel() {
  const [sessions, setSessions] = useState<Session[]>([]); const [member, setMember] = useState<Member | null>(null); const [isLoading, setIsLoading] = useState(true); const [message, setMessage] = useState(""); const [reviewing, setReviewing] = useState<string | null>(null); const [review, setReview] = useState({ rating: "5", comment: "" });
  async function load() { setIsLoading(true); try { const [sessionData, memberData] = await Promise.all([skillApi.sessions(), skillApi.me()]); setSessions(sessionData.sessions); setMember(memberData.user); } catch (error) { setMessage((error as Error).message); } finally { setIsLoading(false); } }
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, []);
  async function action(id: string, actionName: "accept" | "decline" | "cancel" | "confirm-complete") { try { const response = await skillApi.updateSession(id, actionName); setMessage(response.message); await load(); } catch (error) { setMessage((error as Error).message); } }
  async function submitReview(sessionId: string) { try { await skillApi.createReview({ sessionId, rating: Number(review.rating), comment: review.comment }); setMessage("Thanks—your review helps the community choose an hour with confidence."); setReviewing(null); setReview({ rating: "5", comment: "" }); } catch (error) { setMessage((error as Error).message); } }
  const teaching = sessions.filter((item) => item.teacher._id === member?._id); const learning = sessions.filter((item) => item.learner._id === member?._id);
  return <AuthGuard><div className="shell page-section"><header className="page-heading"><p className="eyebrow rust">WHERE TIME GETS SHARED</p><h1>My sessions.</h1><p>Keep an eye on requests, confirmed lessons, and the swaps you have completed together.</p></header>{message && <p className="form-message success">{message}</p>}{isLoading ? <div className="stack-skeleton"><div className="skeleton card" /><div className="skeleton card" /></div> : <div className="session-groups"><SessionGroup title="Teaching" copy="Requests from members who want to learn from you." sessions={teaching} member={member} onAction={action} reviewing={reviewing} setReviewing={setReviewing} review={review} setReview={setReview} onReview={submitReview} /><SessionGroup title="Learning" copy="Lessons you have asked other SkillSwap members to teach." sessions={learning} member={member} onAction={action} reviewing={reviewing} setReviewing={setReviewing} review={review} setReview={setReview} onReview={submitReview} /></div>}</div></AuthGuard>;
}

function SessionGroup({ title, copy, sessions, member, onAction, reviewing, setReviewing, review, setReview, onReview }: { title: string; copy: string; sessions: Session[]; member: Member | null; onAction: (id: string, action: "accept" | "decline" | "cancel" | "confirm-complete") => void; reviewing: string | null; setReviewing: (id: string | null) => void; review: { rating: string; comment: string }; setReview: (value: { rating: string; comment: string }) => void; onReview: (id: string) => void }) {
  return <section className="session-group"><div className="section-heading"><div><p className="eyebrow rust">{title.toUpperCase()}</p><h2>{title} sessions</h2><p>{copy}</p></div></div>{sessions.length ? <div className="session-list">{sessions.map((session) => { const isTeacher = session.teacher._id === member?._id; const other = isTeacher ? session.learner : session.teacher; return <article className="session-card" key={session._id}><div className="session-card-main"><span className={`session-status ${session.status.toLowerCase()}`}>{session.status}</span><h3>{session.skillName}</h3><div className="session-person"><Avatar member={other} size="sm" /><span>{isTeacher ? "Learner" : "Teacher"}: <strong>{other.name}</strong></span></div></div><div className="session-time"><span><Calendar /> {new Date(session.proposedTime).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span><span><Clock /> {new Date(session.proposedTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {session.durationHours} hr</span></div><SessionActions session={session} isTeacher={isTeacher} onAction={onAction} onReview={() => setReviewing(reviewing === session._id ? null : session._id)} />{reviewing === session._id && <div className="review-form"><label className="form-label">Rating<select value={review.rating} onChange={(event) => setReview({ ...review, rating: event.target.value })}>{[5,4,3,2,1].map((rating) => <option key={rating}>{rating}</option>)}</select></label><label className="form-label">A short review<textarea value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} placeholder={`What made learning with ${other.name.split(" ")[0]} helpful?`} /></label><button type="button" className="button button-dark compact" disabled={!review.comment.trim()} onClick={() => onReview(session._id)}>Submit review</button></div>}</article>; })}</div> : <div className="empty-panel compact-empty"><p>No {title.toLowerCase()} sessions yet. Your next good hour is waiting in the marketplace.</p></div>}</section>;
}

function SessionActions({ session, isTeacher, onAction, onReview }: { session: Session; isTeacher: boolean; onAction: (id: string, action: "accept" | "decline" | "cancel" | "confirm-complete") => void; onReview: () => void }) {
  if (session.status === "Requested") {
    const proposedBy = session.proposedBy || "Learner";
    const isRecipient = (proposedBy === "Teacher" && !isTeacher) || (proposedBy === "Learner" && isTeacher);
    return (
      <div className="session-actions">
        {isRecipient ? (
          <>
            <button className="button button-rust compact" type="button" onClick={() => onAction(session._id, "accept")}>Accept</button>
            <button className="text-button" type="button" onClick={() => onAction(session._id, "decline")}>Decline</button>
          </>
        ) : (
          <button className="text-button" type="button" onClick={() => onAction(session._id, "cancel")}>Cancel request</button>
        )}
      </div>
    );
  }
  if (session.status === "Confirmed") return <div className="session-actions"><button className="button button-rust compact" type="button" onClick={() => onAction(session._id, "confirm-complete")}>{isTeacher ? (session.teacherConfirmedComplete ? "You confirmed completion" : "Confirm session complete") : (session.learnerConfirmedComplete ? "You confirmed completion" : "Confirm session complete")}</button><span className="confirmation-note">{session.teacherConfirmedComplete && session.learnerConfirmedComplete ? "Credit transferred" : "Waiting for both confirmations"}</span></div>;
  if (session.status === "Completed") return <div className="session-actions"><span className="confirmation-note">Swap complete · credit transferred</span><button className="text-button" type="button" onClick={onReview}>Leave a review</button></div>;
  if (session.status === "Declined") return <div className="session-actions"><span className="confirmation-note text-red-500" style={{ color: "#d9383a" }}>Request declined. No credits moved.</span></div>;
  if (session.status === "Cancelled") return <div className="session-actions"><span className="confirmation-note text-gray-500">Request cancelled. No credits moved.</span></div>;
  return null;
}
