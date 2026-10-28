import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "My Bookings", href: "/mybookings" },
  { label: "My Profile", href: "/profile" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="overflow-x-clip bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 sm:px-8 sm:pt-14">
        <Link
          href="/"
          aria-label="Wanderlast home"
          className="font-(family-name:--font-display) text-6xl font-bold leading-none tracking-tight sm:text-7xl"
        >
          Wanderlast
        </Link>
        <p className="mt-1 text-sm text-neutral-400">
          Your gateway to extraordinary travel experiences around the world.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4 sm:gap-8">
          <section aria-labelledby="footer-newsletter">
            <h2
              id="footer-newsletter"
              className="font-(family-name:--font-display) text-base"
            >
              NEWSLETTER
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form className="mt-2 flex h-9 max-w-56 bg-[#333]">
              <label htmlFor="footer-email" className="sr-only">
                Enter email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter email"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                aria-label="Subscribe to newsletter"
                className="px-3 text-white transition-colors hover:text-cyan-400"
              >
                <ArrowUpRight aria-hidden="true" size={17} />
              </button>
            </form>
          </section>

          <nav aria-labelledby="footer-quick-links">
            <h2
              id="footer-quick-links"
              className="font-(family-name:--font-display) text-base"
            >
              QUICK LINKS
            </h2>
            <ul className="mt-2 space-y-2 text-sm text-neutral-400">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link className="transition-colors hover:text-white" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-support">
            <h2
              id="footer-support"
              className="font-(family-name:--font-display) text-base"
            >
              SUPPORT
            </h2>
            <ul className="mt-2 space-y-2 text-sm text-neutral-400">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link className="transition-colors hover:text-white" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="font-(family-name:--font-display) text-base"
            >
              CONTACT US
            </h2>
            <address className="mt-2 space-y-2 text-sm not-italic text-neutral-400">
              <p>
                <a className="transition-colors hover:text-white" href="tel:7869011622">
                  786 901 1622
                </a>
              </p>
              <p>
                <a
                  className="transition-colors hover:text-white"
                  href="mailto:info@wandarland.com"
                >
                  info@wandarland.com
                </a>
              </p>
            </address>
          </section>
        </div>

      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-3 text-xs text-neutral-400 sm:px-8">
          <p>© 2026 Wanderlast. All rights reserved.</p>
          <nav aria-label="Social media" className="flex items-center gap-5">
            <a
              href="https://x.com"
              aria-label="X"
              className="text-base font-semibold text-white transition-colors hover:text-cyan-400"
            >
              X
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="text-white transition-colors hover:text-cyan-400"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
                <path d="M3.4 2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM2.2 5.7h2.4V14H2.2V5.7Zm3.9 0h2.3v1.1h.03c.32-.6 1.1-1.3 2.28-1.3 2.44 0 2.9 1.6 2.9 3.7V14h-2.4V9.7c0-1 0-2.3-1.4-2.3S8.2 8.5 8.2 9.7V14H6.1V5.7Z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-white transition-colors hover:text-cyan-400"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4 fill-none stroke-current"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="12" height="12" rx="3" />
                <circle cx="8" cy="8" r="2.8" />
                <circle cx="11.7" cy="4.4" r=".7" className="fill-current stroke-none" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
