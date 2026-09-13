import Link from "next/link";

type LinkItem = { href: string; label: string; external?: boolean };

export function ProjectHeader({
  kicker,
  title,
  outcome,
  meta,
  stack,
  status,
  links,
}: {
  kicker: string;
  title: string;
  outcome: string;
  meta: string;
  stack: string;
  status?: string;
  links?: LinkItem[];
}) {
  return (
    <header className="border-b border-line pb-10">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{kicker}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/90">
        {outcome}
      </p>
      {status ? (
        <p className="mt-4 inline-block border border-line px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-accent">
          {status}
        </p>
      ) : null}
      <p className="mt-4 text-sm text-muted">{meta}</p>
      <p className="mt-1 text-sm text-muted">{stack}</p>
      {links && links.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-accent underline-offset-4 hover:underline"
              {...(link.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
