import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { fsaeCar, fsaeMap, fsaeOverlay } from "@/content/images";

export const metadata: Metadata = {
  title: "CMU Formula SAE Electric",
  description:
    "A speed-dependent one-pedal regenerative braking map for CMU Formula SAE Electric, validated by replaying vehicle logs and track-tested in September 2026.",
};

export default function FsaePage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="CMU Formula SAE Electric · Driverless Controls"
        title="One-pedal regenerative braking"
        outcome="A speed-dependent accelerator map that lets the driver brake with regen just by lifting off the pedal. I checked it against logs from earlier sessions, then wrote the firmware that ran it on track."
        meta="Sept 2026 · Pittsburgh, PA"
        stack="C (STM32 firmware) · Python · NumPy · Matplotlib · asammdf"
        status="Track-tested · September 2026"
      />

      <figure className="mt-10">
        <Image
          src={fsaeCar}
          alt="CMU Formula SAE Electric car 46 on track, driverless"
          width={2400}
          height={1600}
          priority
          className="h-[min(28rem,60vh)] w-full border border-line object-cover object-[center_62%]"
        />
        <figcaption className="mt-3 text-sm text-muted">
          The 26x car on track, running driverless.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Why</h2>
        <p>
          Regenerative braking turns speed back into battery charge instead of
          brake heat, which matters most in endurance, where efficiency is
          scored. The team also needed regen-heavy running early in the season
          to measure cell temperatures and motor derating, data that feeds the
          design of the 2027 car.
        </p>
        <p>
          The previous design put regen on a steering-wheel paddle. It never
          worked, and its throw was awkward enough that pulling it all the way
          meant moving your whole hand. The goal was to move regen onto the
          accelerator: lift off and the car slows down, the way most electric
          road cars behave.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">What didn’t work</h2>
        <p>
          The obvious version, regen whenever the pedal is released, needs a
          threshold. Replaying logs showed the pedal crossing any threshold
          hundreds of times a session, and it only behaved with 0.15 s of
          hysteresis bolted on, which cut predicted regen episodes from 942 to
          115 on one log.
        </p>
        <p>
          Splitting the pedal in half, regen below 50% and drive above, avoids
          that. But the driver has to press past halfway just to pull away, and
          the drive side loses half its resolution.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">The map</h2>
        <p>
          The final map moves the coast point, the pedal position where torque
          crosses zero, with speed:
        </p>
        <p className="border-l-2 border-accent pl-4 font-serif text-xl italic">
          z = p(1 + k) − k,{" "}
          <span className="not-italic text-base text-muted">
            k = clamp(avg motor RPM / regen_max_rpm, 0, 1)
          </span>
        </p>
        <p>
          p is pedal travel from 0 to 1, and z is the torque request from −1 to
          1. Negative z is scaled by a regen gain (0.1 on the car).
        </p>
        <p>
          At a standstill k is 0, so z = p and the pedal behaves exactly as it
          always has. As the car speeds up, the coast point climbs toward half
          the pedal and a regen zone opens beneath it. Three useful properties
          come for free: regen fades to zero as the car stops, so it can never
          push the car backwards; full throttle always reaches full torque; and
          because the map passes straight through zero, pedal noise near the
          coast point barely changes the torque, so no hysteresis is needed.
        </p>
      </section>

      <figure className="mt-8">
        <Image
          src={fsaeMap}
          alt="One-pedal map: torque request versus pedal position, and coast point versus speed"
          width={1560}
          height={660}
          className="h-auto w-full border border-line bg-white"
        />
        <figcaption className="mt-3 text-sm text-muted">
          Left: torque request against pedal position at 70 km/h, with other
          speeds in grey. Right: how the coast point and full-lift deceleration
          change with speed. Plotted in km/h with speed_max = 100 km/h and gain
          0.10; the firmware uses motor RPM.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Checking it against old logs</h2>
        <p>
          Before it went on the car, I replayed logged sessions through the
          same function in Python. Throttle, brake position, and per-motor RPM
          go onto a common 100 Hz grid, and average motor RPM is rebuilt the way
          the firmware computes it. The replay answers one primary question: when the driver actually braked,
          would regen already have been on? On an autocross run, yes for 99.8%
          of braking time, and 96.6% on a September test session. In the window
          below, requested deceleration peaks at 0.28 g, well within what the
          tires can take.
        </p>
        <p>
          That coverage number is the trustworthy one. The replay assumes the
          driver’s foot does what it did under the old pedal map, and under the
          new one they would press further for the same torque, so how often
          regen engages is only an upper bound. But a driver about to brake
          lifts off the throttle either way.
        </p>
      </section>

      <figure className="mt-8">
        <Image
          src={fsaeOverlay}
          alt="Logged autocross window comparing actual throttle, recomputed one-pedal output, and brake position"
          width={1950}
          height={845}
          className="h-auto w-full border border-line bg-white"
        />
        <figcaption className="mt-3 text-sm text-muted">
          Autocross, 95–135 s. Blue is logged throttle, green is the same pedal
          passed through the map (speed_max = 100 km/h, gain 0.15), dashed grey
          is the coast point, and peach is brake position. Every brake
          application in the window already has regen engaged underneath it.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">On the car</h2>
        <p>
          The map runs in the Endurance gear on the drive control module. It
          only reinterprets the pedal. The result feeds the existing torque
          allocator, which splits it across all four motors within each tire’s
          grip limit and blocks regen when the battery can’t accept charge.
          Older logs already showed individual motors regenerating, so the
          hardware path wasn’t new; the change was making regen deliberate.
        </p>
      </section>
    </article>
  );
}
