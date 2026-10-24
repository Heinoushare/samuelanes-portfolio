import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { fsaeCar, ftcPits, sabacc, sailboatWater } from "@/content/images";
import { pageMetadata } from "@/content/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Engineering work by Samuel Anes: driverless controls and path planning for Carnegie Mellon Racing, four seasons of FIRST Tech Challenge robot software, a real-time multiplayer web app, and Arduino embedded projects.",
  image: fsaeCar,
  path: "/projects",
  type: "website",
});

type Area = {
  href: string;
  kicker: string;
  title: string;
  blurb: string;
  skills: string[];
  image: StaticImageData;
  imageClass?: string;
  alt: string;
  meta: string;
};

const areas: Area[] = [
  {
    href: "/projects/fsae",
    kicker: "Carnegie Mellon Racing · Sept 2026 – present",
    title: "Driverless Controls and Path Planning",
    blurb:
      "Regenerative braking strategy for an electric Formula SAE car, the longitudinal model that says how much deceleration it buys, and the path planner that decides where the track goes. Three write-ups.",
    skills: [
      "C++",
      "C",
      "ROS 2",
      "Linux",
      "Python",
      "Control Design",
    ],
    image: fsaeCar,
    imageClass: "object-[center_62%]",
    alt: "Carnegie Mellon Formula SAE Electric car 46 on track in driverless configuration",
    meta: "3 write-ups",
  },
  {
    href: "/projects/ftc",
    kicker: "FIRST Tech Challenge · 2022 – 2026",
    title: "Robot Autonomy and Controls",
    blurb:
      "Four seasons of robot software for Team 2845: running subsystems in parallel, localization that survives fast corners, OpenCV pipelines, and a turret that aims itself while the robot drives.",
    skills: [
      "Java",
      "OpenCV",
      "Sensor Fusion",
      "PID Control",
      "Multithreading",
    ],
    image: ftcPits,
    alt: "Samuel Anes working on the Team 2845 robot in the pits",
    meta: "4 write-ups",
  },
  {
    href: "/projects/sabacc",
    kicker: "Founder and Lead Developer · 2023 – present",
    title: "Real-Time Multiplayer Card Game",
    blurb:
      "A web app for playing Sabacc against other people online, built alone then opened up to a team of contributors. It has served 1,000+ users and is still running.",
    skills: [
      "SvelteKit",
      "TypeScript",
      "Flask",
      "Socket.IO",
      "SQLite / PostgreSQL",
    ],
    image: sabacc,
    alt: "An eight-player Sabacc game on the current table layout",
    meta: "Live",
  },
  {
    href: "/projects/embedded",
    kicker: "Personal Projects · 2022 – 2023",
    title: "Embedded Projects",
    blurb:
      "A radio-controlled sailboat with a hand-soldered adapter board, and two generations of a speedcubing timer. Every part mine: circuit, firmware, and printed structure.",
    skills: [
      "Arduino",
      "C++",
      "XBee Radio",
      "Soldering",
      "Oscilloscope",
      "3D Printers",
    ],
    image: sailboatWater,
    alt: "The remote-control catamaran sailboat sailing on open water",
    meta: "2 write-ups",
  },
];

export default function ProjectsIndexPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 py-16">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          Samuel Anes · Engineering Work
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Projects
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/90">
          Robotics, controls and systems work, written up the way I would
          explain it to a teammate: what the problem was, what I tried that did
          not work, and what the numbers say.
        </p>
      </header>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        {areas.map((area) => (
          <Link key={area.href} href={area.href} className="group flex flex-col">
            <div className="overflow-hidden border border-line bg-card">
              <Image
                src={area.image}
                alt={area.alt}
                className={`h-56 w-full bg-white object-cover ${
                  area.imageClass ?? "object-center"
                }`}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                {area.kicker}
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-accent">
                {area.meta}
              </p>
            </div>
            <h2 className="mt-2 font-serif text-2xl leading-snug text-ink group-hover:underline">
              {area.title}
            </h2>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">
              {area.blurb}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2 border-t border-line pt-4">
              {area.skills.map((skill) => (
                <li
                  key={skill}
                  className="border border-line px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </article>
  );
}
