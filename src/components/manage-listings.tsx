"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { skillApi } from "@/lib/api";
import type { Listing } from "@/lib/types";

export function ManageListings() {
  const [listings, setListings] = useState<Listing[]>([]); const [isLoading, setIsLoading] = useState(true); const [message, setMessage] = useState("");
  async function load() { setIsLoading(true); try { const data = await skillApi.myListings(); setListings(data.listings); } catch (error) { setMessage((error as Error).message); } finally { setIsLoading(false); } }
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, []);
  async function update(id: string, action: "pause" | "activate" | "delete") { if (action === "delete" && !window.confirm("Delete this listing? Existing session records will stay intact.")) return; try { if (action === "delete") await skillApi.deleteListing(id); else await skillApi.updateListing(id, { status: action === "pause" ? "Paused" : "Active" }); await load(); } catch (error) { setMessage((error as Error).message); } }
  return <AuthGuard><div className="shell page-section"><header className="page-heading page-heading-row"><div><p className="eyebrow rust">YOUR TEACHING</p><h1>Manage listings.</h1><p>Keep your offers clear and your availability current.</p></div><Link className="button button-rust" href="/listings/add">+ List a skill</Link></header>{message && <p className="form-message error">{message}</p>}{isLoading ? <div className="stack-skeleton"><div className="skeleton card" /><div className="skeleton card" /></div> : listings.length ? <div className="manage-list">{listings.map((listing) => <article className="manage-row" key={listing._id}><div><span className={`status-dot ${listing.status === "Active" ? "active" : "paused"}`}>{listing.status}</span><h2>{listing.title}</h2><p>{listing.category} · {listing.level}</p></div><div className="manage-actions"><Link href={`/skills/${listing._id}`}>View</Link><button type="button" onClick={() => update(listing._id, listing.status === "Active" ? "pause" : "activate")}>{listing.status === "Active" ? "Pause" : "Activate"}</button><button className="danger-action" type="button" onClick={() => update(listing._id, "delete")}>Delete</button></div></article>)}</div> : <div className="empty-panel"><h2>Nothing listed yet.</h2><p>Your knowledge has value here. Turn a useful hour into your first SkillSwap listing.</p><Link className="button button-rust" href="/listings/add">List a skill</Link></div>}</div></AuthGuard>;
}
