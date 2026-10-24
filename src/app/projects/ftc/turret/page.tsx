import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Step, Result } from "@/components/Story";
import { ftcLauncherFit } from "@/content/images";

export const metadata: Metadata = {
  title: "Turret Aiming and Launch Control",
  description:
    "A self-aiming turret for FIRST Tech Challenge Team 2845: a camera-fitted launch model, then odometry-based aiming with correction and launch-on-the-move prediction.",
};

export default function TurretPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="FIRST Tech Challenge · Team 2845 · 2025–26"
        title="Turret Aiming and Launch Control"
        outcome="Aiming by turning the whole robot fell apart under defense, so we added a turret. My first launch model fitted flywheel speed to the camera’s view of the goal; it worked until the robot moved. The second one aims from odometry and uses the camera only to stay honest."
        meta="2025–2026 · Tampa, FL"
        stack="Java · Limelight · Curve Fitting · Motion Prediction"
      />

      <Step label="The Problem">
        <p>
          In the 2025–26 game, robots launch balls into a goal. We started
          by aiming the whole robot at it, but that fell apart as soon as
          other robots played defense and pushed us off target. We added a
          turret, and the software’s job became keeping it pointed at the
          goal and picking the right flywheel speed from anywhere on the
          field.
        </p>
      </Step>

      <Step label="First Attempt: Camera-Based Curve Fit">
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

      <Step label="Failure Mode and Redesign">
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
    </article>
  );
}
