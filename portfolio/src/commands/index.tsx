import type { Command } from "../types/Command";
import * as en from "../content/en";
import * as pt from "../content/pt";
import ProjectCard from "../components/ProjectCard";

const texts = (lang: "en" | "pt") => (lang === "en" ? en : pt);

export const commands = (lang: "en" | "pt", setLang: (lang: "en" | "pt") => void): Command[] => [
  {
    name: "help",
    description: "List all available commands",
    run: () => ({
      output: (
        <ul>
          <li>help — List all available commands</li>
          <li>clear — Clear the terminal</li>
          <li>about — Show about info</li>
          <li>projects — Show featured projects</li>
          <li>skills — Show main skills</li>
          <li>contact — Show contact links</li>
        </ul>
      ),
    }),
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
      if (newLang === "en" || newLang === "pt") {
        setLang(newLang);
        return { output: `Language changed to ${newLang}` };
      }
      return { output: "Invalid language. Use 'lang en' or 'lang pt'." };
    },
  },
   {
    name: "about",
    description: "Show about info",
    run: () => {
      const about = commands.name === "en" ? texts("en").about : texts("pt").about;
      return {
        output: (
          <div>
            <div><b>Bio:</b> {about.bio}</div>
            <div><b>Location:</b> {about.location}</div>
            <div><b>College:</b> {about.college}</div>
            <div><b>Goal:</b> {about.goal}</div>
          </div>
        ),
      };
    },
  },
  {
  name: "projects",
  description: "Show featured projects",
  run: () => {
    const projects = commands.name === "en" ? texts("en").projects : texts("pt").projects;
    return {
      output: (
        <div>
          {projects.slice(0, 3).map((project, idx) => (
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
    const skills = lang === "en" ? texts("en").skills : texts("pt").skills;
    return {
      output: (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-black border border-green-400 text-green-300 px-3 py-1 rounded font-mono text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
    };
  },
},
{
  name: "contact",
  description: "Show contact links",
  run: () => {
    const contacts = texts("en").contact;
    return {
      output: (
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
      ),
    };
  },
},
];