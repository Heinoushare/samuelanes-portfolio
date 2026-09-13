import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Chapter, Formula, Result, Step } from "@/components/Story";
import {
  ftcApriltagApproach,
  ftcElementDetection,
  ftcLauncherFit,
  ftcPidGraph,
  ftcPits,
  ftcPropDetection,
} from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "FTC Team 2845",
  description:
    "Four problems from four seasons of FIRST Tech Challenge robot software: running subsystems in parallel, localization, computer vision, and a turret that aims itself.",
};

const chapters = [
  {
    id: "architecture",
    title: "Doing more than one thing at a time",
    problem: "A robot that works one step at a time wastes its 30 seconds.",
  },
  {
    id: "localization",
    title: "Knowing where the robot is",
    problem: "Both common odometry setups lose accuracy in different ways.",
  },
  {
    id: "vision",
    title: "Seeing the field",
    problem: "The camera had to find a red or blue prop in a gym full of red and blue.",
  },
  {
    id: "turret",
    title: "Scoring from anywhere",
    problem: "Aiming by turning the robot fell apart under defense.",
  },
];

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

const results = [
  ["2022–23", "Control Award · Florida State Championship"],
  [
    "2023–24",
    "R.O.B.O.T. League Winning Alliance Captain · Florida State Championship",
  ],
  [
    "2024–25",
    "R.O.B.O.T. League Winning Alliance Captain · Florida State Championship",
  ],
  [
    "2025–26",
    "R.O.B.O.T. League Inspire Award, 1st Place · Winning Alliance Partner · Florida State Championship",
  ],
];

export default function FtcPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="FIRST Tech Challenge · Team 2845, Team Duct Tape"
        title="Robot Autonomy and Controls"
        outcome="Over four seasons I went from a new programmer to leading my team’s software to becoming Team Captain. These are four problems that shaped the robot’s code, and how I solved each one."
        meta="2022–2026 · Tampa, FL · FIRST Dean’s List Semi-Finalist"
        stack="Java · Android Studio · OpenCV · Limelight · goBILDA Pinpoint · FTC Dashboard"
        links={[
          { href: site.links.ftc2025, label: "2025–26 code", external: true },
          { href: site.links.ftc2023, label: "2023–24 code", external: true },
          { href: site.links.ftcVideo, label: "2026 design video", external: true },
        ]}
      />

      <figure className="mt-10">
        <Image
          src={ftcPits}
          alt="Samuel Anes working on the Team 2845 robot in the pits"
          priority
          className="h-[min(32rem,70vh)] w-full border border-line object-cover object-[center_40%]"
        />
        <figcaption className="mt-3 text-sm text-muted">
          Working on the robot in the pits between matches.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
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

      <nav aria-label="Problems on this page" className="mt-10">
        <ol className="grid gap-3 sm:grid-cols-2">
          {chapters.map((chapter, i) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className="group block h-full border border-line bg-card p-4 hover:border-ink"
              >
                <p className="text-xs text-accent">0{i + 1}</p>
                <p className="mt-1 font-serif text-lg text-ink group-hover:underline">
                  {chapter.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {chapter.problem}
                </p>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Chapter
        id="architecture"
        number="01"
        context="Software architecture · 2023–26"
        title="Doing more than one thing at a time"
      >
        <Step label="The problem">
          <p>
            Thirty seconds is not much time. A robot that drives, stops, runs
            its intake, stops, and then scores spends most of autonomous
            waiting on itself. The team had a small command library from
            earlier seasons that could run a task in the background on its
            own thread, but almost no robot code was built on it, and there
            was no clear place for a new teammate to add a feature.
          </p>
        </Step>

        <Step label="What I built">
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

        <Step label="When it got harder">
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
      </Chapter>

      <Chapter
        id="localization"
        number="02"
        context="Odometry and PID navigation · 2023–24"
        title="Knowing where the robot is"
      >
        <Step label="The problem">
          <p>
            Before I worked on it, the robot tracked its position with two
            odometry wheels and got its heading from the IMU. That is accurate
            on simple moves, but the IMU updates slowly, so heading lags when
            the robot drives and turns at the same time, and every position
            after that is wrong. The usual alternative, a third odometry wheel
            instead of the IMU, handles those moves well but slowly drifts
            over a match. Each setup fails where the other one is good.
          </p>
        </Step>

        <Step label="What I built">
          <p>
            So I used both. A third wheel measures heading moment to moment:
          </p>
          <Formula>
            <p>Δθ = (Δright − Δleft) / trackwidth</p>
            <p>Δx = (Δleft + Δright) / 2</p>
            <p>Δy = Δback − backDist · Δθ</p>
          </Formula>
          <p>
            trackwidth is the distance between the left and right wheels, and
            backDist is how far the back wheel sits from the center of
            rotation. The last term subtracts the back wheel motion caused by
            turning, so only real sideways motion is left. Each loop, these
            changes are rotated by the current heading and added to the field
            position.
          </p>
          <p>
            The IMU then fixes the drift. Every 1.2 seconds, heading is reset
            to the IMU’s value, but only if the two agree within 5°. Slow
            drift gets corrected, and a bad IMU reading, which would be far
            off, is ignored. If one of the wheels stops reporting, the robot
            falls back to two wheels and the IMU instead of losing track
            entirely.
          </p>
          <p>
            An accurate position is only useful if the robot can drive to one.
            I wrote a point-to-point PID controller that runs one loop on
            straight-line distance and another on heading, then rotates the
            output into the robot’s frame and mixes it into four mecanum wheel
            powers, so the robot can drive diagonally while it turns. P pushes
            harder the farther away the robot is. D takes power away as it
            closes in quickly, so it doesn’t overshoot. I grows the longer the
            robot sits short of the target, so it doesn’t stall just before
            it. The heading integral only runs within 6° of the target and
            resets when the robot swings past, so it can’t wind up during a
            long turn.
          </p>
        </Step>

        <figure className="mx-auto mt-8 max-w-sm">
          <Image
            src={ftcPidGraph}
            alt="Logged P, I, and D terms during one autonomous move"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            P, I, and D terms logged during one move. P falls as the robot
            approaches, I builds to finish the move, and D follows velocity.
          </figcaption>
        </figure>

        <Result>
          The robot kept an accurate position through fast, combined moves
          without error building up over the match, and autonomous paths
          became a list of field coordinates. In 2025–26 we moved to a goBILDA
          Pinpoint odometry computer and added camera corrections, covered in
          problem 04.
        </Result>
      </Chapter>

      <Chapter
        id="vision"
        number="03"
        context="OpenCV pipelines · 2023–24"
        title="Seeing the field"
      >
        <Step label="The problem">
          <p>
            In 2023–24, a team prop was placed on one of three spike marks at
            random, and the robot had to find it to choose its autonomous
            path. Teams designed their own props, but they had to be red or
            blue, which are everywhere in a competition gym: shirts, bumpers,
            tape, other robots. The lighting also changes from venue to venue.
            A simple color mask would find a lot of things that weren’t the
            prop.
          </p>
        </Step>

        <Step label="What I built">
          <p>
            I solved part of the problem before writing any code, by designing
            the prop to be easy to pick out: a solid-colored cube. A cube looks
            square from the robot’s camera, and most red or blue clutter
            doesn’t.
          </p>
          <p>
            The pipeline converts each frame to HSV and masks it for the prop’s
            color. It then rescales the masked pixels so their average
            saturation is always the same before applying a second, stricter
            threshold, which keeps the mask steady when the lighting changes.
            Every contour gets a bounding box, any box that isn’t close to
            square is thrown out, and the largest box left is the prop. The
            region it sits in picks the path.
          </p>
        </Step>

        <figure className="mt-8">
          <Image
            src={ftcPropDetection}
            alt="Camera frame with a red cube detected inside the center path region"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            Pipeline output on the practice field. The detected prop is
            outlined in cyan, and the three path regions are green.
          </figcaption>
        </figure>

        <Step label="Taking it further">
          <p>
            Once the robot could find the prop, I wanted it to score more in
            autonomous, which meant finding game pieces too. A second pipeline
            masks for the piece’s color and takes the largest contour. The
            camera’s field of view gives the angle to it, and the piece’s known
            width gives the distance:
          </p>
          <Formula>
            <p>angle = (x − frameWidth / 2) · FOV / frameWidth</p>
            <p>distance = realWidth · focalLength / pixelWidth</p>
          </Formula>
          <p>
            x is the piece’s center in the image, and the focal length, in
            pixels, comes from a calibration program that measures a piece at
            a known distance.
          </p>
        </Step>

        <figure className="mt-8">
          <Image
            src={ftcElementDetection}
            alt="Camera frame with a hexagonal game piece outlined and its estimated distance printed"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            A detected game piece, 248 pixels wide, estimated at 11.15 inches
            away.
          </figcaption>
        </figure>

        <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>
            Scoring also meant lining up on the backdrop, which has AprilTags
            on it. The robot uses the tag’s pose to set three speeds at once,
            each proportional to how far off it is:
          </p>
          <Formula>
            <p>drive = (tagDistance − targetDistance) · k₁</p>
            <p>strafe = tagAngle · k₂</p>
            <p>turn = robotAngleToTag · k₃</p>
          </Formula>
        </div>

        <figure className="mt-8">
          <Image
            src={ftcApriltagApproach}
            alt="The robot approaching the AprilTags on the scoring backdrop"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            The 2023–24 robot lining up on the backdrop tags.
          </figcaption>
        </figure>

        <Result>
          The robot chose its autonomous path from what the camera saw, and the
          same approach extended to locating game pieces and lining up to
          score.
        </Result>
      </Chapter>

      <Chapter
        id="turret"
        number="04"
        context="Turret aiming and launcher control · 2025–26"
        title="Scoring from anywhere"
      >
        <Step label="The problem">
          <p>
            In the 2025–26 game, robots launch balls into a goal. We started
            by aiming the whole robot at it, but that fell apart as soon as
            other robots played defense and pushed us off target. We added a
            turret, and the software’s job became keeping it pointed at the
            goal and picking the right flywheel speed from anywhere on the
            field.
          </p>
        </Step>

        <Step label="First attempt: a curve fit to camera data">
          <p>
            My first model used the camera alone. The goal’s AprilTag takes up
            less of the image the farther away it is, so I drove to 17 spots,
            recorded the tag’s area and the flywheel speed that scored from
            each, and fit a curve:
          </p>
          <p className="border-l-2 border-accent pl-4 font-serif text-xl italic">
            v = 945.3 · e<sup>−3.445 · a</sup> + 1327
          </p>
          <p>
            a is tag area as a percentage of the image, and v is flywheel speed
            in encoder ticks per second. The fit’s RMSE was 28 ticks per
            second.
          </p>
        </Step>

        <figure className="mt-8">
          <Image
            src={ftcLauncherFit}
            alt="Scatter plot of tag area against flywheel velocity with an exponential fit"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            The 17 measurements and the exponential fit.
          </figcaption>
        </figure>

        <Step label="What broke, and the fix">
          <p>
            It worked, but only while the camera could see the tag, and tag
            readings get unreliable when the robot is moving. In a real match
            the robot is almost always moving.
          </p>
          <p>
            So I flipped the roles. The final code aims from odometry: the
            robot keeps the goal’s position in its own field coordinates and
            points the turret at it every loop, whether the tag is visible or
            not. The camera keeps that estimate honest. When it sees one of the
            goal tags while the robot and turret are nearly still, under 2
            in/s and 5°/s, its pose estimate re-anchors the goal’s position.
            Readings taken while moving are ignored.
          </p>
          <p>
            That left one more problem. A ball launched from a moving robot
            keeps the robot’s velocity, so aiming straight at the goal misses.
            The code estimates how long the ball will be in the air from its
            distance, moves the robot’s predicted position forward by velocity
            × flight time, recomputes the distance, and repeats five times so
            the estimate settles. The turret and flywheel then aim from that
            predicted position. I checked the geometry in a small desktop
            simulation of the same math before running it on the robot.
          </p>
          <p>
            The game also requires scoring balls in a color order revealed at
            the start of each match. Color sensors around a three-slot
            spindexer track which ball is in each slot, so the robot can
            rotate the right one into the launcher.
          </p>
        </Step>

        <Result>
          The turret tracks the goal with or without the tag in view, the
          flywheel speed follows distance automatically, and the robot can
          score while driving instead of stopping to line up.
        </Result>
      </Chapter>

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
        <h2 className="font-serif text-2xl text-ink">2026 design video</h2>
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
    </article>
  );
}
