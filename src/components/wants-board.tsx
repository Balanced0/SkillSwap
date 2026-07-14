"use client";

import { Magnifier, Plus, TrashBin, Star, Calendar } from "@gravity-ui/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { skillApi } from "@/lib/api";
import { skillCategories, type Want, type Member } from "@/lib/types";

export function WantsBoard() {
  const [wants, setWants] = useState<Want[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Post form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ skillName: "", category: "Coding", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Propose session state
  const [proposingSession, setProposingSession] = useState<{ wantId: string; learnerId: string; learnerName: string; skillName: string } | null>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [selectedListingId, setSelectedListingId] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [proposeMessage, setProposeMessage] = useState("");
  const [isProposing, setIsProposing] = useState(false);

  useEffect(() => {
    // Load logged in user
    skillApi.me().then(({ user }) => setMember(user)).catch(() => setMember(null));
  }, []);

  const loadWants = () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (searchQuery) params.set("search", searchQuery);
    if (category) params.set("category", category);

    skillApi.wants(`?${params.toString()}`)
      .then((data) => {
        setWants(data.wants);
        setPages(data.pages);
        setTotal(data.total);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadWants();
    }, searchQuery ? 260 : 0);
    return () => window.clearTimeout(timeout);
  }, [searchQuery, category, page]);

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  async function handleCreateWant(e: React.FormEvent) {
    e.preventDefault();
    if (!form.skillName.trim() || !form.description.trim()) {
      setMessage("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    try {
      await skillApi.createWant(form);
      setForm({ skillName: "", category: "Coding", description: "" });
      setShowForm(false);
      setPage(1);
      loadWants();
      setMessage("Your request has been posted on the learning board!");
    } catch (err: any) {
      setMessage(err.message || "Failed to post learning request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteWant(id: string) {
    if (!window.confirm("Are you sure you want to remove this request?")) return;
    try {
      await skillApi.deleteWant(id);
      loadWants();
      setMessage("Learning request removed.");
    } catch (err: any) {
      setMessage(err.message || "Failed to delete request.");
    }
  }

  const startProposing = (want: Want) => {
    if (!member) {
      window.location.href = `/login?next=/wants`;
      return;
    }
    setProposingSession({
      wantId: want._id,
      learnerId: want.user._id,
      learnerName: want.user.name,
      skillName: want.skillName,
    });
    setProposeMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Fetch my listings
    skillApi.myListings().then((data) => {
      const active = data.listings.filter(l => l.status === "Active");
      setMyListings(active);
      if (active.length > 0) {
        setSelectedListingId(active[0]._id);
      } else {
        setSelectedListingId("");
      }
    }).catch(() => {
      setMyListings([]);
      setSelectedListingId("");
    });
  };

  const submitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingId || !proposedTime || !proposingSession) return;
    setIsProposing(true);
    setProposeMessage("");
    try {
      await skillApi.requestSession({
        listingId: selectedListingId,
        proposedTime,
        learnerId: proposingSession.learnerId,
      });
      setProposeMessage("Offer sent! The learner can now accept or decline it from their sessions page.");
      setTimeout(() => {
        setProposingSession(null);
        setProposedTime("");
      }, 3000);
    } catch (err: any) {
      setProposeMessage(err.message || "Failed to send teaching offer.");
    } finally {
      setIsProposing(false);
    }
  };

  return (
    <div className="shell page-section wants-page">
      <header className="page-heading page-heading-row">
        <div>
          <p className="eyebrow rust">COMMUNITY WISHLIST</p>
          <h1>The Learning Board</h1>
          <p>Browse what other members want to learn. Offer to teach them, or post your own learning request.</p>
        </div>
        {member ? (
          <button className="button button-rust" onClick={() => setShowForm(!showForm)}>
            <Plus /> {showForm ? "Close form" : "Request a skill"}
          </button>
        ) : (
          <Link className="button button-rust" href="/login?next=/wants">
            Sign in to request a skill
          </Link>
        )}
      </header>

      {message && <p className="form-message success" style={{ marginBottom: "2rem" }}>{message}</p>}

      {showForm && member && (
        <section className="form-section shadow-sm border border-beige p-6 rounded-lg mb-8" style={{ background: "#fdfbf7", marginBottom: "2rem", padding: "2rem", borderRadius: "8px", border: "1px solid #e7ded0" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>What do you want to learn?</h2>
          <form onSubmit={handleCreateWant} className="editor-form">
            <div className="field-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <label className="form-label">
                I want to learn...
                <input
                  required
                  value={form.skillName}
                  onChange={(e) => setForm({ ...form, skillName: e.target.value })}
                  placeholder="e.g. Guitar (Beginner-Intermediate) or Spanish conversation"
                />
              </label>
              <label className="form-label">
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {skillCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="form-label" style={{ marginBottom: "1rem" }}>
              Tell prospective teachers what you are looking for
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. I am looking for a 1-hour session to cover basic chords. I have my own acoustic guitar."
              />
            </label>
            <div className="form-actions" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button className="button button-rust" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post request"}
              </button>
              <button className="button button-outline" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {proposingSession && (
        <section className="form-section shadow-sm border border-beige p-6 rounded-lg mb-8" style={{ background: "#fdfbf7", marginBottom: "2rem", padding: "2rem", borderRadius: "8px", border: "1px solid #e7ded0" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Offer to teach {proposingSession.learnerName}</h2>
          <p style={{ color: "#706b66", marginBottom: "1.5rem" }}>Propose one of your active listings to teach them <strong>{proposingSession.skillName}</strong>.</p>
          
          {proposeMessage && (
            <p className={`form-message ${proposeMessage.includes("sent") ? "success" : "error"}`} style={{ marginBottom: "1.5rem" }}>
              {proposeMessage}
            </p>
          )}

          {myListings.length === 0 ? (
            <div style={{ padding: "1rem 0" }}>
              <p style={{ marginBottom: "1rem" }}>You don’t have any active listings to offer. Please list a skill in the marketplace first.</p>
              <Link href="/listings/add" className="button button-rust">
                Create a listing
              </Link>
              <button className="button button-outline" type="button" onClick={() => setProposingSession(null)} style={{ marginLeft: "1rem" }}>
                Cancel
              </button>
            </div>
          ) : (
            <form onSubmit={submitProposal} className="editor-form">
              <div className="field-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <label className="form-label">
                  Select your skill listing
                  <select
                    required
                    value={selectedListingId}
                    onChange={(e) => setSelectedListingId(e.target.value)}
                  >
                    {myListings.map((listing) => (
                      <option key={listing._id} value={listing._id}>
                        {listing.title} ({listing.category})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-label">
                  Propose a date & time
                  <input
                    type="datetime-local"
                    required
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-actions" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button className="button button-rust" type="submit" disabled={isProposing || !selectedListingId || !proposedTime}>
                  {isProposing ? "Sending offer..." : "Send teaching offer"}
                </button>
                <button className="button button-outline" type="button" onClick={() => setProposingSession(null)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="filters" aria-label="Filter wants" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <label className="search-field" style={{ flex: "2" }}>
          <Magnifier />
          <input
            value={searchQuery}
            onChange={(e) => updateFilter(setSearchQuery, e.target.value)}
            placeholder="Search wants, topics, or members..."
          />
        </label>
        <label style={{ flex: "1" }}>
          <span>Category</span>
          <select value={category} onChange={(e) => updateFilter(setCategory, e.target.value)}>
            <option value="">All categories</option>
            {skillCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </section>

      <div className="results-bar" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{isLoading ? "Loading requests..." : `${total} ${total === 1 ? "request" : "requests"} found`}</span>
        {(searchQuery || category) && (
          <button type="button" className="text-button" onClick={() => { setSearchQuery(""); setCategory(""); setPage(1); }}>
            Clear filters
          </button>
        )}
      </div>

      {error ? (
        <div className="inline-message error">
          <strong>We couldn’t load the learning board.</strong>
          <span>{error}</span>
        </div>
      ) : isLoading ? (
        <div className="listing-grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="skeleton listing-skeleton" key={item} />
          ))}
        </div>
      ) : wants.length ? (
        <>
          <div className="wants-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {wants.map((want) => {
              const isOwner = member?._id === want.user._id;
              return (
                <article key={want._id} className="listing-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "1.5rem", border: "1px solid #e7ded0", borderRadius: "8px", position: "relative" }}>
                  <div>
                    <div className="listing-card-topline" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span className="eyebrow rust">{want.category}</span>
                      <span style={{ fontSize: "0.8rem", color: "#706b66", display: "inline-flex", alignItems: "center", gap: "4px" }}><Calendar /> {new Date(want.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", margin: "0.5rem 0", fontWeight: "600" }}>{want.skillName}</h3>
                    <p className="listing-description" style={{ color: "#54504b", fontSize: "0.95rem", lineHeight: "1.5" }}>{want.description}</p>
                  </div>
                  <div className="listing-teacher" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #f8f4ec" }}>
                    <Link href={`/members/${want.user._id}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "inherit" }}>
                      <Avatar member={want.user} size="sm" />
                      <div>
                        <strong>{want.user.name}</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#706b66" }}>{want.user.location || "SkillSwap member"}</span>
                      </div>
                    </Link>
                    {isOwner ? (
                      <button
                        onClick={() => handleDeleteWant(want._id)}
                        className="danger-action"
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#d9383a", display: "flex", alignItems: "center", gap: "4px" }}
                        title="Delete request"
                      >
                        <TrashBin /> Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => startProposing(want)}
                        className="button button-dark compact"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                      >
                        Offer to teach
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      ) : (
        <div className="empty-panel">
          <h2>No learning requests match that search.</h2>
          <p>Got a skill you want to learn? Post a request to find a teacher.</p>
        </div>
      )}
    </div>
  );
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Listing pages" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className="button button-outline compact">
        ← Previous
      </button>
      <span>Page {page} of {pages}</span>
      <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} className="button button-outline compact">
        Next →
      </button>
    </nav>
  );
}
