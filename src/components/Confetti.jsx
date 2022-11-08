import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  });

  return (
    <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-800">
      Yay for democracy.
    </div>
  );
}
