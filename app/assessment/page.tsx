"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "../../lib/questions";
import type { AnswersMap } from "../../lib/types";
import { calculateChannelScores } from "../../lib/scoring";

const STORAGE_KEY = "lumos-prioritiser-state-v1";

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [step, setStep] = useState(0);
  const router = useRouter();

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];

  // Load saved state on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        answers?: AnswersMap;
        step?: number;
      };

      if (parsed.answers) {
        setAnswers(parsed.answers);
      }
      if (
        typeof parsed.step === "number" &&
        parsed.step >= 0 &&
        parsed.step < QUESTIONS.length
      ) {
        setStep(parsed.step);
      }
    } catch (e) {
      console.warn("Failed to load saved assessment state", e);
    }
  }, []);

  // Persist state whenever answers or step change
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const data = JSON.stringify({ answers, step });
      window.localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
      console.warn("Failed to save assessment state", e);
    }
  }, [answers, step]);

  function handleSelect(optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  }

  function handleNext() {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      const channelScores = calculateChannelScores(answers);

      const query = new URLSearchParams({
        foundations: String(channelScores.foundations),
        website: String(channelScores.website),
        seo: String(channelScores.seo),
        email: String(channelScores.email),
        ppc: String(channelScores.ppc),
        social: String(channelScores.social),
      });

      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.warn("Failed to clear assessment state", e);
      }

      router.push(`/details?${query.toString()}`);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  const selectedOptionId = answers[question.id];

  return (
    <div>
      <p className="home-note">
        Question {step + 1} of {total}
      </p>
      <h1 className="home-hero-title">{question.prompt}</h1>
      {question.helper && (
        <p className="home-hero-text">{question.helper}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {question.options.map((opt) => {
          const selected = opt.id === selectedOptionId;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: 8,
                border: selected
                  ? "2px solid #28966B"
                  : "1px solid rgba(147, 157, 156, 0.5)",
                backgroundColor: selected ? "rgba(40,150,107,0.15)" : "#2B2F33",
                color: "#F5F5F5",
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="primary-button"
          style={{
            opacity: step === 0 ? 0.5 : 1,
            backgroundColor: "#384C55",
            color: "#F5F5F5",
          }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedOptionId}
          className="primary-button"
          style={{
            opacity: selectedOptionId ? 1 : 0.5,
          }}
        >
          {step === total - 1 ? "Finish" : "Next question"}
        </button>
      </div>
    </div>
  );
}