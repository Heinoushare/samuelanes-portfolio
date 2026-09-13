import Link from "next/link";
import { site } from "@/content/site";

const nav = [
  { href: "/#projects", label: "Projects" },
  { href: site.links.resume, label: "Resume" },
  { href: site.links.github, label: "GitHub", external: true },
  { href: site.links.gitlab, label: "GitLab", external: true },
  { href: site.links.email, label: "Email" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="text-sm font-medium tracking-tight">
          {site.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          {nav.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-ink"
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
