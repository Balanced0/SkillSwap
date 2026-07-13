"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { SectionHeading } from "@/components/section-heading";
import { skillApi } from "@/lib/api";
import type { Listing } from "@/lib/types";

type Stats = { hoursSwapped: number; sessionsCompleted: number; skillsListed: number; members: number };

const initialStats: Stats = { hoursSwapped: 0, sessionsCompleted: 0, skillsListed: 0, members: 0 };

export function HomeLiveSections() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      skillApi.stats().catch(() => initialStats),
      skillApi.listings("?limit=4&sort=rating").catch(() => ({ listings: [] as Listing[], page: 1, pages: 1, total: 0 })),
    ])
      .then(([platformStats, featured]) => {
        setStats(platformStats);
        setListings(featured.listings);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <section className="section section-divider stat-section" aria-label="SkillSwap live platform statistics">
        <div className="shell stat-grid">
          <Stat value={stats.hoursSwapped.toFixed(1)} label="Total hours swapped" />
          <Stat value={String(stats.sessionsCompleted)} label="Sessions completed" accent />
          <Stat value={String(stats.skillsListed)} label="Skills listed" />
          <Stat value={String(stats.members)} label="Members" />
        </div>
      </section>
      <section className="section shell" aria-labelledby="available-skills">
        <SectionHeading
          eyebrow="FROM THE COMMUNITY"
          title="Available skills"
          copy="Fresh listings, published by members who are ready to trade an hour."
          action={<Link className="text-link" href="/explore">Browse all →</Link>}
        />
        {isLoading ? (
          <div className="listing-grid" aria-label="Loading listings">
            {[1, 2, 3, 4].map((index) => <div className="skeleton listing-skeleton" key={index} />)}
          </div>
        ) : listings.length ? (
          <div className="listing-grid">{listings.map((listing) => <ListingCard listing={listing} key={listing._id} />)}</div>
        ) : (
          <div className="empty-panel compact-empty">
            <h3>No listings yet</h3>
            <p>SkillSwap starts with its members. Be the first to offer an hour of what you know.</p>
            <Link className="button button-rust" href="/listings/add">List a skill →</Link>
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return <div className="stat"><strong className={accent ? "rust" : ""}>{value}</strong><span>{label}</span></div>;
}
