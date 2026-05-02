export const heroTexts = {
  name: "Gianluca Lourenço Alves",
  title: "Full Stack Developer",
  intro:
    "Full Stack developer specialized in TypeScript, React, and Node.js. This portfolio has a different interface: it works like a terminal. Type help to see available commands or go straight to projects to check out what I've built.",
  welcomeSmall: `
+------------+
|  WELCOME   |
+------------+
  `,
  welcome: `
██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  
██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
 ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
                                                              
  `,
};

export const about = {
  bio: "Passionate about programming and obsessed with evolving. I enjoy challenges that take me out of my comfort zone and believe that growing as a developer is the result of attention to detail and a constant desire to improve.",
  location: "Jacareí-SP, Brazil",
  college: "FATEC Jacareí-SP, Software Development, 2nd semester",
  goal: "Grow as a Full Stack developer and contribute to products that generate real impact.",
  image: "../../public/profile.png",
};

export const projects = [
  {
    slug: "agrirslab",
    title: "Institutional Website for Agrirslab at INPE",
    description:
      "Complete institutional website developed in a group for the Agricultural Remote Sensing Laboratory at INPE, centralizing information about research, projects, team, and scientific publications, facilitating access for the academic community and interested public.",
    stack: [
      "HTML",
      "CSS",
      "JavaScript",
      "PostgreSQL",
      "Node.js",
      "Express",
      "Git",
      "SCRUM",
    ],
    highlights: [
      "Complete Full-Stack Architecture — Participated in the development of the application with responsive frontend (HTML/CSS/JS), backend in Node.js with Express, relational database with entity-relationship modeling, working on all layers of the project",
      "Administrative Dashboard with Authentication — Implemented a complete CRUD system with JWT authentication, allowing management of posts/news, team members, and institutional content through a secure admin panel",
      "Agile Scrum Methodology — Applied agile methodology with 3 documented sprints, including burndown charts, prioritized backlog, DoR/DoD, and incremental deliveries with client presentations",
    ],
    live: "https://website-institucional-agrirs-lab-in.vercel.app/home.html",
    repo: "https://github.com/GianlucaAlves/Website-Institucional-AgrirsLab-INPE",
    screenshots: ["../../public/agrirslab1.png", "../../public/agrirslab2.png", "../../public/agrirslab3.png"],
  },
  {
    slug: "portfolio",
    title: "Personal Portfolio",
    description:
      "Creation of an interactive personal portfolio, in terminal style, to showcase my projects, skills, and experiences. The goal is to provide an overview of my work and facilitate contact with potential employers or collaborators.",
    stack: ["React", "TypeScript", "Tailwind", "Vite", "i18n Pattern"],
    highlights: [
      "Custom Terminal Interface — Created a functional terminal simulator from scratch with a custom command parser, navigation history, autocomplete, and real-time visual feedback, providing a unique and memorable experience",
      "Strong Typing with TypeScript — Developed a 100% typed application with TypeScript, creating custom interfaces and types for commands, multilingual content, and component props, ensuring type-safety and better maintainability",
      "Internationalization System — Implemented a multilingual content architecture with separate files (pt.ts, en.ts), allowing real-time language switching via the lang command, without page reload",
      "Matrix Design System — Applied a unique visual style inspired by Matrix with custom CSS animations, typing text effect, dark/green theme color palette, and smooth transitions using Tailwind CSS",
      "Scalable Architecture — Organized code with a modular pattern: separation of commands (/commands), content (/content), components (/components), and types (/types), facilitating the addition of new commands and features",
    ],
    live: "https://portfolio-gamma-peach-gelajuwt1r.vercel.app",
    repo: "https://github.com/GianlucaAlves/portfolio",
    screenshots: [
      "../../public/portfolio-home.png",
      "../../public/portfolio-about.png",
    ],
  },
  {
    slug: "megasena-conferidor",
    title: "Mega-Sena Full Stack Checker WebApp",
    description:
      "Complete full-stack application for querying Mega-Sena lottery results, allowing users to search for the latest draw or any specific contest by number. Orchestrated with Docker Compose for portability and ease of execution across any environment.",
    stack: [
      "React",
      "TypeScript",
      "Styled Components",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Docker",
      "Docker Compose",
    ],
    highlights: [
      "Full-Stack Architecture with Docker Compose — Structured the application with 3 isolated containers (frontend, backend, and PostgreSQL), orchestrated via Docker Compose, ensuring zero-configuration execution and full portability across different environments",
      "REST API with Node.js and TypeScript — Developed a typed Express backend with dedicated routes for querying the latest contest and search by number, applying best practices for separation of concerns and modular route organization",
      "Typed Frontend with React and Styled Components — Built a fully typed React application using TypeScript and Styled Components, with a custom Context API (useMegaSena) for centralized state management of search, results, loading, and errors",
      "PostgreSQL with Persistent Volume — Configured a relational PostgreSQL database with persistent Docker volume, guaranteeing data integrity and preservation across container restarts",
      "Statistics Panel — Implemented a dedicated statistics panel component (EstatisticasPainel) to display aggregated data from draws, providing a richer and more informative user experience",
    ],
    live: "",
    repo: "https://github.com/GianlucaAlves/MegaSena-Conferidor-WebApp",
    screenshots: ["../../public/megasena-conferidor1.png", "../../public/megasena-conferidor2.png", "../../public/megasena-conferidor3.png", "../../public/megasena-conferidor4.png"],
  },
  {
    slug: "mega-palpites",
    title: "Mega Palpites — Mega-Sena Suggestions Platform",
    description:
      "Frontend platform for automatic generation, manual selection, history, and draw simulation for the Mega-Sena lottery. Built with React + TypeScript as an evolution from an academic exercise to a complete portfolio project.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    highlights: [
      "Automatic Bet Generator — Implemented an algorithm to generate 6 unique random numbers without repetition, allowing users to create multiple unique bets with a single click",
      "Manual Selection Card — Developed an interactive interface inspired by physical Mega-Sena bet cards, allowing manual bet assembly with real-time visual feedback",
      "Bet History — Built a session-persistent bet history system allowing users to review and compare previously generated bets",
      "Draw Simulator — Implemented a draw simulation feature that lets users check their bets against a generated result, reproducing the real lottery checking experience",
      "Academic to Portfolio Evolution — Project evolved from an academic exercise to a complete portfolio application, demonstrating refactoring ability, continuous improvement, and evolution of existing code",
    ],
    live: "",
    repo: "https://github.com/GianlucaAlves/mega-sena-suggester",
    screenshots: ["../../public/megasena-suggester1.png", "../../public/megasena-suggester2.png", "../../public/megasena-suggester3.png", "../../public/megasena-suggester4.png", "../../public/megasena-suggester5.png"],
  },
  {
    slug: "medsystem",
    title: "MedSystem — Full Stack Medical Scheduling System",
    description:
      "Full-stack medical scheduling system with JWT authentication, role-based access control, complete patient and appointment CRUD, time conflict validation, and a real-time metrics dashboard.",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Node.js",
      "Express",
      "PostgreSQL",
      "JWT",
      "Docker",
    ],
    highlights: [
      "JWT Authentication and Role-Based Authorization — Implemented a complete authentication system with bcrypt password hashing, 24h JWT tokens, and two roles (ADMIN/USER) with protection of sensitive routes such as deletions",
      "Time Conflict Validation — Used PostgreSQL's OVERLAPS operator to detect scheduling overlaps at the database level, automatically ignoring canceled or completed appointments",
      "Real-Time Dashboard with Metrics — Built an admin panel with patient counts, appointment status distribution, and totals dynamically calculated via COUNT + GROUP BY in PostgreSQL",
      "Raw SQL with pg Instead of ORM — Chose direct SQL queries with the pg driver to maintain full visibility of executed SQL and avoid unnecessary abstractions, demonstrating advanced SQL mastery",
      "Monorepo Architecture with concurrently — Configured a monorepo with a single npm run dev script that starts the API and frontend in parallel, simplifying setup and reflecting a professional real-world workflow",
    ],
    live: "",
    repo: "https://github.com/GianlucaAlves/MedSystem",
    screenshots: ["../../public/medsystem1.jpg", "../../public/medsystem2.jpg", "../../public/medsystem3.jpg"],
  },
  {
    slug: "plandica",
    title: "Plandica — Full Stack Cultivation Management System",
    description:
      "Full-stack cultivation management system that allows users to record, track, and analyze the entire life cycle of their plants. Includes a grow journal, task planner, photo uploads, and an optional AI assistant.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
    ],
    highlights: [
      "Monorepo with npm workspaces — Structured the project as a monorepo with separate apps (Next.js and Express), shared packages and unified development scripts, simplifying the full-stack development cycle",
      "Grow Journal with Full Traceability — Designed a standardized event system with measurement recording (pH, EC, temperature), attached photos, and a complete timeline per plant, covering from seedling to harvest",
      "Optimized Photo Upload Pipeline — Implemented an upload pipeline with HEIC→JPEG browser-side conversion, automatic thumbnail generation (full + thumb), and object storage, ensuring a smooth UX without device configuration requirements",
      "Formalized Functional and Non-Functional Requirements — Documented user stories, acceptance criteria and security requirements (HttpOnly cookies, CSRF, per-user authorization), demonstrating a professional engineering process",
      "Recurring Task Planner — Developed a task scheduling module with recurrence support, reminders, and completion marking with notes, ensuring operational consistency in cultivation management",
    ],
    live: "",
    repo: "https://github.com/GianlucaAlves/GrowOps",
    screenshots: ["../../public/plandica1.jpg", "../../public/plandica2.jpg", "../../public/plandica3.jpg", "../../public/plandica4.jpg", "../../public/plandica5.jpg"],
  },
];

export const skills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "Git",
  "SCRUM",
  "Python",
  "PostgreSQL",
];

export const contact = {
  linkedin: "https://linkedin.com/in/gianluca-alves",
  github: "https://github.com/GianlucaAlves",
  email: "alves.gian@ymail.com",
};

export const help = {
  help: "help - List all available commands",
  clear: "clear - Clear the terminal",
  about: "about - Show about info",
  projects: "projects - Show featured projects",
  skills: "skills - Show main skills",
  contact: "contact - Show contact links",
  lang: "lang pt - Change language to portuguese",
};
