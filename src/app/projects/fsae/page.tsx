import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  dlnChainComparison,
  fsaeCar,
  fsaeMap,
  regenDecelVsBps,
} from "@/content/images";
import { pageMetadata } from "@/content/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Carnegie Mellon Racing",
  description:
    "Driverless controls and path planning work on Carnegie Mellon Racing's Formula SAE Electric car: regenerative braking strategy, longitudinal dynamics modelling, and Delaunay edge selection.",
  image: fsaeCar,
  path: "/projects/fsae",
  type: "website",
});

const roles = [
  {
    subteam: "Driverless Path Planning",
    title: "Delaunay Edge Selection Lead",
    period: "Oct 2026 – present",
    summary:
      "Own the step that turns perceived cone positions into the centreline the controller plans against, and the robustness of the selection that produces it.",
  },
  {
    subteam: "Driverless Controls",
    title: "Regenerative Braking Lead",
    period: "Sept 2026 – present",
    summary:
      "Own how the car converts pedal and torque commands into deceleration: the control strategy, the firmware that runs it, and the analysis that says how much braking it actually delivers.",
  },
];

type Post = {
  href: string;
  kicker: string;
  title: string;
  blurb: string;
  status: string;
  skills: string[];
  image: StaticImageData;
  alt: string;
};

const posts: Post[] = [
  {
    href: "/projects/fsae/delaunay",
    kicker: "Driverless Path Planning · Oct 2026",
    title: "Delaunay Edge Selection",
    blurb:
      "The path planner was pairing up the wrong cones and steering the car off line. Fixing it meant instrumenting the solver, correcting three geometric assumptions, and searching over whole paths instead of one edge at a time.",
    status: "Sim-validated",
    skills: [
      "C++",
      "ROS 2",
      "Computational Geometry",
      "Linux",
      "Docker",
      "Simulation",
    ],
    image: dlnChainComparison,
    alt: "Three candidate midline chains drawn over cone positions, each labelled with its cost and reach",
  },
  {
    href: "/projects/fsae/vehicle-dynamics",
    kicker: "Driverless Controls · Oct 2026",
    title: "Regen Braking Dynamics Modelling",
    blurb:
      "Fitting a braking model to a season of vehicle logs to find out how much deceleration a newton-metre of regen actually buys. The answer is a range, and the reason why is the interesting part.",
    status: "Analysis",
    skills: [
      "Python",
      "NumPy / SciPy",
      "Robust Regression",
      "Vehicle Dynamics",
      "Data Analysis",
    ],
    image: regenDecelVsBps,
    alt: "Scatter of deceleration against brake pressure for 364 braking events, with regen and no-regen events separated",
  },
  {
    href: "/projects/fsae/regen-design",
    kicker: "Driverless Controls · Sept 2026",
    title: "Regenerative Braking Control Design",
    blurb:
      "Two ways to give a driver regen: under the accelerator, or added to the brake pedal. I designed both, validated the first against logged vehicle data, and the team races the second.",
    status: "On the car",
    skills: [
      "C",
      "STM32 Firmware",
      "Control Design",
      "Python",
      "Matplotlib",
    ],
    image: fsaeMap,
    alt: "Torque request plotted against pedal position, with the coast point moving as speed rises",
  },
];

export default function FsaeIndexPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 py-16">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          Carnegie Mellon Racing · Formula SAE Electric
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Driverless Controls and Path Planning
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/90">
          Carnegie Mellon Racing builds an electric Formula SAE car that also
          drives itself. I lead two pieces of it: how the car turns torque
          commands into deceleration, and how it decides where the track goes.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-[0.14em] text-muted">Roles</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {roles.map((role) => (
            <div key={role.title} className="border-l-2 border-accent pl-5">
              <p className="text-xs uppercase tracking-[0.12em] text-accent">
                {role.subteam}
              </p>
              <h3 className="mt-2 font-serif text-xl text-ink">{role.title}</h3>
              <p className="mt-1 text-sm text-muted">{role.period}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/90">
                {role.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="text-xs uppercase tracking-[0.14em] text-muted">
          Write-Ups
        </h2>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group flex flex-col"
            >
              <div className="overflow-hidden border border-line bg-card">
                <Image
                  src={post.image}
                  alt={post.alt}
                  className="h-44 w-full bg-white object-cover object-center"
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted">
                {post.kicker}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-snug text-ink group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">
                {post.blurb}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2 border-t border-line pt-4">
                {post.skills.map((skill) => (
                  <li
                    key={skill}
                    className="border border-line px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-accent">
                {post.status}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
