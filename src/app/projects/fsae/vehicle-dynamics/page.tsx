import type { Metadata } from "next";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Chapter, FigureSlot, Formula, Result, Step } from "@/components/Story";

export const metadata: Metadata = {
  title: "Regen Braking Dynamics Modelling",
  description:
    "Fitting a longitudinal braking model to Carnegie Mellon Racing vehicle logs to answer one question: how many newton-metres of regen buy one metre per second squared of deceleration?",
};

export default function RegenModelPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="Carnegie Mellon Racing · Driverless Controls"
        title="Regen Braking Dynamics Modelling"
        outcome="Our drivers said they could feel regen slowing the car. I needed that in numbers, so I fitted a braking model to a season of vehicle logs. The answer came with a caveat I did not expect: in this dataset, regen and the brake pedal are 95% collinear, so the honest result is a range, not a number."
        meta="Oct 2026 · Pittsburgh, PA · Regenerative Braking Lead"
        stack="Python · NumPy · SciPy · pandas · asammdf · Matplotlib"
        status="Analysis complete · More data needed"
      />

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <p>
          This is the second half of the regenerative braking project. The{" "}
          <a
            href="/projects/fsae/regen-design"
            className="text-accent underline-offset-4 hover:underline"
          >
            first half
          </a>{" "}
          was designing the control strategies. This half is about measuring
          what regen actually does to the car, using the data that testing
          produced. Everything below describes the parallel strategy, which is
          what the car was running.
        </p>
        <p>
          The team wants to shrink the pneumatic brakes on the next car and let
          regen take over part of the job. That is not a decision you can make
          on feel. It needs a number: how much deceleration do we get per
          newton-metre of regen torque we ask for? Everything below is an
          attempt to answer that honestly, including the part where the data
          refuses to answer it cleanly.
        </p>
      </section>

      <Chapter
        id="design"
        number="01"
        context="Experiment design · Working with data you did not plan"
        title="Isolating Regen From Friction Braking"
      >
        <Step label="The Problem">
          <p>
            On the car today, regen runs in parallel with the friction brakes:
            press the brake pedal and some regen torque comes in alongside the
            hydraulics. That is good for the driver and terrible for
            measurement. Every regen event is also a braking event, so the two
            effects arrive together and the log cannot tell you which one
            slowed the car.
          </p>
          <p>
            I could not re-run the season with a cleaner experiment. I had a
            pile of logs from testing days that were run for other reasons.
          </p>
        </Step>

        <Step label="A Two-Stage Model">
          <p>
            The way around it is to learn the brakes first, from data where
            regen is definitely absent, then treat regen as whatever is left
            over.
          </p>
          <p>
            <strong>Stage one</strong> fits deceleration against brake pressure
            using only braking events with regen switched off. Motor torque is
            zero by construction in those events, so the fit needs no torque or
            current signal at all, which matters because the current channels
            are the least trustworthy ones in the log.
          </p>
          <p>
            <strong>Stage two</strong> applies that model out of sample to
            braking events with regen switched on. Whatever deceleration the
            brake model fails to explain is the regen contribution.
          </p>
          <p>
            Two sessions made this possible: in both, the driver toggled
            between a gear with regen and a gear without it{" "}
            <em>within the same session</em>, 42/58 and 62/38 by time. Same
            brakes, same driver, same track, same pad temperature. That is as
            close to a controlled A/B as a race team’s testing day gets.
          </p>
        </Step>

        <Step label="Statistical Methodology">
          <p>
            <strong>Events, not samples.</strong> My first fits treated every
            10 ms sample as an independent observation, which is not true:
            samples inside one brake application are nearly identical. Refitting
            on one row per braking event widened the confidence interval on
            brake authority from [14.0, 14.3] to [12.5, 15.2]. The old
            intervals were roughly ten times too narrow. Nothing about the
            central estimate changed; what changed was how much I was entitled
            to claim.
          </p>
          <p>
            <strong>Robust regression, not least squares.</strong> I ran a null
            test: fit the regen coefficient on data where regen is off, where
            the true answer is zero. Ordinary least squares returned +0.0239,
            pulled by outliers. Huber regression returned −0.0001. I used Huber
            everywhere after that.
          </p>
        </Step>

        <Result>
          364 braking events across a 35-log testing day, each one row:
          duration, brake pressure, speed, deceleration, and commanded regen
          torque.
        </Result>
      </Chapter>

      <Chapter
        id="brakes"
        number="02"
        context="Stage one · Brake authority"
        title="Physical Validation of the Brake Model"
      >
        <Step label="The Fit">
          <p>The brake model is deliberately boring:</p>
          <Formula>
            <p>decel = 0.01343 · bps + 0.0448 · v + 0.789</p>
          </Formula>
          <p>
            with brake pressure in psi and speed in m/s. That is{" "}
            <strong>13.43 m/s² per 1000 psi</strong>, 95% CI [12.36, 14.51],
            with a held-out R² of 0.934 on events the fit never saw.
          </p>
        </Step>

        <Step label="Linearity in Brake Pressure">
          <p>
            A good R² is not evidence that a model is right, so I checked the
            shape against the hydraulics. Caliper clamp force is pressure times
            piston area; pad friction is a coefficient times clamp force; brake
            torque is that times an effective radius. Chain it together:
          </p>
          <Formula>
            <p>decel = (2 μ A r_eff) / (R_wheel · m) × P</p>
          </Formula>
          <p>
            Linear in pressure, provided the pad friction coefficient is
            constant. So I tested for curvature by adding a squared pressure
            term: its coefficient came out at −8.1 × 10⁻⁷ with a 95% CI of
            [−9.2 × 10⁻⁶, +2.4 × 10⁻⁶], which contains zero. No measurable
            curvature between 30 and 785 psi.
          </p>
        </Step>

        <Step label="The Empirical Speed Term">
          <p>
            The linear speed term is an empirical convenience and I want to be
            clear about that. Real road load is a constant rolling term plus a
            v² aerodynamic term, with no linear term in it. Adding terms in
            order: brake pressure alone gives R² 0.9349, adding v² gives
            0.9371, adding a pedal deadband gives 0.9372. Brake pressure
            explains 93.5% of the variance and everything else contributes
            0.2%.
          </p>
          <p>
            The constant, 0.789 m/s², is also not drag. Real road load for this
            car at 15 m/s is roughly 0.3 to 0.8 m/s², so the intercept is
            absorbing pad deadband and whatever else is systematic. It should
            not be quoted as an aerodynamic measurement.
          </p>
          <p>
            One more limitation worth stating: there is no grip ceiling in this
            model. Above some deceleration the tires, not the pressure, set the
            limit, so the true relationship has to bend over. The hardest
            events in the data cluster around 12.5 m/s² at roughly 750 psi,
            which looks like that ceiling, but there are only six of them.
          </p>
        </Step>

        <FigureSlot
          id="2.1"
          what="Scatter of deceleration against brake pressure, regen-on events in one colour and regen-off in another, with the fitted stage-one line through the regen-off points. The two populations separate up to about 700 psi and converge around 900 psi."
          caption="Regen sits above the brake-only fit everywhere in the linear region, then converges at the tire limit, where pressure is no longer what sets the deceleration."
        />
      </Chapter>

      <Chapter
        id="regen"
        number="03"
        context="Stage two · The number the ticket asked for"
        title="Regen Torque as Model Residual"
      >
        <Step label="The Result">
          <p>
            Applying the brake model out of sample to regen-on events and
            regressing the residual against commanded regen torque:
          </p>
          <Formula>
            <p>0.179 (m/s²)/N·m, 95% CI [0.104, 0.306]</p>
            <p className="not-italic text-base text-muted">
              ≈ 5.6 N·m of regen per 1 m/s² of deceleration
            </p>
          </Formula>
          <p>
            Across the whole day, regen supplied roughly 12% of total braking
            on average and 18% at the 90th percentile, with the strongest
            single event reaching 0.39 g.
          </p>
        </Step>

        <Step label="Physical Cross-Check">
          <p>
            There is an independent way to check that slope. The torque needed
            per unit of deceleration is set by gear ratio, wheel radius and
            mass, so inverting the measured slope gives an implied vehicle
            mass. Theory says 0.198 (m/s²)/N·m for a 300 kg car.
          </p>
          <p>
            The fit returned 0.1989, implying 299 kg. The car is about 300 kg.
            Across every independent route I tried, implied mass landed between
            230 and 364 kg, clustering around 300. That is not a tight
            confirmation, but it does mean the number is physically plausible
            rather than a curve fit that happens to minimise error.
          </p>
        </Step>

        <FigureSlot
          id="3.1"
          what="Residual deceleration (what the brake model could not explain) against commanded regen torque, one point per event, with the fitted slope and its confidence band."
          caption="The regen fit. The slope is the number the ticket asked for; the width of the band is the honest part."
        />
      </Chapter>

      <Chapter
        id="collinearity"
        number="04"
        context="The negative result"
        title="Collinearity and Estimate Sensitivity"
      >
        <Step label="Sensitivity Across Data Streams">
          <p>
            A teammate could reasonably ask which deceleration signal I used,
            so I reran the whole pipeline on four of them: the longitudinal
            accelerometer, its pitch-corrected version, and the derivative of
            two different speed channels.
          </p>
          <p>
            The streams agree with each other. Event-by-event correlation is
            0.95, the median difference between them is 0.00 m/s², and brake
            authority barely moves: 13.72, 13.31, 14.00, 14.52. But the{" "}
            <em>regen</em> slope moved by a factor of four to five across the
            same four streams.
          </p>
        </Step>

        <Step label="The Cause">
          <p>
            The correlation between brake pressure and commanded regen torque
            in this dataset is <strong>−0.949</strong>. That is not an accident
            of sampling. Parallel regen is keyed to the brake pedal by design,
            so the harder you brake, the more regen you get: 20 to 150 psi
            gives about −1.13 N·m, and above 700 psi gives about −13.28 N·m.
            The two effects are 95% collinear <em>by construction</em>.
          </p>
          <p>
            That has a sharp consequence. A 4% change in the fitted brake
            authority, well inside its confidence interval, moves the regen
            slope by 28%: nudging brake authority from 13.16 to 14.25 swings
            regen from 0.193 to 0.139. The brake number is solid and the regen
            number is riding on top of it.
          </p>
          <p>
            So the defensible statement is a range, <strong>5 to 7 N·m per
            1 m/s²</strong>, and the honest conclusion is that brake and regen
            effects are not separable in this dataset. The fix is not more
            analysis. It is a change to how we test: vary regen independently
            of brake pressure, or run a coast-down A/B.
          </p>
        </Step>

        <FigureSlot
          id="4.1"
          what="Two panels: left, a scatter of commanded regen torque against brake pressure showing the −0.949 relationship; right, the regen slope plotted across the four deceleration streams, showing it moving 4–5× while brake authority stays put."
          caption="The most useful figure in the project. The left panel is why the right panel happens."
        />
      </Chapter>

      <Chapter
        id="driverless"
        number="05"
        context="Cross-validation · Driverless data"
        title="Cross-Validation With Driverless Data"
      >
        <Step label="Why Driverless Data Decouples the Terms">
          <p>
            Then I realised the clean experiment already existed. In
            driverless, the car has <em>no mechanical braking at all</em>.
            Every bit of deceleration under a negative torque command is regen,
            with brake pressure at essentially zero. The two-stage model
            collapses to a single line:
          </p>
          <Formula>
            <p>decel = k · torque + drag</p>
          </Formula>
        </Step>

        <Step label="The Result">
          <p>
            Hunting through a driverless testing day produced nine genuine
            pure-regen events, brakes reading 0.2 to 2.7 psi, all at 21 to
            24 km/h:
          </p>
          <Formula>
            <p>k = 0.193 (m/s²)/N·m → 5.2 N·m per 1 m/s² → implied mass 308 kg</p>
          </Formula>
          <p>
            Theory for a 280 kg car predicts 0.213. And 0.193 sits inside the
            parallel-regen confidence interval of [0.104, 0.306]. Two control
            paths, two testing days, two entirely different methods, landing on
            the same number.
          </p>
          <p>
            It survived the checks I could throw at it: stable across resample
            rates from 25 to 200 Hz (0.187 to 0.201), leave-one-out gives 310
            to 320 kg for eight of the nine events, and dropping the two
            highest-leverage points leaves k at 0.192.
          </p>
          <p>
            The honest limitation is that all nine events sit in a 3 km/h band,
            so drag and the intercept cannot be separated. The next data I need
            is regen at a range of speeds, and that is what I asked the team
            for.
          </p>
        </Step>

        <FigureSlot
          id="5.1"
          what="Deceleration against commanded torque for the nine pure-regen driverless events, with the fitted line, and the implied-mass figure annotated against the car's actual mass."
          caption="Nine events with no mechanical braking anywhere in them. The slope implies a 308 kg car; the real one is about 300."
        />
      </Chapter>

      <Chapter
        id="thermal"
        number="06"
        context="The question I could not answer"
        title="Thermal Characterisation"
      >
        <Step label="Why It Cannot Be Answered Yet">
          <p>
            The other half of the ticket asked what regen does to motor and
            battery temperatures. I could not answer it from any data the team
            has collected, and saying so was more useful than producing a
            number.
          </p>
          <p>
            Total energy recovered across every regen event in the dataset is
            about <strong>300 kJ (83 Wh)</strong>. Almost all of that is stored
            in the pack rather than dissipated; only resistive losses become
            heat, call it 5 to 10%. Against a pack thermal mass of roughly
            50 kJ/K, that is a few tenths of a degree, which is below the
            ambient drift over a testing day.
          </p>
          <p>
            The data agrees. On the driverless runs, cell temperature rose
            0.0 °C through both regen sessions. And the control session with
            regen switched off entirely heated the motors just as much as the
            regen sessions did, because motor heating on this car is dominated
            by driving, not by regen.
          </p>
          <p>
            Answering it properly needs a purpose-built session: repeated
            back-to-back hard regen stops with nothing else going on.
          </p>
        </Step>

        <Result>
          The thermal question is not blocked on analysis. It is blocked on a
          test nobody has run yet, and now the team knows exactly which test it
          is.
        </Result>
      </Chapter>

      <section className="mt-20 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">Conclusions</h2>
        <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>
            Brake authority is settled: 13.43 m/s² per 1000 psi, with a
            held-out R² of 0.934 and a shape that matches the hydraulics.
          </p>
          <p>
            Regen is 5 to 7 N·m per m/s², with two independent methods agreeing
            inside that range, which is enough to size a parallel-regen
            strategy but not enough to tune one precisely.
          </p>
          <p>
            Closing the gap needs testing, not more fitting: regen varied
            independently of brake pressure, and regen events across a range of
            speeds rather than all at 22 km/h.
          </p>
        </div>
      </section>
    </article>
  );
}
