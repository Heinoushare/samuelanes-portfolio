import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ProjectHeader } from "@/components/ProjectHeader";
import { sailboatWater, timerV2 } from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Embedded Projects",
  description:
    "Personal Arduino projects: a radio-controlled sailboat with a hand-soldered adapter board, and two generations of a speedcubing timer.",
};

type Post = {
  href: string;
  kicker: string;
  title: string;
  blurb: string;
  skills: string[];
  image: StaticImageData;
  alt: string;
};

const posts: Post[] = [
  {
    href: "/projects/embedded/sailboat",
    kicker: "2023",
    title: "Remote-Control Sailboat",
    blurb:
      "A catamaran steered from shore over an XBee radio link. The only radio shield I owned was built for a board twice the size of the one I needed, so I soldered my own adapter to fit both on the deck.",
    skills: [
      "Arduino",
      "C++",
      "XBee Radio",
      "Soldering",
      "Onshape",
      "3D Printers",
    ],
    image: sailboatWater,
    alt: "The remote-control catamaran sailboat sailing on open water",
  },
  {
    href: "/projects/embedded/speedcubing-timer",
    kicker: "2022–23",
    title: "Speedcubing Timer",
    blurb:
      "A practice timer that behaves like the ones used at competitions. Version one sensed the cube with ultrasound; version two sensed my hands, which took a calibration program to get working reliably.",
    skills: [
      "Arduino",
      "C++",
      "Capacitive Sensing",
      "I2C",
      "Multimeter",
      "3D Printers",
    ],
    image: timerV2,
    alt: "Hands resting on the capacitive touch pads of the second timer during a solve",
  },
];

export default function EmbeddedIndexPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 py-16">
      <div className="max-w-3xl">
        <ProjectHeader
          kicker="Personal Projects · Arduino"
          title="Embedded Projects"
          outcome="Personal projects where every part was mine: the circuit, the firmware, the 3D-printed structure, and whatever broke along the way."
          meta="2022–2023 · Personal projects"
          stack="Arduino (C++) · Python · XBee Radios · Soldering · Onshape · 3D Printing · Fritzing"
          links={[
            { href: site.links.samduino, label: "All Code", external: true },
            {
              href: site.links.timerV2Video,
              label: "Timer V2 Demo",
              external: true,
            },
            {
              href: site.links.timerV1Video,
              label: "Timer V1 Demo",
              external: true,
            },
          ]}
        />
      </div>

      <section className="mt-12 max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink/90">
        <p>
          These started as projects I wanted to exist, and turned into lessons
          in everything around the code: making parts that don’t fit together
          fit, sensors that behave differently in every room, and structures
          that have to survive being used.
        </p>
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
                  className="h-52 w-full bg-white object-cover object-center"
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
    </article>
  );
}
