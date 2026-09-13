import Image from "next/image";
import Link from "next/link";
import { fsaeCar, ftcPits, headshot, sabacc } from "@/content/images";
import { site, skills } from "@/content/site";

const contacts = [
  { href: site.links.resume, label: "Resume" },
  { href: site.links.email, label: "Email" },
  { href: site.links.linkedin, label: "LinkedIn", external: true },
  { href: site.links.github, label: "GitHub", external: true },
  { href: site.links.gitlab, label: "GitLab", external: true },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-12 sm:pt-24">
        <div className="flex items-start justify-between gap-8">
          <div className="min-w-0 max-w-2xl">
            <p className="text-sm text-muted">{site.role}</p>
            <h1 className="mt-3 font-serif text-5xl leading-[1.1] tracking-tight text-ink sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-5 text-lg text-ink/90">{site.interests}</p>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">
              {site.proof}
            </p>
          </div>
          <Image
            src={headshot}
            alt="Portrait of Samuel Anes"
            width={900}
            height={900}
            priority
            className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-28 sm:w-28"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {contacts.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-ink"
              {...(item.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {item.label}
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm">
          <a href={site.links.email} className="text-accent hover:underline">
            {site.email}
          </a>
        </p>

        <div className="mt-10">
          <p className="max-w-2xl leading-relaxed text-muted">
            Carnegie Mellon University, B.S. Electrical and Computer
            Engineering, Graduating May 2030.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Programming Languages
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {skills.languages.join(" · ")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Tools
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {skills.tools.join(" · ")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Extra
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {skills.extracurriculars.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-5xl scroll-mt-16 px-5 pb-16">
        <h2 className="mb-8 font-serif text-3xl text-ink sm:text-4xl">
          Engineering Experience
        </h2>
        <Link href="/projects/fsae" className="group block">
          <figure className="overflow-hidden border border-line bg-card">
            <Image
              src={fsaeCar}
              alt="Carnegie Mellon Formula SAE Electric car 46 on track in driverless configuration"
              width={2400}
              height={1600}
              priority
              className="h-[min(34rem,70vh)] w-full object-cover object-[center_62%]"
            />
          </figure>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-accent">
                Featured · Regenerative Braking, Driverless Controls
              </p>
              <h2 className="mt-2 font-serif text-3xl text-ink">
                CMU Formula SAE Electric
              </h2>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
                Speed-dependent pedal map for regenerative braking. Tested on logged
                vehicle data, then run on the car, September 2026.
              </p>
            </div>
            <span className="text-sm text-accent group-hover:underline">
              Read the work
            </span>
          </div>
        </Link>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <Link href="/projects/ftc" className="group">
            <div className="overflow-hidden border border-line bg-card">
              <Image
                src={ftcPits}
                alt="Samuel Anes working on FTC Team 2845 robot in the pits"
                width={1438}
                height={1800}
                className="h-72 w-full object-cover object-center"
              />
            </div>
            <h3 className="mt-4 font-serif text-2xl text-ink">
              FIRST Tech Challenge
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Parallel computing, odometry + IMU + computer vision sensor fusion, CAD turret design,and a
              data-driven game element launcher. Three-time winning alliance · 1st Place Inspire
              Award, 2026.
            </p>
            <span className="mt-3 inline-block text-sm text-accent group-hover:underline">
              See the work
            </span>
          </Link>

          <Link href="/projects/sabacc" className="group">
            <div className="overflow-hidden border border-line bg-card">
              <Image
                src={sabacc}
                alt="Sabacc multiplayer table with players seated around a live game"
                width={930}
                height={610}
                className="h-72 w-full object-cover object-center"
              />
            </div>
            <h3 className="mt-4 font-serif text-2xl text-ink">
              Sabacc Web App, Serves 1000+ Users
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Founded and led a global team project develpment team. Object-oriented backend,
              SQLite ↔ Postgres migrations, still actively serving users.
            </p>
            <span className="mt-3 inline-block text-sm text-accent group-hover:underline">
              See the work
            </span>
          </Link>
        </div>

        <p className="mt-12 text-sm leading-relaxed text-muted">
          Also built: an Arduino remote-control sailboat with XBee radios,
          custom perfboard electronics, and 3D-printed hull parts.{" "}
          <a
            href={site.links.sailboat}
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Code
          </a>
        </p>
      </section>
    </div>
  );
}
