import { useRef, useState, useEffect, type JSX } from "react";
import { commands } from "../commands";

type TerminalProps = {
  lang: "en" | "pt";
  setLang: (lang: "en" | "pt") => void;
};

export default function Terminal({ lang, setLang }: TerminalProps) {
  const [history, setHistory] = useState<(string | JSX.Element)[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cmds = commands(lang, setLang);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === "") return;
    const [cmd, ...args] = input.trim().split(" ");
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
      clear ? [] : [...h, `gianluca@portfolio:~$ ${input}`, output],
    );
    setInput("");
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-black bg-opacity-80 rounded-lg p-2 sm:p-4 mt-6 sm:mt-8 font-mono text-green-300 shadow-lg">
      <div className="min-h-[140px] sm:min-h-[220px] w-full">
        {history.map((line, i) => (
          <div
            key={i}
            className="mb-3 sm:mb-5 fade-in matrix-glow break-words max-w-full w-full"
          >
            {line}
          </div>
        ))}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-2 items-center w-full"
        >
          <span className="mr-2 text-green-400 font-mono prompt-pulse">
            gianluca@portfolio:~$
          </span>
          <input
            ref={inputRef}
            className="bg-transparent outline-none flex-1 text-green-200 min-w-[140px] max-w-full w-full sm:w-auto"
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
