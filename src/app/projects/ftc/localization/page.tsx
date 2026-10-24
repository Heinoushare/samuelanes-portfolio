import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Step, Formula, Result } from "@/components/Story";
import { ftcPidGraph } from "@/content/images";

export const metadata: Metadata = {
  title: "Localization and Navigation",
  description:
    "Three-wheel odometry corrected by the IMU, feeding a PID point-to-point navigator, for FIRST Tech Challenge Team 2845.",
};

export default function LocalizationPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="FIRST Tech Challenge · Team 2845 · 2023–24"
        title="Localization and Navigation"
        outcome="Two-wheel odometry with an IMU is accurate until the robot drives and turns at once. A third wheel fixes that and drifts instead. I used both, with the IMU as a slow correction on the wheels, then wrote the PID navigator that drives to a field coordinate."
        meta="2023–2024 · Tampa, FL"
        stack="Java · Odometry · Sensor Fusion · PID Control"
      />

      <Step label="The Problem">
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

      <Step label="What I Built">
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
    </article>
  );
}
