import { site } from "@/content/site";

const links = [
  { href: site.links.email, label: "Email" },
  { href: site.links.resume, label: "Resume" },
  { href: site.links.github, label: "GitHub" },
  { href: site.links.gitlab, label: "GitLab" },
  { href: site.links.linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} · {site.email}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-ink"
              {...(item.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
