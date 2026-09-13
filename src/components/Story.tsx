import type { ReactNode } from "react";

export function Chapter({
  id,
  number,
  context,
  title,
  children,
}: {
  id: string;
  number: string;
  context: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-20 scroll-mt-20 border-t border-line pt-10">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">
        <span className="text-accent">{number}</span> · {context}
      </p>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Step({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-ink/90">
      <h3 className="font-serif text-xl text-ink">{label}</h3>
      {children}
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-1 border-l-2 border-accent pl-4 font-serif text-xl italic">
      {children}
    </div>
  );
}

export function Result({ children }: { children: ReactNode }) {
  return (
    <div className="mt-10 border border-line bg-card px-5 py-4">
      <p className="text-xs uppercase tracking-[0.14em] text-accent">Result</p>
      <p className="mt-2 text-[17px] leading-relaxed text-ink">{children}</p>
    </div>
  );
}
