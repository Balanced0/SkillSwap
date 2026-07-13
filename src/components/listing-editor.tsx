"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { skillApi } from "@/lib/api";
import { skillCategories, skillLevels } from "@/lib/types";

export function ListingEditor({ listingId }: { listingId?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!listingId);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: "", shortDescription: "", description: "", category: "Coding", level: "Beginner", tags: "", availabilityDay: "", availabilityTimes: "", imageUrl: "" });

  useEffect(() => {
    if (listingId) {
      setIsLoading(true);
      skillApi.listing(listingId)
        .then((data) => {
          const l = data.listing;
          const firstAvail = l.availability?.[0];
          setForm({
            title: l.title,
            shortDescription: l.description.slice(0, 260),
            description: l.description,
            category: l.category,
            level: l.level,
            tags: l.tags?.join(", ") || "",
            availabilityDay: firstAvail?.day || "",
            availabilityTimes: firstAvail?.timeSlots?.join(", ") || "",
            imageUrl: l.imageUrl || "",
          });
          setMessage("");
        })
        .catch((err: Error) => setMessage(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [listingId]);

  function update(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })); }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsSubmitting(true); setMessage("");
    try {
      const payload = {
        title: form.title,
        description: form.description || form.shortDescription,
        category: form.category as any,
        level: form.level as any,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        availability: form.availabilityDay ? [{ day: form.availabilityDay, timeSlots: form.availabilityTimes.split(",").map((time) => time.trim()).filter(Boolean) }] : [],
        imageUrl: form.imageUrl || undefined
      };

      if (listingId) {
        const { listing } = await skillApi.updateListing(listingId, payload);
        router.push(`/skills/${listing._id}`);
      } else {
        const { listing } = await skillApi.createListing(payload);
        router.push(`/skills/${listing._id}`);
      }
    } catch (error) { setMessage((error as Error).message); }
    finally { setIsSubmitting(false); }
  }

  if (isLoading) return <div className="shell page-loading"><div className="skeleton title" /><div className="skeleton card" /></div>;

  return <AuthGuard><div className="shell page-section form-page"><header className="page-heading"><p className="eyebrow rust">{listingId ? "REFINE YOUR SWAP" : "TEACH WHAT YOU KNOW"}</p><h1>{listingId ? "Edit listing." : "List a skill."}</h1><p>{listingId ? "Keep your details clear and availability up to date." : "Set the expectation for one excellent hour. You can add another listing for every skill you want to share."}</p></header><form className="editor-form" onSubmit={submit}><div className="form-group"><h2>The offer</h2><label className="form-label">Skill title<input required maxLength={90} value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="e.g. Intro to Python for creatives" /></label><label className="form-label">A quick promise<input required maxLength={260} value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} placeholder="What will someone be able to do after this hour?" /></label><label className="form-label">Full description<textarea required rows={6} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe the lesson, who it is for, and what you will cover." /></label></div><div className="form-group"><h2>The details</h2><div className="field-row"><label className="form-label">Category<select value={form.category} onChange={(event) => update("category", event.target.value)}>{skillCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="form-label">Level<select value={form.level} onChange={(event) => update("level", event.target.value)}>{skillLevels.map((item) => <option key={item}>{item}</option>)}</select></label></div><label className="form-label">Tags <small>(comma-separated)</small><input value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="Python, automation, beginner-friendly" /></label><label className="form-label">Image URL <small>(optional)</small><input type="url" value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} placeholder="https://…" /></label></div><div className="form-group"><h2>When you’re available</h2><div className="field-row"><label className="form-label">Day or days<input value={form.availabilityDay} onChange={(event) => update("availabilityDay", event.target.value)} placeholder="Weekdays" /></label><label className="form-label">Time slots<input value={form.availabilityTimes} onChange={(event) => update("availabilityTimes", event.target.value)} placeholder="18:00–20:00, 20:30–21:30" /></label></div><p className="form-hint">You and your learner agree on the exact time after they request the session.</p></div>{message && <p className="form-message error">{message}</p>}<div className="form-actions"><button className="button button-rust" type="submit" disabled={isSubmitting}>{isSubmitting ? (listingId ? "Saving…" : "Publishing…") : (listingId ? "Save changes" : "Publish my listing")}</button></div></form></div></AuthGuard>;
}
