import { useRef, useState, useEffect, type JSX } from "react";
import { commands } from "../commands";

type TerminalProps = {
  lang: "en" | "pt";
  setLang: (lang: "en" | "pt") => void;
};

export default function Terminal({ lang, setLang }: TerminalProps) {
  const [history, setHistory] = useState<(string | JSX.Element)[]>([]);
  const [phosphorIndex, setPhosphorIndex] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cmds = commands(lang, setLang);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (history.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (history.length === 0) return;

    const index = history.length - 1;
    setPhosphorIndex(index);

    const timeout = window.setTimeout(() => {
      setPhosphorIndex((current) => (current === index ? null : current));
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [history.length]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalizedInput = input.trim().replace(/\s+/g, " ");
    if (normalizedInput === "") return;
    const [rawCmd, ...rawArgs] = normalizedInput.split(" ");
    const cmd = rawCmd.toLowerCase();
    const args = rawArgs.filter(Boolean);
    const command = cmds.find((c) => c.name === cmd);
    let output: string | JSX.Element = "";
    let clear = false;

    if (command) {
      const result = command.run(args);
      output = result.output;
      clear = !!result.clear;
    } else {
      output = `Command not found: ${cmd}`;
    }
    setHistory((h) =>
      clear ? [] : [...h, `gianluca@portfolio:~$ ${normalizedInput}`, output],
    );
    setInput("");
  }

  return (
    <div className="w-full bg-black/80 rounded-lg p-2 sm:p-3 mt-4 sm:mt-6 font-mono text-green-300 text-xs sm:text-sm shadow-lg">
      <div className="min-h-35 sm:min-h-55 w-full">
        {history.map((line, i) => (
          <div
            key={i}
            className={`mb-3 sm:mb-5 fade-in matrix-glow wrap-break-word max-w-full w-full ${
              phosphorIndex === i ? "phosphor-flash" : ""
            }`}
          >
            {line}
          </div>
        ))}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-2 items-center w-full"
        >
          <span className="mr-2 text-green-400 font-mono text-xs sm:text-sm prompt-pulse">
            gianluca@portfolio:~$
          </span>
          <input
            ref={inputRef}
            className="appearance-none bg-transparent border-0 outline-none ring-0 shadow-none flex-1 text-green-200 min-w-35 w-full sm:w-auto focus:outline-none focus:ring-0 focus:border-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}
