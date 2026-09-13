import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Chapter, Formula, Result, Step } from "@/components/Story";
import {
  sailboatBoardBottom,
  sailboatBoardTop,
  sailboatCad,
  sailboatRudders,
  sailboatSails,
  sailboatSoldering,
  sailboatTop,
  sailboatWater,
  timerV1,
  timerV1Circuit,
  timerV2,
  timerV2Shell,
} from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Embedded Projects",
  description:
    "An Arduino remote-control sailboat with XBee radios and a custom perfboard, and two generations of a speedcubing timer with ultrasonic and capacitive-touch sensing.",
};

const chapters = [
  {
    id: "sailboat",
    title: "Remote-control sailboat",
    problem:
      "Steer a battery-powered boat by radio, with the wrong shield for the board that fit.",
  },
  {
    id: "timer",
    title: "Speedcubing timer",
    problem:
      "Build a practice timer that feels like the ones used at competitions.",
  },
];

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

export default function EmbeddedPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="Personal projects · Arduino"
        title="Embedded Projects"
        outcome="Personal projects where every part was mine: the circuit, the firmware, the 3D-printed structure, and whatever broke along the way. A remote-control sailboat, and two generations of a speedcubing timer."
        meta="2022–2023 · Personal projects"
        stack="Arduino (C++) · Python · XBee radios · Soldering · Onshape · 3D printing · Fritzing"
        links={[
          { href: site.links.samduino, label: "All code", external: true },
          { href: site.links.timerV2Video, label: "Timer V2 demo", external: true },
          { href: site.links.timerV1Video, label: "Timer V1 demo", external: true },
        ]}
      />

      <figure className="mt-10">
        <Image
          src={sailboatWater}
          alt="The remote-control catamaran sailboat sailing on a pool"
          priority
          className="h-auto w-full border border-line"
        />
        <figcaption className="mt-3 text-sm text-muted">
          The sailboat on the water.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <p>
          These started as projects I wanted to exist, and turned into lessons
          in everything around the code: making parts that don’t fit together
          fit, sensors that behave differently in every room, and structures
          that have to survive being used.
        </p>
      </section>

      <nav aria-label="Projects on this page" className="mt-10">
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
        id="sailboat"
        number="01"
        context="Wireless control · Custom electronics · 2023"
        title="Remote-control sailboat"
      >
        <Step label="The goal">
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

        <Step label="A hull I could keep changing">
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

        <Step label="The problem: the wrong shield">
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

        <Step label="Firmware and the radio link">
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

        <Step label="Iterating on the structure">
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
      </Chapter>

      <Chapter
        id="timer"
        number="02"
        context="Sensors · Calibration · 2022–2023"
        title="Speedcubing timer"
      >
        <Step label="The goal">
          <p>
            I compete in speedcubing. At official competitions, solves are
            timed on a Stackmat: you rest both hands on the pads, lift them to
            start, and put them back to stop, after a 15-second inspection
            period with penalties for going over. I wanted a practice timer
            that did all of that, and generated scrambles too.
          </p>
        </Step>

        <Step label="Version 1: ultrasonic">
          <p>
            The first version had a single input, an HC-SR04 ultrasonic
            sensor, which detects the cube instead of hands. It measures how
            long a sound pulse takes to bounce back and converts that to
            distance:
          </p>
          <Formula>
            <p>distance = echo time · speed of sound / 2</p>
          </Formula>
          <p>
            A cube within 4 inches counts as placed. The same sensor steps the
            timer through its whole sequence: show a scramble, count down
            inspection, then time the solve, with a red LED while waiting and a
            green one while timing. Scrambles are 20 random moves that never
            turn the same face twice in a row, which would cancel out. I used
            an LCD with an I2C adapter, which needs only two data pins and has
            its own brightness control.
          </p>
        </Step>

        <PhotoPair
          photos={[
            {
              src: timerV1Circuit,
              alt: "Fritzing breadboard diagram with an Arduino Nano, ultrasonic sensor, LEDs, and LCD",
              caption: "The V1 circuit, drawn in Fritzing.",
            },
            {
              src: timerV1,
              alt: "The first timer on a breadboard, showing a time on the LCD",
              caption: "V1 in use.",
            },
          ]}
        />

        <Step label="Version 2: what was wrong, and the fix">
          <p>
            V1 worked, but it didn’t feel like a real timer, since it sensed the
            cube rather than your hands, and the electronics sat exposed on a
            breadboard. For V2, I switched to capacitive touch pads, the same
            way an official Stackmat works. Each pad is aluminum foil glued to
            the shell and wired through a 1 MΩ resistor, and the Arduino
            measures how long the pad takes to charge, which rises when a hand
            is on it.
          </p>
          <p>
            V2 also applies the competition rules itself. It counts down 15
            seconds of inspection, adds a +2 penalty if you start late, and
            records a DNF past 17 seconds, then shows the solve to the
            millisecond. Everything lives in a 3D-printed shell, printed in two
            halves and glued, since the whole thing was too big for the
            printer’s bed.
          </p>
        </Step>

        <PhotoPair
          photos={[
            {
              src: timerV2Shell,
              alt: "CAD model of the two-part timer shell with holes for wires and the LCD",
              caption:
                "The shell in CAD. The round holes carry the touch pad wires, and the slot holds the LCD.",
            },
            {
              src: timerV2,
              alt: "Hands on the capacitive pads of the second timer during a solve",
              caption: "V2 in use during a practice solve.",
            },
          ]}
        />

        <Step label="The hard part: sensors that won’t hold still">
          <p>
            The touch pads were the hardest part to get working reliably. A
            capacitive reading depends on everything around it: humidity,
            elevation, even the person touching it, so a threshold that works
            in one setting can fail in another. I wrote a separate calibration
            program to watch the raw readings, and after a lot of trial and
            error found the answer was a threshold far lower than I expected,
            but still high enough that the pads wouldn’t register touches that
            weren’t there.
          </p>
        </Step>

        <Result>
          A timer that works like the ones at competitions, in a shell sturdy
          enough to use every day.
        </Result>

      </Chapter>
    </article>
  );
}
