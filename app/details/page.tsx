"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Scores = {
  foundations: number;
  website: number;
  seo: number;
  email: number;
  ppc: number;
  social: number;
};

function readScoresFromParams(params: URLSearchParams): Scores {
  const get = (key: string) => Number(params.get(key) ?? 0);

  return {
    foundations: get("foundations"),
    website: get("website"),
    seo: get("seo"),
    email: get("email"),
    ppc: get("ppc"),
    social: get("social"),
  };
}

export default function DetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scores = readScoresFromParams(searchParams);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Please add at least your name and email.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          scores,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send report");
      }

      // Rebuild the query for redirect to /results
      const query = new URLSearchParams({
        foundations: String(scores.foundations),
        website: String(scores.website),
        seo: String(scores.seo),
        email: String(scores.email),
        ppc: String(scores.ppc),
        social: String(scores.social),
      });

      router.push(`/results?${query.toString()}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong sending your report. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="home-hero-title">One last step before your results.</h1>
      <p className="home-hero-text">
        Pop your details in below and we’ll email a copy of this mini-report to
        the Lumos team so we can follow up if it’s helpful. You’ll see your
        results on the next screen.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid rgba(147,157,156,0.5)",
              backgroundColor: "#2B2F33",
              color: "#F5F5F5",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
            Company
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid rgba(147,157,156,0.5)",
              backgroundColor: "#2B2F33",
              color: "#F5F5F5",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
            Email address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid rgba(147,157,156,0.5)",
              backgroundColor: "#2B2F33",
              color: "#F5F5F5",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
            Contact number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid rgba(147,157,156,0.5)",
              backgroundColor: "#2B2F33",
              color: "#F5F5F5",
            }}
          />
        </div>

        {error && (
          <p className="home-note" style={{ color: "#ffb3b3" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Sending your report..." : "See my results"}
        </button>

        <p className="home-note">
          We’ll never spam you. This just helps us understand who’s using the
          tool and whether a follow-up chat might be useful.
        </p>
      </form>
    </div>
  );
}