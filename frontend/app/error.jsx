"use client";

export default function Error({ error, reset }) {
  return (
    <main className="error-page">
      <div className="error-card">
        <span className="error-eyebrow">SOMETHING WENT WRONG</span>

        <h1>We couldn't load this page</h1>

        <p>
          Something unexpected happened. You can try loading the page again.
        </p>

        <button type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}