type Project = {
  title: string;
  description: string;
  stack: string[];
  highlights: string[];
  live: string;
  repo: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="
      bg-black border border-green-400 rounded-lg p-2 sm:p-4 mb-4 w-full max-w-full
      shadow-lg ring-2 ring-green-500/30
      hover:ring-green-300 transition-all
      relative overflow-hidden
      before:absolute before:inset-0 before:pointer-events-none
      before:bg-linear-to-br before:from-green-400/10 before:to-transparent
      "
    >
      <div className="flex flex-wrap items-center gap-2 mb-2 w-full">
        <span className="text-green-400 font-mono text-base sm:text-lg font-bold wrap-break-word max-w-full">
          {project.title}
        </span>
        <span className="ml-auto flex gap-2 flex-wrap">
          <a
            href={project.live}
            target="_blank"
            rel="noopener"
            className="px-2 py-1 rounded border border-green-400 text-green-300 font-mono text-xs hover:bg-green-400 hover:text-black transition-all focus:ring-2 focus:ring-green-300"
          >
            Live
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener"
            className="px-2 py-1 rounded border border-green-400 text-green-300 font-mono text-xs hover:bg-green-400 hover:text-black transition-all focus:ring-2 focus:ring-green-300"
          >
            Repo
          </a>
        </span>
      </div>
      <div className="text-green-200 font-mono mb-2 text-sm sm:text-base wrap-break-word max-w-full">
        {project.description}
      </div>
      <div className="flex flex-wrap gap-2 mb-2 w-full">
        {project.stack.map((tech, i) => (
          <span
            key={i}
            className="bg-black border border-green-400 text-green-300 px-2 py-0.5 rounded font-mono text-xs"
          >
            {tech}
          </span>
        ))}
      </div>
      <ul className="list-disc list-inside text-green-200 text-xs sm:text-sm pl-2 border-l border-green-700 w-full">
        {project.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
