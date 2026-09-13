import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { ftcPits } from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "FTC Team 2845",
  description:
    "Autonomy stack for FTC Team 2845: command framework, 3-wheel + IMU odometry, OpenCV, and a data-driven launcher.",
};

const results = [
  ["2022–23", "Control Award · Florida State"],
  ["2023–24", "R.O.B.O.T. Leage Winning Alliance Captain · Florida State Championship"],
  ["2024–25", "R.O.B.O.T. Leage Winning Winning Alliance Captain · Florida State Championship"],
  ["2025–26", "R.O.B.O.T. Leage Inspire Award 1st Place and Winning Alliance Partner · Winning Alliance Partner · Florida State Championship"],
];

export default function FtcPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="FIRST Tech Challenge · Team 2845"
        title="FTC Robotics"
        outcome="I rebuilt the team’s Java architecture and wrote the autonomy stack: localization, vision, PID navigation, and a data-driven launcher."
        meta="Team captain 2024–2026 · programmer 2022–2026 · FIRST Dean’s List Semi-Finalist"
        stack="Java · Android · OpenCV · PID"
        links={[
          { href: site.links.ftc2025, label: "2025–26 GitLab", external: true },
          { href: site.links.ftc2023, label: "2023–24 GitLab", external: true },
          { href: site.links.ftcVideo, label: "Watch the 2026 design video", external: true },
        ]}
      />

      <figure className="mt-10">
        <Image
          src={ftcPits}
          alt="Samuel Anes working on the Team 2845 robot in the pits"
          width={1438}
          height={1800}
          priority
          className="h-[min(32rem,70vh)] w-full border border-line object-cover object-[center_70%]"
        />
        <figcaption className="mt-3 text-sm text-muted">
          Pits, Team 2845. Robot 2845 on the stand.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Command framework</h2>
        <p>
          The code splits into OpModes, Subsystems, Commands, and Utilities.
          Commands run in sequence or in parallel, so intake, turret, and
          drivetrain can move together in autonomous. Newer teammates start on
          commands and OpModes; the harder hardware interaction stays in
          subsystems. That split doubled the number of people committing in
          2025–26.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Localization</h2>
        <p>
          Two-wheel + IMU odometry is accurate on simple moves and wrong on
          complex ones — the IMU updates too slowly. Three-wheel odometry is
          the reverse: better in the moment, more drift over time. I ran both:
          a third pod for the hard motions, periodic IMU correction so error
          does not accumulate, and a fallback to two-wheel + IMU if a pod
          dies. That pose feeds a PID point-to-point navigator.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Vision</h2>
        <p>
          HSV masks, contour filters, and geometric constraints find game
          elements and estimate pose relative to the robot. For team-prop
          detection I designed the prop as a solid cube so a square bounding
          box is a real filter, not a hope. AprilTags handle approach and
          scoring. In 2025–26, drivetrain aiming failed under defense; we
          added a turret and aimed at the back corner of the goal — the
          target that stayed consistent.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Launcher model</h2>
        <p>
          Launch velocity is a fit: AprilTag image area against measured
          distance, then a natural-exponential curve for flywheel speed. Color
          and distance sensors on the spindexer track which slots are full so
          the intake only runs when an empty slot is in position — the
          mechanical intake could run over 1,000 RPM without jamming the
          indexer.
        </p>
      </section>

      <section className="mt-12">
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
        <h2 className="font-serif text-2xl text-ink">2026 design video</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/90">
          Five minutes on the turret, custom bearing, aiming, and how the
          software was structured so more people could work in it. Recorded
          for a scholarship; the last line mentions WPI — I went to CMU.
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
    </article>
  );
}
