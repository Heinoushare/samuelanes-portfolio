import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import { Chapter, Formula, Result, Step } from "@/components/Story";
import {
  dlnCandidatesByStep,
  dlnChainComparison,
  dlnChainRoots,
  dlnChainSteps,
  dlnExteriorTriangle,
  dlnFailure,
  dlnGatesInterpolate,
  dlnMeshAfter,
  dlnMeshBefore,
  dlnMidlineReversal,
  dlnTriangulation,
} from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Delaunay Edge Selection",
  description:
    "Making the driverless path planner's midline extraction robust: finding why it chose wrong gates, fixing the geometry, and searching over whole paths instead of one edge at a time.",
};

const attempts = [
  ["1", "strict", "40°", "±1.0 m", "yes"],
  ["2", "relaxed_angle", "60°", "±1.0 m", "yes"],
  ["3", "wide_relaxed_angle", "60°", "±2.5 m", "yes"],
  ["4", "wide_width", "off", "±2.5 m", "yes"],
  ["5", "cross_any_length", "off", "any", "yes"],
  ["6", "same_side_width", "off", "±2.5 m", "no"],
];

export default function DelaunayPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <ProjectHeader
        kicker="Carnegie Mellon Racing · Driverless Path Planning"
        title="Delaunay Edge Selection"
        outcome="The driverless car builds its path by pairing up cones into gates and driving through the middle of them. It was picking the wrong pairs often enough to steer the car off line. I made the selection robust, and in the process learned that the fix was geometry and search, not tuning."
        meta="Oct 2026 · Pittsburgh, PA · Delaunay Edge Selection Lead"
        stack="C++ · ROS 2 Humble · Linux · Docker · Foxglove · rosbag replay · Formula Student Driverless Simulator"
        status="Validated in replay and sim"
      />


      <figure className="mt-6 sm:mt-10">
        <div className="aspect-video overflow-hidden border border-line bg-ink">
          <iframe
            title="The driverless car running this path planner in simulation"
            src={site.links.delaunaySim10HookEmbed}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <figcaption className="mt-3 text-sm text-muted">
          The planner running in the simulator. Cyan is the midline it
          publishes, and the car is following it at a 10 m/s target speed —
          fast enough that holding the line becomes its own problem. Why it
          clips cones here, and not at 6 m/s,{" "}
          <a
            href="#simulation"
            className="text-accent underline-offset-4 hover:underline"
          >
            further down
          </a>
          .
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <p>
          A Formula Student driverless track is marked by cones. The car’s
          perception stack turns lidar returns into cone positions; the path
          planner has to turn those positions into a drivable centreline,
          ten times a second, with no map and no memory of the frame before.
        </p>
        <p>
          The approach is Delaunay triangulation. Triangulate the cone
          positions, and the edges of those triangles include the ones that
          span the track from one boundary to the other. Pick the right edges
          and their midpoints trace the centreline. We call a chosen edge a{" "}
          <strong>gate</strong>: two cones straddling the track, and the line
          between them that the car drives through. Gates are picked one at a
          time, each anchored to the one before, forming a{" "}
          <strong>chain</strong>.
        </p>
        <p>
          <strong>Edge selection</strong> is everything between those two
          steps: which triangulation edges are legal candidates at all, and
          which candidate wins at each step of the chain. When it picks wrong,
          the controller is handed a corridor that does not exist. I had never
          worked in this codebase before I took this on.
        </p>
      </section>


      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <figure>
          <Image
            src={dlnTriangulation}
            alt="Delaunay triangulation of a point set, with the circumcircle of each triangle drawn"
            className="h-auto w-full border border-line bg-white"
          />
          <figcaption className="mt-3 text-sm text-muted">
            Delaunay triangulation: the triangles whose circumcircles contain no
            other point. It connects each cone to its natural neighbours, which
            is why the track-spanning edges show up in it.
          </figcaption>
        </figure>
        <figure>
          <Image
            src={dlnGatesInterpolate}
            alt="Diagram: cones triangulated, edge midpoints marked, then interpolated into a smooth midline"
            className="h-auto w-full border border-line bg-white"
          />
          <figcaption className="mt-3 text-sm text-muted">
            Every edge has a midpoint. Choose the right subset, in the right
            order, and interpolating through those midpoints gives the
            centreline the controller follows.
          </figcaption>
        </figure>
      </div>

      <section className="mt-10 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <p>
          Two assumptions hold this up, and both are deliberate. The node runs
          without cone colours, because perception cannot yet supply them
          reliably, and it assumes the track width falls within a known range,
          which the competition rules guarantee. Everything below is built on
          the previous Delaunay framework rather than replacing it.
        </p>
      </section>

      <Chapter
        id="visibility"
        number="01"
        context="Instrumentation · Before changing anything"
        title="Solver Instrumentation"
      >
        <Step label="The Problem">
          <p>
            The failures were real but slippery. The node is memoryless, so a
            bad frame is not sticky: failures came in bursts of roughly 0.4 to
            0.8 seconds, four to eight frames, and then fixed themselves. That
            is long enough for the controller to act on a wrong path and short
            enough to be hard to catch.
          </p>
          <p>
            The only diagnostic was a log line, throttled to once a second.
            At 10 Hz that is one report per ten frames, which is coarser than
            the failures themselves. I could watch the car misbehave in the
            simulator and have no idea which code path had produced the path.
          </p>
          <figure className="mt-6">
            <Image
              src={dlnFailure}
              alt="Visualiser frame showing selected gates zig-zagging across the track instead of advancing along it"
              className="h-auto w-full border border-line"
            />
            <figcaption className="mt-3 text-sm text-muted">
              What a bad frame looks like. Green are the gates the solver
              selected, magenta the candidates it considered legal. The chain
              zig-zags across the corridor instead of advancing along it.
            </figcaption>
          </figure>
        </Step>

        <Step label="Instrumentation Added">
          <p>
            Before touching any logic, I made the node explain itself. The
            selection runs as a cascade of six attempts, each looser than the
            last, stopping at the first one that finds any gate at all:
          </p>
          <div className="overflow-x-auto">
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-y border-line text-left text-muted">
                  <th className="py-2 pr-4 font-normal">#</th>
                  <th className="py-2 pr-4 font-normal">Attempt</th>
                  <th className="py-2 pr-4 font-normal">Angle limit</th>
                  <th className="py-2 pr-4 font-normal">Width</th>
                  <th className="py-2 font-normal">Must straddle track</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((row) => (
                  <tr key={row[0]} className="border-b border-line/60">
                    <td className="py-2 pr-4 text-muted">{row[0]}</td>
                    <td className="py-2 pr-4 font-mono text-[13px]">{row[1]}</td>
                    <td className="py-2 pr-4">{row[2]}</td>
                    <td className="py-2 pr-4">{row[3]}</td>
                    <td className="py-2">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            I published which attempt won on every frame, and every candidate
            edge each attempt had considered, on its own topic. I also made the
            debug colours distinguish chain steps properly, since the bags had
            been recorded with more steps than there were colours, so step 3
            was being drawn identically to step 0.
          </p>
          <p>
            Alongside that I built a replay harness: feed a recorded bag back
            through a freshly launched node, record every output topic into a
            new file, and save the exact parameters and git commit next to it.
            Runs are timestamped and never overwrite each other, so any result
            can be re-examined later against the config that produced it.
          </p>
        </Step>

        <Step label="Measured Behaviour">
          <p>
            On 345 frames of recorded cone data, the strict attempt handled 78%
            of frames and the rest fell through to looser ones, including two
            frames that reached the last-resort attempt. The second attempt
            never fired once: by the time the angle limit fails, the width
            limit has already failed too, so a whole rung of the cascade was
            dead weight.
          </p>
          <p>
            It also showed how much the old visualisation had been hiding:
            84% of candidate edges were legal at more than one step of the
            chain but had only ever been drawn at the first one.
          </p>
        </Step>

        <Result>
          Replacing one throttled log line with per-frame, per-attempt
          visibility turned “the car sometimes plans badly” into a specific,
          countable claim: 22% of frames fall off the strict path on raw cone
          data.
        </Result>

        <figure className="mt-8">
          <Image
            src={dlnCandidatesByStep}
            alt="Visualiser frame with candidate edges coloured by which chain step they were legal at, and the published midline in cyan"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            The view I did not have when I started: every edge the solver
            considered, coloured by which step of the chain it was legal at,
            with the published midline in cyan. Before this, an edge legal at
            several steps was drawn only once, and steps past the third reused
            colours already on screen.
          </figcaption>
        </figure>
      </Chapter>

      <Chapter
        id="geometry"
        number="02"
        context="Geometry · The fixes that mattered most"
        title="Geometric Assumptions and Corner Failures"
      >
        <Step label="The Problem">
          <p>
            With the instrumentation in place, the failures turned out to share
            a theme: the filters assume the track runs roughly straight past
            the car.
          </p>
          <p>
            <strong>The angle filter punishes real corners.</strong> In a turn
            the true gate is diagonal, because cones on the inside of the
            corner are spaced more tightly than those on the outside. Measured
            on real frames, genuine gates in turns sit at around 38° against a
            40° rejection threshold, while a wrong edge running along one
            boundary passes at 47°. Tightening the angle limit punishes the
            true gate and the false one about equally. Angle is not what
            separates them.
          </p>
          <p>
            <strong>The straddle test used the wrong reference.</strong> The
            check for whether an edge crosses the track measured from the car’s
            own origin at every step of the chain, rather than from the
            previous gate’s midpoint. Several steps into a chain, the car’s
            origin is the wrong place to be asking the question from. On one
            burst of frames, a wrong edge qualified by four to nine
            centimetres.
          </p>
          <p>
            <strong>The last-resort attempt gives up the one rule that
            matters.</strong> Attempt six drops the straddle requirement
            entirely, so it will happily join two cones on the <em>same</em>{" "}
            boundary and put the “midpoint” on the edge of the track rather
            than the middle. That is where the worst paths came from.
          </p>
        </Step>

        <Step label="The Forward-Crossing Invariant">
          <p>
            The fix that mattered most was a rule that is obvious once stated:
            the midline should never enter and leave a gate from the same side.
            If the chain approaches a gate from one side, the next midpoint has
            to be on the other side of it. Any candidate that would double the
            path back on itself is disqualified outright.
          </p>
          <p>
            It is implemented as a sign comparison across the previous gate’s
            line, which makes it orientation-free: it does not care which way
            the gate’s normal happens to point, so it survives the case where
            the usual “forward” heuristic flips past 90° of turn.
          </p>
          <p>
            I also promoted the straddle requirement from a hardcoded condition
            to a parameter so it could be measured rather than argued about.
          </p>
          <figure className="mt-6">
            <Image
              src={dlnMidlineReversal}
              alt="Visualiser frame where the midline leaves a gate and re-enters it from the same side, doubling back"
              className="h-auto w-full border border-line"
            />
            <figcaption className="mt-3 text-sm text-muted">
              The failure the invariant rules out: the midline leaves one gate
              and comes back across it from the same side. Geometrically legal
              under the old checks, and impossible as a path.
            </figcaption>
          </figure>
        </Step>

        <Step label="Filtering the Triangulation Itself">
          <p>
            The other half of the fix happens before selection even starts.
            Triangulating a set of cones produces triangles that have nothing to
            do with the track: long slivers between distant cones, and{" "}
            <em>exterior</em> triangles that close the hull along the outside of
            a boundary rather than spanning the corridor. Those triangles
            contribute edges that then have to be rejected one at a time by the
            selection filters, which is where the near-misses come from.
          </p>
          <p>
            So I added a quality filter on the triangles: a minimum area, plus
            unconditional rejection of obtuse triangles. A sliver cannot be part
            of a sensible gate pair, and rejecting it early removes a whole
            class of candidates rather than arguing with them downstream.
          </p>
        </Step>

        <figure className="mt-8">
          <Image
            src={dlnExteriorTriangle}
            alt="Hand-drawn diagram of triangulated cones with an exterior triangle hatched along the outside of the track boundary"
            className="h-auto w-full border border-line bg-white"
          />
          <figcaption className="mt-3 text-sm text-muted">
            An exterior triangle: it closes the hull along the outside of a
            boundary, so its edges span cones on the same side of the track
            rather than across it.
          </figcaption>
        </figure>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <figure>
            <Image
              src={dlnMeshBefore}
              alt="Full triangulation mesh including long slivers reaching to distant cones"
              className="h-auto w-full border border-line"
            />
            <figcaption className="mt-3 text-sm text-muted">
              The raw triangulation, including the slivers and hull-closing
              triangles that produce unusable candidate edges.
            </figcaption>
          </figure>
          <figure>
            <Image
              src={dlnMeshAfter}
              alt="Triangulation mesh after the quality filter, with slivers removed"
              className="h-auto w-full border border-line"
            />
            <figcaption className="mt-3 text-sm text-muted">
              After the quality filter. Fewer triangles, and the ones left
              mostly span the corridor.
            </figcaption>
          </figure>
        </div>

        <Step label="Measured Effect of Each Fix">
          <p>
            Measured over 345 frames of replay, counting frames where the
            planned path contains an implausible kink:
          </p>
          <div className="overflow-x-auto">
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-y border-line text-left text-muted">
                  <th className="py-2 pr-4 font-normal">Configuration</th>
                  <th className="py-2 pr-4 font-normal">Kinks &gt;45°</th>
                  <th className="py-2 pr-4 font-normal">Reversals &gt;90°</th>
                  <th className="py-2 font-normal">Worst turn (p90)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line/60">
                  <td className="py-2 pr-4">Neither rule</td>
                  <td className="py-2 pr-4">329</td>
                  <td className="py-2 pr-4">91</td>
                  <td className="py-2">159.8°</td>
                </tr>
                <tr className="border-b border-line/60">
                  <td className="py-2 pr-4">Forward-crossing only</td>
                  <td className="py-2 pr-4">250</td>
                  <td className="py-2 pr-4">8</td>
                  <td className="py-2">49.0°</td>
                </tr>
                <tr className="border-b border-line/60">
                  <td className="py-2 pr-4">Straddle only</td>
                  <td className="py-2 pr-4">5</td>
                  <td className="py-2 pr-4">3</td>
                  <td className="py-2">11.5°</td>
                </tr>
                <tr className="border-b border-line/60">
                  <td className="py-2 pr-4">Both</td>
                  <td className="py-2 pr-4">1</td>
                  <td className="py-2 pr-4">1</td>
                  <td className="py-2">11.5°</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The triangulation filter then took the last one: it changes
            selection on only four frames out of 345, and takes kinked frames
            from five to one. Cheapest win of the whole project, and the one
            piece of this I wrote before any of the analysis.
          </p>
        </Step>

        <Step label="Why Soft Penalties Cannot Substitute">
          <p>
            The obvious alternative is to keep the bad edges legal and just
            make them expensive. I tried it and it cannot work in this
            architecture. Raising the same-side penalty by a factor of 200, from
            0.1 to 20, moved the number of kinked frames from 330 to 331.
          </p>
          <p>
            The reason is structural: the penalty is a constant added to every
            same-side candidate equally, so it shifts all of their scores by
            the same amount and never changes their ranking against each other.
            A soft rejection that does not vary with how wrong the candidate is
            cannot discriminate, no matter how you tune it.
          </p>
        </Step>
      </Chapter>

      <Chapter
        id="scoring"
        number="03"
        context="Scoring · Continuous costs beside hard cutoffs"
        title="From Hard Cutoffs to Continuous Costs"
      >
        <Step label="The Problem">
          <p>
            Gate width and angle are continuous, but the solver treated them as
            pass/fail against a threshold that changed in steps between
            attempts. A gate 1.01 m from the ideal width was rejected while one
            at 0.99 m sailed through, and the only way to express “slightly
            worse” was to drop to a whole looser attempt.
          </p>
          <p>
            I did not want to throw the cascade away, since it is a reasonable
            safety ladder. I wanted the ranking within each attempt to reflect
            how good a candidate actually is.
          </p>
        </Step>

        <Step label="What I Added">
          <p>
            Continuous cost terms alongside the existing filters, each with a
            weight and an exponent so the shape can be tuned rather than just
            the magnitude:
          </p>
          <Formula>
            <p>width_weight · |len − track_width| ^ width_exponent</p>
            <p>parallel_weight · |gate_dir · heading| ^ parallel_exponent</p>
            <p>path_angle_weight · (|u · eA| + |u · eB|)</p>
            <p>chain_near_weight · segment_length</p>
          </Formula>
          <p>
            The third one was my idea and it is worth dwelling on, because it
            half failed. The thought was that a gate which bends the midline
            sharply is suspicious: some turning is expected, since that is what
            tracks do, but a ridiculous dogleg usually means a false cone or a
            skipped gate. So I scored the angle between the path segment and
            the two gates it connects.
          </p>
          <p>
            It is sign-blind by construction. A path that reverses back down
            the corridor crosses both gates perfectly square and therefore
            scores the best possible value. Sweeping its weight upward produced
            paths with 177° kinks, which is to say paths that double back.
            Two attempted rescues, a flat penalty on backward motion and a
            tangent-continuity term, both measured as useless, and I deleted
            them rather than defend them.
          </p>
          <p>
            The term earns its place only in combination with the
            forward-crossing rule, which supplies the sign information it
            lacks. On its own it is a liability.
          </p>
        </Step>

        <Step label="A Cost Ceiling on Selection">
          <p>
            The cascade’s success test was “at least one gate,” which means a
            terrible gate from a strict attempt beats three good ones from a
            looser attempt. So I added a cost ceiling: if the best candidate
            scores worse than the ceiling, move on to the next attempt, and if
            the last attempt still cannot beat it, publish nothing at all.
          </p>
          <p>
            The thresholded quantity is deliberately not the ranking score.
            Distance-based terms are subtracted out first, so a gate is not
            punished for being far away, only for being a bad gate.
          </p>
        </Step>

        <Result>
          Tuned, with the cost terms and ceiling active: 5.79 gates per frame
          against 3.22 before, path reach 12.3 m against 9.5 m, and the strict
          attempt handling 100% of frames instead of 78%.
        </Result>
      </Chapter>

      <Chapter
        id="chains"
        number="04"
        context="Search · Choosing a path rather than an edge"
        title="Chain-Level Search"
      >
        <Step label="The Problem">
          <p>
            Every fix so far improves one decision at a time. The solver still
            picked the best gate at step zero, then the best gate after that,
            and so on, with no ability to notice that a locally attractive
            first gate leads nowhere good.
          </p>
          <p>
            In the simulator that is exactly the failure I kept seeing: coming
            out of a turn, the first gate the car picks is sometimes a pair of
            same-coloured cones on the outside of the corner, running parallel
            to the track instead of across it. It corrects a frame or two
            later, but by then the controller has already acted on it.
          </p>
          <figure className="mt-6">
            <Image
              src={dlnChainSteps}
              alt="Three panels showing a chain being built: each selected gate moves the reference point and heading that the next step is judged against"
              className="h-auto w-full border border-line bg-white"
            />
            <figcaption className="mt-3 text-sm text-muted">
              How a chain is built. Each gate moves the reference point (orange)
              and the heading the next step is judged against, so an early
              mistake rotates the frame every later decision is made in. Note
              the candidate count falling as cones get consumed.
            </figcaption>
          </figure>
        </Step>

        <Step label="Chain Generation and Objective">
          <p>
            So I made it generate several complete chains from different first
            gates and compare them as whole paths. The scoring problem is that
            a longer chain always costs more in total, and averaging is worse,
            since one cheap gate gives a great average and no reason to
            continue. What I wanted was to reward reaching further with gates
            that are individually good:
          </p>
          <Formula>
            <p>
              chain_cost = Σ (gate_cost − gate_credit) + horizon_weight ·
              max(0, horizon − reached)
            </p>
          </Formula>
          <p>
            The credit is literally “the worst a gate may be and still earn its
            place”: a gate is worth adding if and only if its cost is below the
            credit. The horizon term pays for lookahead the chain failed to
            deliver.
          </p>
          <p>
            Diversity is deliberately limited to the first gate. The failure
            mode is a bad opening move, and alternatives that differ only deep
            in the chain cost compute without changing much. First-gate
            variants are allowed to share cones, because two first gates that
            differ by one cone can diverge a long way downstream.
          </p>
          <p>
            The defaults are set so that one root candidate reproduces the old
            greedy behaviour exactly. I verified that: with the search enabled
            but set to a single root, the output is byte-identical to the
            previous code across all 345 frames. Nobody has to trust the new
            path to run the node.
          </p>
        </Step>

        <Step label="Adaptive Search Budget">
          <p>
            Two chains are almost always enough, but some frames need five. A
            fixed budget is wasteful or inadequate. So the search stops
            generating alternatives once a chain is good enough, measured by
            gate count, while always rolling out at least two, and crucially it
            still compares every chain it has already generated. Early exit can
            never discard a winner.
          </p>
          <p>
            That cut mean roots per frame from 4.99 to 2.75, a 45% reduction in
            search, and chains came out <em>longer</em> on average, not shorter.
          </p>
        </Step>

        <Step label="Latency Analysis">
          <p>
            I wanted to know whether any of this fits the budget, and the first
            budget figure I was given did not have a source, so I went and
            found one: the controller runs at 10 Hz, so 100 ms is the number
            that binds, with the cone stream arriving at about 9.3 Hz and the
            system watchdog at 2.5 s as the hard fault.
          </p>
          <p>
            Against that, the search is not the problem. With debug publishing
            off, five roots cost 0.30 ms at the median and 1.08 ms at p95 for
            the solver, well under 1% of the budget. The surprise was that{" "}
            <strong>debug publishing costs more than the search does</strong>,
            because recording every attempt forces all six attempts to run even
            after one has won.
          </p>
          <p>
            A useful way to make latency legible: at 10 m/s, 10 ms of planning
            delay is 10 cm of travel. Two milliseconds is two centimetres.
          </p>
        </Step>

        <figure className="mt-8">
          <Image
            src={dlnChainComparison}
            alt="Visualiser frame with three candidate chains, each labelled with its cost, reach and gate count; the winner highlighted"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            Three chains from three different first gates, each labelled with
            its cost, how far it reached and how many gates it found. The winner
            here reaches less far than one alternative and still wins, because
            the alternative bought its reach with a single enormous gate.
          </figcaption>
        </figure>

        <figure className="mt-8">
          <Image
            src={dlnChainRoots}
            alt="Visualiser frame comparing a three-gate winning chain against a one-gate alternative with higher cost"
            className="h-auto w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            Why the comparison matters: the alternative (orange) commits to one
            long gate and stops, reaching 6.0 m for a cost of 19.9. The winner
            finds three gates, reaches 10.4 m, and costs 11.3.
          </figcaption>
        </figure>
      </Chapter>

      <Chapter
        id="colour"
        number="05"
        context="Interface · Building ahead of perception"
        title="Cone Colour Support"
      >
        <Step label="Rationale">
          <p>
            Cones are blue on one side of the track and yellow on the other, so
            a gate joining two cones of the same colour is definitionally
            wrong. We do not yet get reliable colours from perception, so the
            node runs colourless today. But when colours arrive, the same
            algorithm gets strictly better, and in the meantime we will want to
            run both ways for testing.
          </p>
          <p>
            So I built the node to accept either input: an explicit mode
            selects between the colourless and coloured message types, with a
            shared code path underneath. The alternative on the table was a
            small bridge node to convert between message types, which I
            rejected as the kind of thing that stays in the system forever.
          </p>
        </Step>

        <Step label="Implementation">
          <p>
            I kept the colour rule a hard filter rather than another weighted
            cost: reject an edge only when both endpoints have the same{" "}
            <em>known</em> colour. Blue with unknown, orange with anything, and
            unknown with unknown all survive. Applied once, immediately after
            triangulation, since colour does not depend on chain state.
          </p>
          <p>
            It also closes the worst failure mode: with colours on, even the
            last-resort attempt can no longer join two cones on the same
            boundary.
          </p>
          <p>
            One scoping decision I am glad I made: this node identifies no
            colours of its own and I left it that way. It does edge selection.
            Having it also guess at cone colours would have blurred what it is
            responsible for.
          </p>
        </Step>
      </Chapter>

      <section
        id="simulation"
        className="mt-20 scroll-mt-20 border-t border-line pt-10"
      >
        <h2 className="font-serif text-2xl text-ink">Driving It in Simulation</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/90">
          Two runs of the same track in the Formula Student Driverless
          Simulator, with the planner unchanged and only the controller’s
          target speed moved. Both complete the lap.
        </p>

        <div className="mt-8 space-y-10">
          <figure>
            <div className="aspect-video overflow-hidden border border-line bg-ink">
              <iframe
                title="Delaunay path planning in simulation at 6 m/s"
                src={site.links.delaunaySim6Embed}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              Target speed 6 m/s. The car completes the lap without touching a
              cone.
            </figcaption>
          </figure>
          <figure>
            <div className="aspect-video overflow-hidden border border-line bg-ink">
              <iframe
                title="Delaunay path planning in simulation at 10 m/s"
                src={site.links.delaunaySim10Embed}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              Target speed 10 m/s, starting at 0:15 where the cone strikes
              begin. Same lap, same planner, a good deal more carnage.
            </figcaption>
          </figure>
        </div>

        <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>
            The interesting part is which half breaks. The planner holds up at
            both speeds: it keeps finding the corridor and the car gets around
            the track either way. What changes is how well the car holds the
            line it was given, and at 10 m/s it does not, so it clips cones
            through the corners it took cleanly at 6.
          </p>
          <p>
            That is a controls problem sitting downstream of a path planning
            problem, and seeing the two fail separately is most of why I want
            to work on both. Giving the controller a corridor it can trust is
            only useful up to the point where the controller can follow it, and
            there is clearly work left on each side of that handoff.
          </p>
        </div>
      </section>

      <section className="mt-20 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">Status and Results</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/90">
          Measured on the same recorded session, main branch against this work:
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-y border-line text-left text-muted">
                <th className="py-2 pr-4 font-normal">Metric</th>
                <th className="py-2 pr-4 font-normal">Before</th>
                <th className="py-2 font-normal">After</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line/60">
                <td className="py-2 pr-4">Frames with a kinked path</td>
                <td className="py-2 pr-4">1</td>
                <td className="py-2">0</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="py-2 pr-4">Gates per frame</td>
                <td className="py-2 pr-4">2.51</td>
                <td className="py-2">4.52</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="py-2 pr-4">Path reach (median)</td>
                <td className="py-2 pr-4">8.0 m</td>
                <td className="py-2">12.3 m</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="py-2 pr-4">Frames handled by the strict attempt</td>
                <td className="py-2 pr-4">~76%</td>
                <td className="py-2">100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-ink/90">
          <h3 className="font-serif text-xl text-ink">Limitations</h3>
          <p>
            None of this has been measured against ground truth. Recorded
            sessions have no reference centreline, so every number above is a
            proxy: kinks, reversals, which attempt won, how far the path
            reaches. More gates and more reach are good signs, not quality
            measurements.
          </p>
          <p>
            The lookahead figure, 8.0 m to 12.3 m, is measured. My estimate
            that grossly wrong frames are roughly three times rarer is an
            estimate, extrapolated from the mechanism rather than counted, and
            I would not defend it as anything more.
          </p>
          <p>
            The one quantity measured in metres of path error comes from
            synthetic tracks with a known centreline, and it found something
            worth knowing: selection quality falls apart between 7 m and 5 m of
            corner radius, where invalid gates jump from about zero to 16% and
            path error triples. Formula Student’s minimum corner radius sits
            inside that band.
          </p>
        </div>

        <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-ink/90">
          <h3 className="font-serif text-xl text-ink">Next Steps</h3>
          <p>
            Everything above is replay and simulation. The track is the real
            test, and this has yet to run on the car.
          </p>
          <p>
            Two things I know are still missing. The node remains memoryless,
            and carrying the previous frame’s path forward is the single
            biggest remaining lever, since it would turn a four-frame burst of
            bad gates into a four-frame disagreement with something known to
            have been good. And the long cross-corner diagonal, the failure
            that started all of this, is best attacked by penalising sudden
            changes in gate width from one gate to the next, which I have
            specified and not yet built.
          </p>
        </div>
      </section>
    </article>
  );
}
