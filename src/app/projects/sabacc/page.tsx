import type { Metadata } from "next";
import Image from "next/image";
import { ProjectHeader } from "@/components/ProjectHeader";
import {
  sabaccArchitecture,
  sabaccMobile,
  sabaccModern,
  sabaccTableEarly,
  sabaccV1,
  sabaccV2,
} from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Sabacc",
  description:
    "A real-time multiplayer web app for Sabacc, the Star Wars card game. SvelteKit, Flask, Socket.IO, and SQLite, serving 1,000+ users.",
};

const progression = [
  {
    src: sabaccV1,
    alt: "First version of the Sabacc interface: two colored boxes of text for two players",
    caption: "The first version. Two players, and text only.",
  },
  {
    src: sabaccV2,
    alt: "Second version of the interface with card images and a pot graphic",
    caption: "More than two players, and the first graphics.",
  },
  {
    src: sabaccTableEarly,
    alt: "Early poker table layout with players seated around a green table",
    caption: "The first table layout, with every player seated around it.",
  },
];

export default function SabaccPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <ProjectHeader
        kicker="Sabacc · Founder and lead developer"
        title="A real-time multiplayer card game"
        outcome="A web app for playing Sabacc, the card game from Star Wars, against other people online. I built it alone, open-sourced it, and brought on developers from across the country. It has served 1,000+ users and is still running."
        meta="2023–present · Solo until April 2024, then a team project"
        stack="SvelteKit · TypeScript · Python · Flask · Socket.IO · SQLite · PostgreSQL"
        status="Live · sabacc.samuelanes.com"
        links={[
          { href: site.links.sabacc, label: "Play it", external: true },
          { href: site.links.sabaccOrg, label: "Team repo", external: true },
          { href: site.links.sabaccSolo, label: "Original solo repo", external: true },
        ]}
      />

      <figure className="mt-10">
        <Image
          src={sabaccModern}
          alt="An eight-player Sabacc game on the current table layout"
          priority
          className="h-auto w-full border border-line bg-white"
        />
        <figcaption className="mt-3 text-sm text-muted">
          An eight-player Traditional Sabacc game on the current table.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">What it does</h2>
        <p>
          Sabacc is played in rounds of drawing, trading, and betting. The site
          supports three variants, each with its own deck and rules:
          Traditional, Corellian Spike, and Kessel. Players make an account,
          host a game with their own settings for antes, blinds, and starting
          credits, and play with the people they invite. Games are saved as
          they go, and each one keeps a move history that can be replayed.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Architecture</h2>
        <p>
          The front end is SvelteKit, compiled ahead of time, with components
          that update as game state changes. A Flask backend owns all the game
          logic and the database. Ordinary requests like logging in, hosting a
          game, and loading stats go over HTTPS. When a player opens a game,
          the page joins a Socket.IO room for that game and keeps the
          connection open.
        </p>
        <p>
          The server has the final say. When a player acts, the client sends
          the action, not a new game state. The server checks that the player
          is in the game, applies the move using that variant’s rules, saves
          it, and pushes the update to everyone in the room. Nothing polls, and
          no client can decide how a move turns out.
        </p>
      </section>

      <figure className="mt-8">
        <Image
          src={sabaccArchitecture}
          alt="Diagram: users load the Svelte interface, which calls Flask over HTTPS; live game data flows over WebSockets to Socket.IO; Flask stores data in SQLite"
          className="h-auto w-full border border-line bg-white p-4"
        />
        <figcaption className="mt-3 text-sm text-muted">
          How requests flow. HTTPS carries basic data, and WebSockets carry
          live game data.
        </figcaption>
      </figure>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Keeping hands hidden</h2>
        <p>
          A card game can’t send the whole game state to every player, because
          anyone can open the browser’s developer tools and read the WebSocket
          messages. So an update isn’t one message sent to the whole room. The
          server builds a separate copy for each connected player, with the
          deck removed and every other player’s cards blanked out. In
          Traditional Sabacc, protected cards are played face up, so those
          stay visible.
        </p>
        <p>
          The move history gets the same treatment, so replaying a game in
          progress can’t reveal a hand either. Players see the full record
          only after the game ends.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">One engine, three variants</h2>
        <p>
          The first version had one variant and two players. Adding a second
          variant meant either copying the server or restructuring it, so I
          rebuilt the backend around classes. Base classes for the card, deck,
          hand, player, and game hold everything the variants share: turn
          order, saving to and loading from the database, and the per-player
          hiding above. Each variant subclasses them with its own phases,
          legal actions, hand values, and scoring. Corellian Spike and then
          Kessel were added this way without forking the server.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">Migrating the database, twice</h2>
        <p>
          The app started on SQLite. When the class-based backend arrived, I
          moved it to PostgreSQL, whose custom composite types could store
          cards and players as structured values. Later we moved back to
          SQLite, because a single database file made cloud hosting simpler
          and meant new contributors didn’t have to set up Postgres just to
          run the project.
        </p>
        <p>
          Both moves happened with real accounts and games in the database.
          The conversion script loads each game with the old classes, turns it
          into a plain dictionary, rebuilds it with the new classes, and
          writes it to the new schema. The migration reuses the code the game
          already runs on, instead of mapping columns by hand.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-ink/90">
        <h2 className="font-serif text-2xl text-ink">From solo project to team</h2>
        <p>
          I built the first versions alone and hosted them on a Raspberry Pi.
          Once I shared the project online, other developers wanted to help,
          so I started a Discord for players and contributors and moved the
          code into a shared organization repository. It now has 455 commits,
          about two-thirds of them mine, and the site runs in the cloud.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">How the interface evolved</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {progression.map((step) => (
            <figure key={step.caption}>
              <Image
                src={step.src}
                alt={step.alt}
                className="aspect-[4/3] w-full border border-line bg-white object-cover object-top"
              />
              <figcaption className="mt-3 text-sm text-muted">
                {step.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <figure className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end">
          <Image
            src={sabaccMobile}
            alt="The mobile layout of a Sabacc game using the Pescado card theme"
            className="h-auto w-44 shrink-0 border border-line"
          />
          <figcaption className="text-sm text-muted sm:max-w-xs">
            The current mobile layout, shown with the Pescado card theme.
            Players can choose card designs, table themes, and dark mode.
          </figcaption>
        </figure>
      </section>
    </article>
  );
}
