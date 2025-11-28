import type { ChannelScores } from "../../lib/types";
import { generatePriorities } from "../../lib/priorities";

type RawSearchParams = { [key: string]: string | string[] | undefined };

function getScore(params: RawSearchParams, key: string): number {
  const value = params[key];
  if (Array.isArray(value)) {
    return Number(value[0] ?? 0);
  }
  return Number(value ?? 0);
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  // Unwrap the Promise that Next passes in
  const params = await searchParams;

  const foundations = getScore(params, "foundations");
  const website = getScore(params, "website");
  const seo = getScore(params, "seo");
  const email = getScore(params, "email");
  const ppc = getScore(params, "ppc");
  const social = getScore(params, "social");

  const scores: ChannelScores = {
    foundations,
    website,
    seo,
    email,
    ppc,
    social,
  };

  const priorities = generatePriorities(scores);

  return (
    <div>
      <h1 className="home-hero-title">Your channel snapshot</h1>
      <p className="home-hero-text">
        Here's how your marketing foundations are looking. This helps us build a
        clearer, personalised priority plan next.
      </p>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
        <li>Foundations: {foundations}%</li>
        <li>Website: {website}%</li>
        <li>SEO: {seo}%</li>
        <li>Email: {email}%</li>
        <li>PPC: {ppc}%</li>
        <li>Social: {social}%</li>
      </ul>

      <h2 className="home-hero-title" style={{ fontSize: 24, marginTop: 32 }}>
        Recommended next moves
      </h2>
      <p className="home-hero-text">
        Based on your answers, these are the areas likely to unlock the most
        impact in the next 4–8 weeks. Start at the top and work your way down.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {priorities.map((p) => (
          <div
            key={p.id}
            style={{
              borderRadius: 8,
              border: "1px solid rgba(147,157,156,0.5)",
              padding: "12px 14px",
              backgroundColor: "#2B2F33",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: "#939D9C",
              }}
            >
              {p.channel}
            </div>
            <h3 style={{ margin: "4px 0 8px 0", fontSize: 18 }}>{p.title}</h3>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: 14,
                color: "#939D9C",
              }}
            >
              {p.why}
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
              {p.actions.map((a, index) => (
                <li key={index}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <a href="/" className="primary-button">
        Back to home
      </a>
    </div>
  );
}