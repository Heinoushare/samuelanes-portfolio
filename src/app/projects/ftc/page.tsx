import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ProjectHeader } from "@/components/ProjectHeader";
import {
  ftcFrameworkDiagram,
  ftcLauncherFit,
  ftcPidGraph,
  ftcPits,
  ftcPropDetection,
} from "@/content/images";
import { pageMetadata } from "@/content/metadata";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "FTC Team 2845",
  description:
    "Four seasons of robot software for FIRST Tech Challenge Team 2845: concurrent subsystem control, localization, computer vision, and a self-aiming turret.",
  image: ftcPits,
  path: "/projects/ftc",
  type: "website",
});

type Post = {
  href: string;
  kicker: string;
  title: string;
  blurb: string;
  skills: string[];
  image: StaticImageData;
  alt: string;
};

const results = [
  [
    "2025–26",
    "R.O.B.O.T. League Inspire Award, 1st Place · Winning Alliance Partner · Florida State Championship",
  ],
  [
    "2024–25",
    "R.O.B.O.T. League Winning Alliance Captain · Florida State Championship",
  ],
  [
    "2023–24",
    "R.O.B.O.T. League Winning Alliance Captain · Florida State Championship",
  ],
  ["2022–23", "Control Award · Florida State Championship"],
];

const roles = [
  {
    title: "Team Captain",
    period: "2024 – 2026",
    summary:
      "Ran the team alongside writing its software: season planning, design reviews, and structuring the codebase so newer members had somewhere to start.",
  },
  {
    title: "Software Lead",
    period: "2022 – 2024",
    summary:
      "Owned the robot code. Rebuilt it around a command framework, then wrote the localization, PID navigation and vision pipelines on top of it.",
  },
];

const posts: Post[] = [
  {
    href: "/projects/ftc/turret",
    kicker: "2025–26 Season",
    title: "Turret Aiming and Launch Control",
    blurb:
      "Aiming by turning the robot fell apart under defense. A camera-fitted launch model worked until the robot moved, so the final version aims from odometry and predicts where the robot will be when the ball lands.",
    skills: ["Java", "Limelight", "Curve Fitting", "Motion Prediction"],
    image: ftcLauncherFit,
    alt: "Scatter of AprilTag image area against flywheel velocity with an exponential fit",
  },
  {
    href: "/projects/ftc/command-framework",
    kicker: "2023–26 Seasons",
    title: "Concurrent Subsystem Control",
    blurb:
      "A robot that drives, stops, intakes, stops, then scores wastes most of its 30 seconds. Four module types let subsystems run side by side, and a single I/O loop kept them from fighting over the hardware.",
    skills: ["Java", "Android Studio", "Multithreading", "Software Architecture"],
    image: ftcFrameworkDiagram,
    alt: "Diagram of the four module types: utilities, OpModes, commands and subsystems",
  },
  {
    href: "/projects/ftc/vision",
    kicker: "2023–24 Season",
    title: "Computer Vision Pipelines",
    blurb:
      "Finding a red or blue team prop in a gym full of red and blue, under lighting that changes venue to venue. Part of the answer was designing the prop as a cube before writing any code.",
    skills: ["Java", "OpenCV", "HSV Segmentation", "AprilTags"],
    image: ftcPropDetection,
    alt: "Camera frame with a red cube detected inside the centre path region",
  },
  {
    href: "/projects/ftc/localization",
    kicker: "2023–24 Season",
    title: "Localization and Navigation",
    blurb:
      "Two-wheel odometry is accurate until the robot drives and turns at once; three-wheel drifts instead. I used both, with the IMU correcting the wheels, feeding a PID point-to-point navigator.",
    skills: ["Java", "Odometry", "Sensor Fusion", "PID Control"],
    image: ftcPidGraph,
    alt: "Logged P, I and D terms during one autonomous move",
  },
];

export default function FtcIndexPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 py-16">
      <div className="max-w-3xl">
        <ProjectHeader
          kicker="FIRST Tech Challenge · Team 2845, Team Duct Tape"
          title="Robot Autonomy and Controls"
          outcome="Over four seasons I went from a new programmer to leading my team’s software to becoming Team Captain. These are four problems that shaped the robot’s code, and how I solved each one."
          meta="2022–2026 · Tampa, FL · FIRST Dean’s List Semi-Finalist"
          stack="Java · Android Studio · OpenCV · Limelight · goBILDA Pinpoint · FTC Dashboard"
          links={[
            { href: site.links.ftc2025, label: "2025–26 code", external: true },
            { href: site.links.ftc2023, label: "2023–24 code", external: true },
            { href: site.links.ftcVideo, label: "2026 Design Video", external: true },
          ]}
        />
      </div>


      <section className="mt-12 max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink/90">
        <p>
          An FTC match opens with 30 seconds of autonomous, where the robot
          runs entirely on its own code, followed by two minutes of driver
          control. The game changes every year, but the software problems
          don’t: the robot has to know where it is, see what’s around it, and
          do several things at once. I wrote most of the robot code in the
          seasons below, and I kept running into the same pattern: the obvious
          approach had a flaw, so I built something that got around it.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-[0.14em] text-muted">Roles</h2>
        <div className="mt-5 grid max-w-3xl gap-6 sm:grid-cols-2">
          {roles.map((role) => (
            <div key={role.title} className="border-l-2 border-accent pl-5">
              <h3 className="font-serif text-xl text-ink">{role.title}</h3>
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
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
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
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-3xl">
      <section className="mt-20 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">Results</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
          {results.map(([year, result]) => (
            <li
              key={year}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-8"
            >
              <span className="w-24 shrink-0 text-muted">{year}</span>
              <span>{result}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">2026 Design Video</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/90">
          Five minutes on the 2025–26 robot: the turret and its custom
          bearing, aiming, and how the code was organized so more teammates
          could work in it. I recorded it for a scholarship application,
          which is why it ends by mentioning WPI.
        </p>
        <div className="mt-6 aspect-video overflow-hidden border border-line bg-ink">
          <iframe
            title="FTC 2026 design video"
            src={site.links.ftcVideoEmbed}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>
      </div>
    </article>
  );
}
