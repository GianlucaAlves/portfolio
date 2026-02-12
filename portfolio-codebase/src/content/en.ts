export const heroTexts = {
  name: "Gianluca Lourenço Alves",
  title: "Full Stack Developer",
  intro:
    "Hi, I'm Gianluca Lourenço Alves — a Full Stack Developer seeking an internship and passionate about turning ideas into functional products, with attention to performance, UI, and code quality. Here you navigate as in a terminal: type help to see the commands and use projects to go straight to what I've already built..",
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
  bio: "I really enjoy programming and I'm always looking for new challenges to grow as a developer. I have experience with JavaScript, React, Node.js, and I'm eager to learn more technologies and best practices in software development.",
  location: "Jacareí-SP, Brazil",
  college: "FATEC Jacareí-SP, Software Development, 2nd semester",
  goal: "Looking for a software development internship.",
};

export const projects = [
  {
    slug: "agrirslab",
    title: "Institutional Website for Agrirslab at INPE",
    description:
      "Complete institutional website developed in a group for the Agricultural Remote Sensing Laboratory at INPE, centralizing information about research, projects, team, and scientific publications, facilitating access for the academic community and interested public.",
    stack: ["HTML", "CSS", "JavaScript", "PostgreSQL", "Node.js", "Express", "Git", "SCRUM"],
    highlights: [
      "Complete Full-Stack Architecture — Participated in the development of the application with responsive frontend (HTML/CSS/JS), backend in Node.js with Express, relational database with entity-relationship modeling, working on all layers of the project",
      "Administrative Dashboard with Authentication — Implemented a complete CRUD system with JWT authentication, allowing management of posts/news, team members, and institutional content through a secure admin panel",
      "Agile Scrum Methodology — Applied agile methodology with 3 documented sprints, including burndown charts, prioritized backlog, DoR/DoD, and incremental deliveries with client presentations",
    ],
    live: "https://website-institucional-agrirs-lab-in.vercel.app/home.html",
    repo: "https://github.com/GianlucaAlves/Website-Institucional-AgrirsLab-INPE",
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
  },
  {
    slug: "agendador-horarios",
    title: "Schedule Management System",
    description:
      "Professional REST API developed with Spring Boot for comprehensive schedule management, applying layered architecture and best practices from the Java Enterprise ecosystem.",
    stack: ["Java 17", "Spring Boot", "Spring Data JPA", "Maven", "H2 Database", "Hibernate"],
    highlights: [
      "Professional Layered Architecture — Implemented clear separation of responsibilities with Controller, Service, Repository, and Entity, following design patterns used in enterprise applications",
      "Persistence with JPA/Hibernate — Utilized Spring Data JPA for database abstraction, implementing repository pattern with automatic and type-safe CRUD operations",
      "Complete REST API — Developed 4 RESTful endpoints (GET, POST, PUT, DELETE) following HTTP conventions, demonstrating knowledge of verbs, status codes, and API design best practices",
      "Dependency Injection — Applied Spring Framework IoC (Inversion of Control) with @Autowired, @Service, and @Repository annotations for decoupled and testable code",
      "Professional Build and Deployment — Configured project with Maven, managing dependencies and project lifecycle, with structure ready for production environments",
    ],
    live: "https://agendador-horarios-java.vercel.app",
    repo: "https://github.com/GianlucaAlves/agendador-horarios-Java",
  },
   {
    slug: "gerenciador-tarefas",
    title: "Task Manager with React and Tailwindcss", 
    description:
      "Modern web application for task management (To-Do List) developed with React 18 and Tailwind CSS, allowing users to create, mark as completed, view details, and delete tasks in an intuitive and responsive manner.",
    stack: ["React", "TypeScript", "Tailwind"],
    highlights: [
      "Modern React Hooks — Implemented advanced state management using useState for task control and useEffect for synchronization with LocalStorage, ensuring data persistence across sessions",
      "Component-Based Architecture — Structured the application with clear separation of concerns: presentation components (AddTask, Tasks), route pages (TaskPage), and centralized logic in App.jsx",
      "Optimized Build with Vite — Utilized Vite as a build tool for ultra-fast development with HMR (Hot Module Replacement) and optimized production build, drastically reducing compilation time",
      "Utility-First Styling with Tailwind — Applied Tailwind CSS utility framework to create a responsive and modern interface without custom CSS, using icons from the Lucide React library",
      "SPA Routing — Integrated React Router DOM v6 for client-side navigation between task list and detail page, creating a smooth Single Page Application experience",
    ],
    live: "https://gerenciador-de-tarefas-com-react-e-tailwind.vercel.app",
    repo: "https://github.com/GianlucaAlves/Gerenciador-de-tarefas-com-React-e-Tailwind",
  },
  {
    slug: "sistema-coleta-feedback",
    title: "Feedback Collection and Validation System",
    description:
      "Modern and responsive web application for collecting user feedback with intelligent real-time validation and dynamic visual feedback based on received ratings.",
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    highlights: [
      "Robust Hybrid Validation — Implemented a dual validation system combining native HTML5 with custom JavaScript using regex, ensuring data integrity on the client-side",
      "Dynamic Visual Feedback — Developed a contextual alert system that changes color and emoji automatically (green/yellow/red) based on user ratings, significantly improving UX",
      "Professional Responsive Design — Utilized Bootstrap 5 and Flexbox to create an adaptable interface that works perfectly on desktop, tablet, and mobile with a centered and modern layout",
      "Pure DOM Manipulation — Implemented all interactivity logic with Vanilla JavaScript without external dependencies, demonstrating mastery of language fundamentals",
      "Accessibility and Semantics — Applied best practices of semantic HTML5 with <form>, <fieldset>, <legend> elements and ARIA attributes for better accessibility"
    ],
    live: "https://project1.vercel.app",
    repo: "https://github.com/GianlucaAlves/Sistema-de-Coleta-e-Validacao-Node.js-HTML-CSS-Bootstrap",
  },
  {
    slug: "api-rest",
    title: "Mathematical Operations REST API",
    description:
      "Full-stack client-server application developed with Node.js and Express that provides a REST API for complex mathematical calculations (sum, factorial, average, prime numbers, and GCD) with a web interface for consumption.",
    stack: ["Node.js", "Express", "JavaScript", "HTML", "CSS"],
    highlights: [
      "Complete RESTful API — Developed 5 HTTP GET routes with Express for mathematical operations, implementing a professional structure with routes separated from the main server logic",
      "Mathematical Algorithms — Implemented complex algorithms including recursive factorial calculation, prime number verification, and Euclidean algorithm for GCD, demonstrating advanced programming logic",
      "Organized Architecture — Structured the project following separation of responsibilities with /public, /src/routes, and /src directories, facilitating maintenance and scalability",
      "Frontend-Backend Integration — Created HTML/CSS/JavaScript interface that consumes the API using Fetch API, demonstrating full-stack knowledge with asynchronous communication",
      "Query Parameters and Validation — Implemented parameter processing via query strings, data type conversion, and array manipulation for multiple value input",
    ],
    live: "https://portfolio-gamma-peach-gelajuwt1r.vercel.app",
    repo: "https://github.com/GianlucaAlves/CRUD-basico-Node.js-HTML-CSS",
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
  "SQL",
  "Java 17+",
  "Spring Boot"
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
