import type { Metadata } from "next";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Step, Result } from "@/components/Story";

export const metadata: Metadata = {
  title: "Concurrent Subsystem Control",
  description:
    "A command-based robot software architecture for FIRST Tech Challenge Team 2845, letting the drivetrain, intake and launcher run at the same time during autonomous.",
};

const framework = [
  {
    name: "Utilities",
    role: "Know where things are",
    examples: "Odometry · PID · AprilTags · prop locator",
  },
  {
    name: "OpModes",
    role: "Decide what to do",
    examples: "Autonomous · TeleOp",
  },
  {
    name: "Commands",
    role: "Do one job, then finish",
    examples: "PID drive · approach tag · intake · deposit",
  },
  {
    name: "Subsystems",
    role: "Own the hardware",
    examples: "Drivetrain · intake · conveyor · outtake",
  },
];

export default function CommandFrameworkPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="FIRST Tech Challenge · Team 2845 · 2023–26"
        title="Concurrent Subsystem Control"
        outcome="Thirty seconds of autonomous is not much time, and a robot that drives, stops, intakes, stops, then scores spends most of it waiting on itself. I rebuilt the team’s robot code around four module types so subsystems could run side by side, then rebuilt it again when four concurrent threads started fighting over the same hardware."
        meta="2023–2026 · Tampa, FL"
        stack="Java · Android Studio · Multithreading · FTC Dashboard"
      />

      <Step label="The Problem">
        <p>
          Thirty seconds is not much time. A robot that drives, stops, runs
          its intake, stops, and then scores spends most of autonomous
          waiting on itself. The team had a small command library from
          earlier seasons that could run a task in the background on its
          own thread, but almost no robot code was built on it, and there
          was no clear place for a new teammate to add a feature.
        </p>
      </Step>

      <Step label="What I Built">
        <p>
          In 2023–24 I rebuilt the robot code around four kinds of modules.
          Subsystems own the hardware and expose simple methods. Commands
          drive subsystems and know when they are done. OpModes, the
          programs a driver picks on the phone, choose which commands to run
          based on Utilities like odometry and vision. Commands can run one
          after another or side by side, so the robot can drive to a spot
          while the intake gets ready.
        </p>
      </Step>

      <figure className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row">
          {framework.map((box, i) => (
            <div
              key={box.name}
              className="flex flex-col gap-2 sm:flex-1 sm:flex-row"
            >
              {i > 0 ? (
                <span aria-hidden className="self-center text-accent">
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              ) : null}
              <div className="flex-1 border border-line bg-card p-4">
                <p className="font-serif text-lg text-ink">{box.name}</p>
                <p className="mt-1 text-sm text-ink/90">{box.role}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {box.examples}
                </p>
              </div>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-sm text-muted">
          The 2023–24 structure. OpModes read from utilities and run
          commands, and commands control subsystems.
        </figcaption>
      </figure>

      <Step label="Scaling to Four Threads">
        <p>
          By 2025–26, the robot had to aim a turret, hold a flywheel at
          speed, sort balls, and run its intake, all while driving. With
          that many commands on their own threads, they were all reading
          and writing the same motors and sensors, and every extra hardware
          call slowed down every loop.
        </p>
        <p>
          So I separated deciding from doing. Commands on background threads
          only set targets in shared variables. A single I/O loop does all
          the talking to hardware: one bulk read from the control hub per
          cycle, then motor outputs written once. The autonomous path talks
          to the background aiming, launching, and intake commands through
          a few shared flags. It sets “start launching,” then waits for the
          launch command to clear it.
        </p>
      </Step>

      <Result>
        Autonomous reads as a plain list of moves while the turret, launcher,
        and intake work in the background. The same structure carried the
        code through three seasons and three different robots.
      </Result>
    </article>
  );
}
