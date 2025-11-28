// app/details/page.tsx

import type { ChannelScores } from "../../lib/types";
import { generatePriorities } from "../../lib/priorities";

type SearchParams = { [key: string]: string | string[] | undefined };

function getScore(searchParams: SearchParams, key: keyof ChannelScores): number {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return Number(value[0] ?? 0) || 0;
  }
  return Number(value ?? 0) || 0;
}

export default function DetailsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const scores: ChannelScores = {
    foundations: getScore(searchParams, "foundations"),
    website: getScore(searchParams, "website"),
    seo: getScore(searchParams, "seo"),
    email: getScore(searchParams, "email"),
    ppc: getScore(searchParams, "ppc"),
    social: getScore(searchParams, "social"),
  };

  const priorities = generatePriorities(scores);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-amber-400">
            Lumos prioritiser
          </p>
          <h1 className="text-3xl font-semibold">
            Detailed breakdown of your results
          </h1>
          <p className="text-sm text-slate-300">
            Use this page as a quick reference while you&apos;re talking through
            the report with a client. The PDF is the polished artefact – this is
            the working view.
          </p>
        </header>

        <section className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800">
          <h2 className="text-lg font-semibold mb-3">Channel scores</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-300">Foundations</dt>
              <dd className="font-medium">{scores.foundations}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-300">Website</dt>
              <dd className="font-medium">{scores.website}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-300">SEO</dt>
              <dd className="font-medium">{scores.seo}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-300">Email</dt>
              <dd className="font-medium">{scores.email}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-300">PPC</dt>
              <dd className="font-medium">{scores.ppc}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-300">Social</dt>
              <dd className="font-medium">{scores.social}%</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800">
          <h2 className="text-lg font-semibold mb-3">Priority breakdown</h2>
          <p className="mb-4 text-sm text-slate-300">
            These are the same priorities you&apos;ll see in the PDF, just in a
            more compact format.
          </p>

          <ol className="space-y-4">
            {priorities.map((p, index) => (
              <li
                key={`${p.channel}-${index}`}
                className="rounded-xl bg-slate-950/60 p-4 border border-slate-800"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  #{index + 1} · {p.channel}
                </p>
                <h3 className="text-sm font-semibold mb-2">{p.title}</h3>
                <p className="text-xs text-slate-300 mb-2">{p.why}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-200">
                  {p.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}