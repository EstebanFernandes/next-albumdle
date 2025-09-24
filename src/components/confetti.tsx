// components/Confetti.tsx
"use client";

import { useState, forwardRef, useImperativeHandle } from "react";

type ConfettiProps = {
  count?: number;
};

export type ConfettiHandle = {
  fire: (x: number, y: number) => void;
};

const burstColors = [
  "hsl(0, 80%, 50%)",    // red
  "hsl(30, 80%, 50%)",   // orange
  "hsl(50, 80%, 50%)",   // yellow
  "hsl(200, 80%, 50%)",  // blue
  "hsl(120, 80%, 50%)",  // green
  "hsl(280, 80%, 50%)",  // purple
  "hsl(330, 80%, 50%)",  // pink
];

const Confetti = forwardRef<ConfettiHandle, ConfettiProps>(
  ({ count = 30 }, ref) => {
    const [bursts, setBursts] = useState<
      { id: number; pieces: { key: number; color: string; dx: number; dy: number; rz: number; duration: string; fallX: number; fallY: number }[]; x: number; y: number }[]
    >([]);
    let burstId = 0;

    useImperativeHandle(ref, () => ({
      fire: (x: number, y: number) => {
        const id = burstId++;
        const windowHeight = window.innerHeight;

        const baseColor = burstColors[Math.floor(Math.random() * burstColors.length)];
        const [h, s, l] = baseColor.match(/\d+/g)!.map(Number);

        const pieces = Array.from({ length: count }, (_, key) => {
          const hueShift = Math.random() * 10 - 5;
          const satShift = Math.random() * 10 - 5;
          const lightShift = Math.random() * 10 - 5;
          const color = `hsl(${(h + hueShift + 360) % 360}, ${Math.min(Math.max(s + satShift, 0), 100)}%, ${Math.min(Math.max(l + lightShift, 0), 100)}%)`;

          // Explosion vector
          const angle = Math.random() * 2 * Math.PI;
          const radius = 150 + Math.random() * 100;
          const dx = Math.cos(angle) * radius;
          const dy = Math.sin(angle) * radius;

          const rz = Math.random() * 720;
          const explosionDuration = 0.6 + Math.random() * 0.2; // seconds
          const fallDuration = 3 + Math.random() * 1.5; // seconds

          const fallY = windowHeight - y - dy;
          const fallX = Math.random() * 40 - 20; // small horizontal drift

          return {
            key,
            color,
            dx,
            dy,
            rz,
            duration: `${explosionDuration + fallDuration}s`,
            fallX,
            fallY,
          };
        });

        setBursts((prev) => [...prev, { id, pieces, x, y }]);
        setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 8000);
      },
    }));

    return (
      <>
        <style jsx>{`
          @keyframes confettiExplosion {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            15% {
              transform: translate(var(--dx), var(--dy)) rotate(var(--rz));
              opacity: 1;
            }
            100% {
              transform: translate(calc(var(--dx) + var(--fall-x)), calc(var(--dy) + var(--fall-y)))
                rotate(0deg);
              opacity: 0;
            }
          }
        `}</style>

        {bursts.map((burst) =>
          burst.pieces.map((piece) => (
            <div
              key={`${burst.id}-${piece.key}`}
              className="fixed w-2.5 h-2.5 pointer-events-none z-[9999]"
              style={{
                left: `${burst.x}px`,
                top: `${burst.y}px`,
                "--dx": `${piece.dx}px`,
                "--dy": `${piece.dy}px`,
                "--rz": `${piece.rz}deg`,
                "--fall-x": `${piece.fallX}px`,
                "--fall-y": `${piece.fallY}px`,
                backgroundColor: piece.color,
                animation: `confettiExplosion ${piece.duration} cubic-bezier(0.4, 0, 0.2, 1) forwards`,
              } as React.CSSProperties}
            />
          ))
        )}
      </>
    );
  }
);

Confetti.displayName = "Confetti";
export default Confetti;
