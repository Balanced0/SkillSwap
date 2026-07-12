import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <section>
          <Link className="wordmark" href="/">SKILLSWAP</Link>
          <p>A time-banked network built on one idea: every hour of your time is worth every other hour.</p>
          <a className="footer-contact" href="mailto:hello@skillswap.community">hello@skillswap.community</a>
        </section>
        <section>
          <h2>Platform</h2>
          <Link href="/explore">Explore skills</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>
        </section>
        <section>
          <h2>Account</h2>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Create account</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/listings/add">List a skill</Link>
        </section>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 SKILLSWAP · NO MONEY USED IN THE MAKING OF THIS COMMUNITY</span>
        <span><Link href="/terms">Terms</Link><Link href="/faq">FAQ</Link></span>
      </div>
    </footer>
  );
}
