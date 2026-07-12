"use client";

import { Magnifier } from "@gravity-ui/icons";
import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { skillApi } from "@/lib/api";
import { skillCategories, skillLevels, type Listing } from "@/lib/types";

export default function ExplorePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "12", sort });
      if (query) params.set("search", query);
      if (category) params.set("category", category);
      if (level) params.set("level", level);
      skillApi.listings(`?${params.toString()}`)
        .then((data) => { setListings(data.listings); setPages(data.pages); setTotal(data.total); setError(""); })
        .catch((requestError: Error) => setError(requestError.message))
        .finally(() => setIsLoading(false));
    }, query ? 260 : 0);
    return () => window.clearTimeout(timeout);
  }, [query, category, level, sort, page]);

  function updateFilter(setter: (value: string) => void, value: string) { setter(value); setPage(1); }

  return <div className="shell page-section explore-page">
    <header className="page-heading"><p className="eyebrow rust">COMMUNITY MARKETPLACE</p><h1>Find an hour worth taking.</h1><p>Explore skills shared by members. The price is always one hour of your own.</p></header>
    <section className="filters" aria-label="Filter skills">
      <label className="search-field"><Magnifier /><input value={query} onChange={(event) => updateFilter(setQuery, event.target.value)} placeholder="Search skills, topics, or teachers" /></label>
      <label><span>Category</span><select value={category} onChange={(event) => updateFilter(setCategory, event.target.value)}><option value="">All categories</option>{skillCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Level</span><select value={level} onChange={(event) => updateFilter(setLevel, event.target.value)}><option value="">All levels</option>{skillLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Sort by</span><select value={sort} onChange={(event) => updateFilter(setSort, event.target.value)}><option value="newest">Newest</option><option value="rating">Highest rated</option><option value="alphabetical">A–Z</option></select></label>
    </section>
    <div className="results-bar"><span>{isLoading ? "Looking for skills…" : `${total} ${total === 1 ? "listing" : "listings"} found`}</span>{(query || category || level) && <button type="button" onClick={() => { setQuery(""); setCategory(""); setLevel(""); setPage(1); }}>Clear filters</button>}</div>
    {error ? <div className="inline-message error"><strong>We couldn’t load the marketplace.</strong><span>{error}</span></div> : isLoading ? <div className="listing-grid">{[1,2,3,4,5,6,7,8].map((item) => <div className="skeleton listing-skeleton" key={item} />)}</div> : listings.length ? <><div className="listing-grid">{listings.map((listing) => <ListingCard listing={listing} key={listing._id} />)}</div><Pagination page={page} pages={pages} onChange={setPage} /></> : <div className="empty-panel"><h2>No skills match that search.</h2><p>Try a broader term or remove a filter. The next great hour may be one listing away.</p></div>}
  </div>;
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;
  return <nav className="pagination" aria-label="Listing pages"><button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>← Previous</button><span>Page {page} of {pages}</span><button type="button" disabled={page === pages} onClick={() => onChange(page + 1)}>Next →</button></nav>;
}
