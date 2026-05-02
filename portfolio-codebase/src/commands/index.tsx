import type { Command } from "../types/Command";
import * as en from "../content/en";
import * as pt from "../content/pt";
import ProjectCard from "../components/ProjectCard";

const texts = (lang: "en" | "pt") => (lang === "en" ? en : pt);

export const commands = (
  lang: "en" | "pt",
  setLang: (lang: "en" | "pt") => void,
): Command[] => [
  {
    name: "help",
    description: "List all available commands",
    run: () => {
      const help = texts(lang).help;
      const ascii =
        lang === "en"
          ? `
██╗  ██╗███████╗██╗     ██████╗ 
██║  ██║██╔════╝██║     ██╔══██╗
███████║█████╗  ██║     ██████╔╝
██╔══██║██╔══╝  ██║     ██╔═══╝ 
██║  ██║███████╗███████╗██║     
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     
                                
`
          : `
 █████╗      ██╗██╗   ██╗██████╗  █████╗ 
██╔══██╗     ██║██║   ██║██╔══██╗██╔══██╗
███████║     ██║██║   ██║██║  ██║███████║
██╔══██║██   ██║██║   ██║██║  ██║██╔══██║
██║  ██║╚█████╔╝╚██████╔╝██████╔╝██║  ██║
╚═╝  ╚═╝ ╚════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝
                                         
`;
      return {
        output: (
          <div>
            <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">
              {ascii}
            </pre>
            <ul>
              <li>{help.help}</li>
              <li>{help.clear}</li>
              <li>{help.about}</li>
              <li>{help.projects}</li>
              <li>{help.skills}</li>
              <li>{help.contact}</li>
              <li>{help.resume}</li>
              <li>{help.games}</li>
              <li>{help.lang}</li>
            </ul>
          </div>
        ),
      };
    },
  },
  {
    name: "clear",
    description: "Clear the terminal",
    run: () => ({
      output: "",
      clear: true,
    }),
  },
  {
    name: "lang",
    description: "Change language (en or pt)",
    run: ([newLang]) => {
      const normalizedLang = (newLang ?? "").toLowerCase();
      if (normalizedLang === "en" || normalizedLang === "pt") {
        setLang(normalizedLang);
        return { output: `Language changed to ${normalizedLang}` };
      }
      return { output: "Invalid language. Use 'lang en' or 'lang pt'." };
    },
  },
  {
    name: "about",
    description: "Show about info",
    run: () => {
      const about = texts(lang).about;
      const ascii =
        lang === "en"
          ? `
 █████╗ ██████╗  ██████╗ ██╗   ██╗████████╗
██╔══██╗██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝
███████║██████╔╝██║   ██║██║   ██║   ██║   
██╔══██║██╔══██╗██║   ██║██║   ██║   ██║   
██║  ██║██████╔╝╚██████╔╝╚██████╔╝   ██║   
╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝    ╚═╝   
                                           
`
          : `
███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔══██╗██╔════╝
███████╗██║   ██║██████╔╝██████╔╝█████╗  
╚════██║██║   ██║██╔══██╗██╔══██╗██╔══╝  
███████║╚██████╔╝██████╔╝██║  ██║███████╗
╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                         
`;
      return {
        output: (
          <>
            <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">
              {ascii}
            </pre>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="shrink-0 border border-green-500/40 shadow-[0_0_16px_rgba(0,255,65,0.2)]">
                <img
                  src={about.image}
                  alt="Gianluca Lourenço Alves"
                  width={200}
                  height={200}
                  className="w-48 h-48 object-cover object-top block"
                />
                <p className="text-[10px] text-green-700 font-mono text-center py-1 border-t border-green-500/20">
                  // Gianluca
                </p>
              </div>

              {/* Informações ao lado */}
              <div className="font-mono text-xs sm:text-sm space-y-2">
                <div>
                  <span className="text-green-600">bio</span>
                  <span className="text-green-500/50 mx-2">→</span>
                  <span className="text-green-300">{about.bio}</span>
                </div>
                <div>
                  <span className="text-green-600">location</span>
                  <span className="text-green-500/50 mx-2">→</span>
                  <span className="text-green-300">{about.location}</span>
                </div>
                <div>
                  <span className="text-green-600">college</span>
                  <span className="text-green-500/50 mx-2">→</span>
                  <span className="text-green-300">{about.college}</span>
                </div>
                <div>
                  <span className="text-green-600">goal</span>
                  <span className="text-green-500/50 mx-2">→</span>
                  <span className="text-green-300">{about.goal}</span>
                </div>
              </div>
            </div>
          </>
        ),
      };
    },
  },
  {
    name: "projects",
    description: "Show featured projects",
    run: () => {
      const projects = texts(lang).projects;
      const ascii =
        lang === "en"
          ? `
██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
                                                                                                                              
`
          : `
██████╗ ██████╗  ██████╗      ██╗███████╗████████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝╚══██╔══╝██╔═══██╗██╔════╝
██████╔╝██████╔╝██║   ██║     ██║█████╗     ██║   ██║   ██║███████╗
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝     ██║   ██║   ██║╚════██║
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗   ██║   ╚██████╔╝███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚══════╝
                                                                   
                                                                  
`;
      return {
        output: (
          <div>
            <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">
              {ascii}
            </pre>
            {projects.slice(0, projects.length).map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>
        ),
      };
    },
  },
  {
    name: "skills",
    description: "Show main skills",
    run: () => {
      const skills = texts(lang).skills;
      const ascii =
        lang === "en"
          ? `
███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
                                           
`
          : `
██╗  ██╗ █████╗ ██████╗ ██╗██╗     ██╗██████╗  █████╗ ██████╗ ███████╗███████╗
██║  ██║██╔══██╗██╔══██╗██║██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝
███████║███████║██████╔╝██║██║     ██║██║  ██║███████║██║  ██║█████╗  ███████╗
██╔══██║██╔══██║██╔══██╗██║██║     ██║██║  ██║██╔══██║██║  ██║██╔══╝  ╚════██║
██║  ██║██║  ██║██████╔╝██║███████╗██║██████╔╝██║  ██║██████╔╝███████╗███████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
                                                                              
`;
      return {
        output: (
          <div>
            <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">
              {ascii}
            </pre>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-black border border-green-400 text-green-300 px-3 py-1 rounded font-mono text-xs sm:text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: "contact",
    description: "Show contact links",
    run: () => {
      const contacts = texts(lang).contact;
      const ascii =
        lang === "en"
          ? `
 ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝   
                                                             
`
          : `
 ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗ ████████╗ ██████╗ 
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗╚══██╔══╝██╔═══██╗
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║   ██║   ██║   ██║
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║   ██║   ██║   ██║
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║   ██║   ╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝    ╚═════╝ 
                                                              
`;
      return {
        output: (
          <>
            <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">
              {ascii}
            </pre>
            <div className="flex flex-col gap-2">
              <a
                href={contacts.linkedin}
                target="_blank"
                rel="noopener"
                className="text-green-400 underline font-mono"
              >
                LinkedIn
              </a>
              <a
                href={contacts.github}
                target="_blank"
                rel="noopener"
                className="text-green-400 underline font-mono"
              >
                GitHub
              </a>
              <a
                href={`mailto:${contacts.email}`}
                className="text-green-400 underline font-mono"
              >
                Email
              </a>
            </div>
          </>
        ),
      };
    },
  },
  {
    name: "games",
    description: "List available games",
    run: ([gameName]) => {
      const normalizedGame = (gameName ?? "").toLowerCase();

      if (normalizedGame === "snake") {
        return {
          output: "",
          launchGame: "snake",
        };
      }

      if (normalizedGame === "pacman") {
        return {
          output: "",
          launchGame: "pacman",
        };
      }

      if (normalizedGame === "pokemon") {
        return {
          output: "",
          launchGame: "pokemon",
        };
      }

      if (normalizedGame !== "") {
        return {
          output:
            lang === "en"
              ? `Game not found: ${normalizedGame}`
              : `Jogo não encontrado: ${normalizedGame}`,
        };
      }

      return {
        output: (
          <div className="font-mono text-green-300 text-xs sm:text-sm">
            <div className="mb-2">
              {lang === "en" ? "Available games:" : "Jogos disponíveis:"}
            </div>
            <div className="mb-3">
              <span className="text-green-400">▸ snake</span>
              <span className="text-green-500/80">
                {lang === "en"
                  ? " — Classic snake game"
                  : " — Jogo clássico da cobrinha"}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-green-400">▸ pacman</span>
              <span className="text-green-500/80">
                {lang === "en"
                  ? " — Terminal maze chase"
                  : " — Perseguição em labirinto no terminal"}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-green-400">▸ pokemon</span>
              <span className="text-green-500/80">
                {lang === "en"
                  ? " Pokemon Gen I text RPG adventure"
                  : " Aventura Pokemon RPG textual da Gen I"}
              </span>
            </div>
            <div>
              {lang === "en"
                ? "Type games <name> to start."
                : "Digite games <nome> para iniciar."}
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: "resume",
    description: "Show formatted resume",
    run: () => {
      const resume = texts(lang).resume;
      return {
        output: (
          <div className="font-mono text-green-300 flex flex-col items-center">
            <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm leading-none mb-4 mt-2 whitespace-pre w-fit max-w-full scale-[0.8] sm:scale-100 origin-top">
              {resume.titleAscii}
            </pre>
            <div className="w-fit max-w-full">
              <pre className="text-[9px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words text-left">
                {resume.ascii}
              </pre>
              <div className="mt-2 border-t border-b border-green-500/30 py-2 text-[10px] sm:text-xs md:text-sm text-left">
                <a
                  href="/resume.pdf"
                  download
                  className="text-green-400 underline underline-offset-2 hover:text-green-200"
                >
                  {resume.downloadLabel}
                </a>
              </div>
            </div>
          </div>
        ),
      };
    },
  },
];
