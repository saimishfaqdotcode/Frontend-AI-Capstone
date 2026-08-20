"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Product({ color }) {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function ProductScene() {
  const [color, setColor] = useState("#6366f1");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const updatePreferences = () => {
      setReducedMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    updatePreferences();

    motionQuery.addEventListener("change", updatePreferences);
    mobileQuery.addEventListener("change", updatePreferences);

    return () => {
      motionQuery.removeEventListener("change", updatePreferences);
      mobileQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      {reducedMotion ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            background: "#111827",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              background: color,
              borderRadius: "24px",
            }}
            aria-label="Static 3D product fallback"
          />
        </div>
      ) : (
        <Canvas
          camera={{ position: [4, 4, 4], fov: 45 }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />

          <Product color={color} />

          <OrbitControls enableDamping={!isMobile} />
        </Canvas>
      )}

      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <button onClick={() => setColor("#6366f1")}>Purple</button>
        <button onClick={() => setColor("#ef4444")}>Red</button>
        <button onClick={() => setColor("#22c55e")}>Green</button>
        <button onClick={() => setColor("#f59e0b")}>Orange</button>
      </div>
    </div>
  );
}
