import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Step, Result } from "@/components/Story";
import {
  sailboatBoardBottom,
  sailboatBoardTop,
  sailboatCad,
  sailboatRudders,
  sailboatSails,
  sailboatSoldering,
  sailboatTop,
  sailboatWater,
} from "@/content/images";
import { pageMetadata } from "@/content/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Remote-Control Sailboat",
  description:
    "An Arduino sailboat steered over XBee radio, with a hand-soldered adapter board and 3D-printed structure.",
  image: sailboatWater,
  path: "/projects/embedded/sailboat",
});

const sailboatHardware = [
  ["Boat", "Arduino Nano · XBee radio on an Uno shield · SG90 and FS90MR servos · 4×AA pack"],
  ["Remotes", "Python on a laptop with a USB XBee, or an Arduino Uno with a joystick"],
  ["Structure", "Two water bottles · 3D-printed deck, keel, rudder, and electronics holder"],
];

type Photo = { src: StaticImageData; alt: string; caption: string };

function PhotoPair({ photos }: { photos: [Photo, Photo] }) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {photos.map((photo) => (
        <figure key={photo.caption}>
          <Image
            src={photo.src}
            alt={photo.alt}
            className="aspect-[4/3] w-full border border-line bg-white object-cover"
          />
          <figcaption className="mt-3 text-sm text-muted">
            {photo.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}


export default function SailboatPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="Personal Project · Arduino · 2023"
        title="Remote-Control Sailboat"
        outcome="A catamaran sailboat I could steer from shore over a radio link, from either a laptop or a joystick. The hardest part was not the firmware: the only radio shield I owned was built for a board twice the size of the one I needed, so I soldered my own adapter."
        meta="2023 · Personal project"
        stack="Arduino (C++) · Python · XBee Radios · Soldering · Onshape · 3D Printing"
      />

      <Step label="Objective">
        <p>
          A sailboat I could control from shore: trim the sail and steer the
          rudder over a radio link, from either a laptop or a handheld
          joystick, running on batteries for as long as possible.
        </p>
        <ul className="divide-y divide-line border-y border-line text-sm">
          {sailboatHardware.map(([part, detail]) => (
            <li
              key={part}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-8"
            >
              <span className="w-24 shrink-0 text-muted">{part}</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </Step>

      <Step label="Hull Design">
        <p>
          I made the boat a catamaran: two water bottles joined by a
          3D-printed deck and keel. Two hulls make it far more stable than
          one, it moves quickly, and because the printed parts are held on with
          zip ties, I could redesign any single part
          without rebuilding the boat.
        </p>
      </Step>

      <PhotoPair
        photos={[
          {
            src: sailboatCad,
            alt: "Onshape CAD assembly of the sailboat deck, electronics holder, and rudder",
            caption: "The CAD assembly in Onshape.",
          },
          {
            src: sailboatTop,
            alt: "Top view of the sailboat with electronics exposed between two water bottles",
            caption: "Top view, without the sail or rudder, electronics exposed.",
          },
        ]}
      />

      <Step label="Shield Incompatibility">
        <p>
          To make the batteries last, the boat runs on an Arduino Nano and
          micro servos. But the only XBee radio shield I had was made for the
          Arduino Uno, a much larger board with a different layout, and space
          on the deck was tight.
        </p>
        <p>
          So I made my own adapter: a soldered perfboard that mounts the Nano
          and the Uno shield together and wires one to the other, laid out to
          take as little room as possible in the electronics holder.
        </p>
      </Step>

      <figure className="mt-8">
        <Image
          src={sailboatSoldering}
          alt="Soldering the perfboard adapter"
          className="h-auto w-full border border-line"
        />
        <figcaption className="mt-3 text-sm text-muted">
          Soldering the adapter board.
        </figcaption>
      </figure>

      <PhotoPair
        photos={[
          {
            src: sailboatBoardTop,
            alt: "Arduino Nano and Uno XBee shield mounted together on the perfboard",
            caption: "The Nano and the Uno XBee shield, mounted together.",
          },
          {
            src: sailboatBoardBottom,
            alt: "Wiring on the underside of the perfboard",
            caption: "The wiring underneath.",
          },
        ]}
      />

      <Step label="Firmware and Radio Link">
        <p>
          Commands travel over the XBee link as single characters at 9600
          baud: one pair for sail in and out, one for rudder left and right,
          and a neutral command for when the stick is released. Both remotes
          only send when the input changes, and the joystick remote ignores
          small movements around center, so the radio carries events instead
          of a constant stream.
        </p>
        <p>
          The boat does the rest. While a rudder command is active, it steps
          the rudder one degree every 25 ms until it hears neutral, clamped
          between 5° and 160° to keep it within its range of motion. The
          joystick button starts a rescue mode that swings the rudder hard
          from side to side to work the boat free.
        </p>
      </Step>

      <Step label="Structural Iteration">
        <p>
          The rudder and sail both went through more than one version. The
          original sail frame was made from kebab sticks, which are weak and
          limited how big the sail could be. I rebuilt it from pencils
          connected by 3D-printed joints, which made it much stiffer and let
          me fit a larger, more powerful sail.
        </p>
      </Step>

      <PhotoPair
        photos={[
          {
            src: sailboatRudders,
            alt: "Two versions of the 3D-printed rudder side by side",
            caption: "Two versions of the printed rudder.",
          },
          {
            src: sailboatSails,
            alt: "The original kebab-stick sail beside the larger pencil-framed sail",
            caption:
              "Kebab sticks (left) against pencils with printed joints (right).",
          },
        ]}
      />

      <Result>
        The boat sails and steers on open water from either remote, on a
        circuit board I designed around the parts I actually had.
      </Result>
    </article>
  );
}
