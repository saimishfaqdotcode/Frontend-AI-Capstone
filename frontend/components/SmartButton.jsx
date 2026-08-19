"use client";

import { useEffect, useRef, useState } from "react";

export default function SmartButton() {
  const [state, setState] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function runAction(forceError = false) {
    if (state === "loading") return;

    setState("loading");

    timerRef.current = setTimeout(() => {
      setState(forceError ? "error" : "success");

      timerRef.current = setTimeout(() => {
        setState("idle");
      }, 1200);
    }, 900);
  }

  function handleClick() {
    runAction(false);
  }

  let label = "Send";
  let className = "smart-button";

  if (state === "loading") {
    label = "Sending...";
    className += " smart-button-loading";
  }

  if (state === "success") {
    label = "✓ Sent";
    className += " smart-button-success";
  }

  if (state === "error") {
    label = "Retry";
    className += " smart-button-error";
  }

  return (
    <div className="smart-button-demo">
      <button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={state === "loading"}
      >
        {state === "loading" && (
          <span className="smart-button-spinner" aria-hidden="true" />
        )}

        <span>{label}</span>
      </button>

      <div className="smart-button-controls">
        <button
          type="button"
          onClick={() => runAction(false)}
          disabled={state === "loading"}
        >
          Force Success
        </button>

        <button
          type="button"
          onClick={() => runAction(true)}
          disabled={state === "loading"}
        >
          Force Error
        </button>
      </div>
    </div>
  );
}