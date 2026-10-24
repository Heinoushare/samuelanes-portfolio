import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Step, Formula, Result } from "@/components/Story";
import {
  ftcApriltagApproach,
  ftcElementDetection,
  ftcPropDetection,
} from "@/content/images";
import { pageMetadata } from "@/content/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Computer Vision Pipelines",
  description:
    "OpenCV pipelines for FIRST Tech Challenge Team 2845: finding a team prop in a crowded gym, locating game pieces, and lining up on AprilTags.",
  image: ftcPropDetection,
  path: "/projects/ftc/vision",
});

export default function VisionPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="FIRST Tech Challenge · Team 2845 · 2023–24"
        title="Computer Vision Pipelines"
        outcome="The robot had to find a red or blue prop in a gym full of red and blue, under lighting that changes venue to venue. I solved part of it before writing code, by designing the prop as a cube so a square bounding box became a real filter."
        meta="2023–2024 · Tampa, FL"
        stack="Java · OpenCV · HSV Segmentation · AprilTags · Camera Calibration"
      />

      <Step label="The Problem">
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

      <Step label="What I Built">
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

      <Step label="Extending to Game Pieces">
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
    </article>
  );
}
