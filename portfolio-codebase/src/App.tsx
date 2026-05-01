import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Terminal from "./components/Terminal";
import MonitorFrame from "./components/MonitorFrame";

const BIOS_LINES = [
  "GL-2049 BIOS Version 2.31",
  "Copyright (C) 1998-2026 GL Systems Inc.",
  "All Rights Reserved",
  "CPU: Intel Pentium II 450MHz ... OK",
  "Memory Test: 131072K OK",
  "Detecting primary storage ... GL-HDD-80GB",
  "Detecting input devices ... OK",
  "Loading GLTERM OS ...",
];

const SPLASH_ASCII = `
 ██████╗ ██╗         ████████╗███████╗██████╗ ███╗   ███╗
██╔════╝ ██║         ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
██║  ███╗██║            ██║   █████╗  ██████╔╝██╔████╔██║
██║   ██║██║            ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
╚██████╔╝███████╗       ██║   ███████╗██║  ██║██║ ╚═╝ ██║
 ╚═════╝ ╚══════╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
`;

function App() {
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [powerOn, setPowerOn] = useState(false);
  const [screenOpacity, setScreenOpacity] = useState(0);
  const [bootPhase, setBootPhase] = useState<"bios" | "splash" | "fade" | "done">(
    "done",
  );
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progressWidth, setProgressWidth] = useState("0%");

  useEffect(() => {
    if (window.innerWidth < 768) return;

    setBootPhase("bios");

    const bootMessages = BIOS_LINES;
    setPowerOn(false);
    setScreenOpacity(0);
    setBootLines([]);
    setProgressWidth("0%");
    if (bootMessages.length === 0) {
      return;
    }

    const timers: number[] = [];

    timers.push(window.setTimeout(() => setPowerOn(true), 400));
    timers.push(window.setTimeout(() => setScreenOpacity(1), 600));
    timers.push(window.setTimeout(() => setScreenOpacity(0), 680));
    timers.push(window.setTimeout(() => setScreenOpacity(1), 760));
    timers.push(window.setTimeout(() => setScreenOpacity(0), 840));
    timers.push(window.setTimeout(() => setScreenOpacity(1), 900));

    bootMessages.forEach((line, index) => {
      timers.push(
        window.setTimeout(() => {
          setBootLines((current) => [...current, line]);
        }, 960 + index * 120),
      );
    });

    timers.push(window.setTimeout(() => setBootPhase("splash"), 2200));
    timers.push(window.setTimeout(() => setProgressWidth("100%"), 2300));
    timers.push(window.setTimeout(() => setBootPhase("fade"), 4000));
    timers.push(window.setTimeout(() => setBootPhase("done"), 4300));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const showBootOverlay = bootPhase !== "done";

  return (
    <MonitorFrame powerOn={powerOn} screenOpacity={screenOpacity}>
      <div className="relative w-full min-h-[70vh]">
        <div className="w-full flex flex-col">
          <Hero lang={lang} />
          <Terminal lang={lang} setLang={setLang} />
        </div>
        {showBootOverlay ? (
          <div
            className={`absolute inset-0 z-30 bg-black transition-opacity duration-300 ${
              bootPhase === "fade" ? "opacity-0" : "opacity-100"
            }`}
          >
            {bootPhase === "bios" ? (
              <div className="p-4 text-[#e0e0e0] text-xs font-mono text-left space-y-1">
                {bootLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center h-full bg-black">
                <pre className="text-[#00ff41] text-xs sm:text-sm leading-none text-center whitespace-pre">
                  {SPLASH_ASCII}
                </pre>
                <div className="text-green-600 text-xs font-mono tracking-widest mt-4">
                  Version 1.0
                </div>
                <div className="absolute bottom-8 left-0 right-0">
                  <div className="w-48 h-2 border border-green-700 mx-auto">
                    <div
                      className="h-full bg-green-500 transition-[width] duration-[1400ms] ease-linear"
                      style={{ width: progressWidth }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </MonitorFrame>
  );
}

export default App;
