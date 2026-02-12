import type { Command } from "../types/Command";
import * as en from "../content/en";
import * as pt from "../content/pt";
import ProjectCard from "../components/ProjectCard";

const texts = (lang: "en" | "pt") => (lang === "en" ? en : pt);

export const commands = (lang: "en" | "pt", setLang: (lang: "en" | "pt") => void): Command[] => [
  {
    name: "help",
    description: "List all available commands",
    run: () => {
      const help = texts(lang).help;
      const ascii = lang === "en"
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
      return{
      output: (
        <div>
          <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm lg:text-base leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">{ascii}</pre>
          <ul>
            <li>{help.help}</li>
            <li>{help.clear}</li>
            <li>{help.about}</li>
            <li>{help.projects}</li>
            <li>{help.skills}</li>
            <li>{help.contact}</li>
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
        const about = texts(lang).about;
         const ascii = lang === "en"
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
            <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm lg:text-base leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">{ascii}</pre>
            <div>
              <div><b>Bio:</b> {about.bio}</div>
              <div><b>Location:</b> {about.location}</div>
              <div><b>College:</b> {about.college}</div>
              <div><b>Goal:</b> {about.goal}</div>
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
    const ascii = lang === "en"
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
           <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm lg:text-base leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">{ascii}</pre>
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
    const ascii = lang === "en"
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
        <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm lg:text-base leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">{ascii}</pre>
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
    const ascii = lang === "en"
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
        <pre className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm lg:text-base leading-none mb-4 mt-2 whitespace-pre text-center max-w-full scale-[0.8] sm:scale-100 origin-top">{ascii}</pre>
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
];