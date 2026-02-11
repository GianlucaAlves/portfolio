// src/components/BootScreen.tsx
import { useEffect, useState } from "react";

export default function BootScreen({ onFinish }: { onFinish: () => void }) {
  const [text, setText] = useState("");
  const bootMsg = "Booting portfolio terminal...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(bootMsg.slice(0, i + 1));
      i++;
      if (i === bootMsg.length) {
        clearInterval(interval);
        setTimeout(onFinish, 1000); // Espera um pouco antes de sumir
      }
    }, 40);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <span className="text-green-400 font-mono text-2xl">{text}</span>
    </div>
  );
}