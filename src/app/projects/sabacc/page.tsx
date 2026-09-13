import type { Metadata } from "next";
import { ProjectHeader } from "@/components/ProjectHeader";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Sabacc",
  description:
    "Real-time multiplayer Sabacc web app. Svelte, Flask, WebSockets, SQL. 1,000+ users.",
};

export default function SabaccPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="Project founder · April 2024–present"
        title="Sabacc"
        outcome="A real-time multiplayer web app for Sabacc, a rules-heavy card game. I built the first versions alone, then led a team across the country. It has served 1,000+ users."
        meta="Live at sabacc.samuelanes.com"
        stack="Svelte · Flask · SQL · WebSockets"
        links={[
          { href: site.links.sabacc, label: "Play", external: true },
          { href: site.links.sabaccOrg, label: "Sabacc-Org", external: true },
          { href: site.links.sabaccSolo, label: "Earlier repo", external: true },
        ]}
      />

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Architecture</h2>
        <p>
          Flask owns game logic and the database. Svelte compiles the UI and
          keeps the table reactive. WebSockets stay open during a hand so
          updates are not polled. I first hosted it on a Raspberry Pi, then
          moved it to the cloud.
        </p>
        <p>
          The first version was one variant and two players. Three variants
          share a parent on the backend so a new ruleset does not fork the
          whole server. The database went SQLite → Postgres (custom types for
          the OOP models) → SQLite again when cloud hosting and collaboration
          got simpler. Light/dark and card themes live in cookies so
          customization does not hit the server.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">What I would point at</h2>
        <p>
          The useful decisions were WebSockets for live state, a shared
          object model for variants, and being willing to migrate the
          database twice. The UI went from a two-seat table to a full
          layout with a mobile theme.
        </p>
        <p>
          <a
            href={site.links.sabacc}
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            sabacc.samuelanes.com
          </a>
        </p>
      </section>
    </article>
  );
}
