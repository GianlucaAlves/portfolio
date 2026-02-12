export const heroTexts = {
  name: "Gianluca Lourenço Alves",
  title: "Desenvolvedor FullStack",
  intro:
    "Oi, eu sou o Gianluca Lourenço Alves — Desenvolvedor Full Stack buscando estágio e apaixonado por transformar ideias em produtos funcionais, com atenção a performance, UI e qualidade de código. Aqui você navega como em um terminal: digite help para ver os comandos e use projects para ir direto ao que eu já construí..",
  welcomeSmall: `
+-----------+
| BEM-VINDO |
+-----------+
  `,
  welcome: `
██████╗ ███████╗███╗   ███╗    ██╗   ██╗██╗███╗   ██╗██████╗  ██████╗ 
██╔══██╗██╔════╝████╗ ████║    ██║   ██║██║████╗  ██║██╔══██╗██╔═══██╗
██████╔╝█████╗  ██╔████╔██║    ██║   ██║██║██╔██╗ ██║██║  ██║██║   ██║
██╔══██╗██╔══╝  ██║╚██╔╝██║    ╚██╗ ██╔╝██║██║╚██╗██║██║  ██║██║   ██║
██████╔╝███████╗██║ ╚═╝ ██║     ╚████╔╝ ██║██║ ╚████║██████╔╝╚██████╔╝
╚═════╝ ╚══════╝╚═╝     ╚═╝      ╚═══╝  ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ 
                                                                      
                                                                                         `,
};

export const about = {
  bio: "Eu realmente gosto de programar e estou sempre procurando novos desafios para crescer como desenvolvedor. Tenho experiência com JavaScript, React, Node.js, e estou ansioso para aprender mais tecnologias e melhores práticas em desenvolvimento de software.",
  location: "Jacareí-SP, Brasil",
  college: "FATEC Jacareí-SP, Desenvolvimento de Software, 2º semestre",
  goal: "Procurando um estágio em desenvolvimento de software.",
};

export const projects = [
  {
    slug: "agrirslab",
    title: "Website institucional para o Agrirslab do INPE",
    description:
      "Website institucional completo desenvolvido em grupo para o Laboratório de Sensoriamento Remoto Agrícola do INPE, centralizar informações sobre pesquisas, projetos, equipe e publicações científicas, facilitando o acesso da comunidade acadêmica e do público interessado.",
    stack: ["HTML", "CSS", "JavaScript", "PostgreSQL", "Node.js", "Express", "Git", "SCRUM"],
    highlights: [
      "Arquitetura Full-Stack Completa — Participei no desenvolvimento da aplicação com frontend responsivo (HTML/CSS/JS), backend em Node.js com Express, banco de dados relacional com modelagem entidade-relacionamento, atuando em todas as camadas do projeto",
      "Dashboard Administrativo com Autenticação — Implementei sistema CRUD completo com autenticação JWT, permitindo gestão de posts/notícias, membros da equipe e conteúdo institucional através de painel administrativo seguro",
      "Metodologia Ágil Scrum — Aplicamos metodologia ágil com 3 sprints documentadas, incluindo burndown charts, backlog priorizado, DoR/DoD e entregas incrementais com apresentações ao cliente",
    ],
    live: "https://website-institucional-agrirs-lab-in.vercel.app/home.html",
    repo: "https://github.com/GianlucaAlves/Website-Institucional-AgrirsLab-INPE",
  },
  {
    slug: "portfolio",
    title: "Portfólio pessoal",
    description:
      "Criação de um portfólio pessoal interativo, no estilo terminal, para apresentar meus projetos, habilidades e experiências. O objetivo é fornecer uma visão geral do meu trabalho e facilitar o contato com potenciais empregadores ou colaboradores.",
    stack: ["React", "TypeScript", "Tailwind", "Vite", "i18n Pattern"],
    highlights: [
      "Interface Terminal Customizada — Criei simulador de terminal funcional do zero com parser de comandos customizado, histórico de navegação, autocomplete e feedback visual em tempo real, proporcionando experiência única e memorável",
      "Tipagem Forte com TypeScript — Desenvolvi aplicação 100% tipada com TypeScript, criando interfaces e types customizados para comandos, conteúdo multilíngue e props de componentes, garantindo type-safety e melhor manutenibilidade",
      "Sistema de Internacionalização — Implementei arquitetura de conteúdo multilíngue com arquivos separados (pt.ts, en.ts), permitindo troca de idioma em tempo real via comando lang, sem reload da página",
      " Design System Matrix — Apliquei visual único inspirado em Matrix com animações CSS customizadas, efeito de texto digitando, paleta de cores tema dark/green e transições suaves usando Tailwind CSS",
      "Arquitetura Escalável — Organizei código com padrão modular: separação de comandos (/commands), conteúdo (/content), componentes (/components) e tipos (/types), facilitando adição de novos comandos e funcionalidades",
    ],
    live: "https://portfolio-gamma-peach-gelajuwt1r.vercel.app",
    repo: "https://github.com/GianlucaAlves/portfolio",
  },
  {
    slug: "agendador-horarios",
    title: "Sistema Agendador de Horários",
    description:
      "API REST profissional desenvolvida com Spring Boot para gerenciamento completo de agendamentos, aplicando arquitetura em camadas e boas práticas do ecossistema Java Enterprise.",
    stack: ["Java 17", "Spring Boot", "Spring Data JPA", "Maven", "H2 Database", "Hibernate"],
    highlights: [
      "Arquitetura em Camadas Profissional — Implementei separação clara de responsabilidades com Controller, Service, Repository e Entity, seguindo padrão de design usado em aplicações corporativas",
      "Persistência com JPA/Hibernate — Utilizei Spring Data JPA para abstração de banco de dados, implementando repository pattern com operações CRUD automáticas e type-safe",
      "API REST Completa — Desenvolvi 4 endpoints RESTful (GET, POST, PUT, DELETE) seguindo convenções HTTP, demonstrando conhecimento de verbos, status codes e boas práticas de API design",
      "Injeção de Dependências — Apliquei IoC (Inversão de Controle) do Spring Framework com anotações @Autowired, @Service e @Repository para código desacoplado e testável",
      "Build e Deploy Profissional — Configurei projeto com Maven, gerenciando dependências e lifecycle do projeto, com estrutura pronta para ambientes de produção",
    ],
    live: "https://agendador-horarios-java.vercel.app",
    repo: "https://github.com/GianlucaAlves/agendador-horarios-Java",
  },
   {
    slug: "gerenciador-tarefas",
    title: "Gerenciador de Tarefas com React e Tailwindcss", 
    description:
      "Aplicação web moderna de gerenciamento de tarefas (To-Do List) desenvolvida com React 18 e Tailwind CSS, permitindo criar, marcar como concluída, visualizar detalhes e excluir tarefas de forma intuitiva e responsiva.",
    stack: ["React", "TypeScript", "Tailwind"],
    highlights: [
      " React Hooks Modernos — Implementei gerenciamento de estado avançado usando useState para controle de tarefas e useEffect para sincronização com LocalStorage, garantindo persistência dos dados entre sessões",
      "Arquitetura Componentizada — Estruturei aplicação com separação clara de responsabilidades: componentes de apresentação (AddTask, Tasks), páginas de rotas (TaskPage) e lógica centralizada no App.jsx",
      "Build Otimizada com Vite — Utilizei Vite como build tool para desenvolvimento ultrarrápido com HMR (Hot Module Replacement) e build de produção otimizado, reduzindo drasticamente o tempo de compilação",
      "Estilização Utilitária com Tailwind — Apliquei framework CSS utilitário Tailwind para criar interface responsiva e moderna sem CSS customizado, usando ícones da biblioteca Lucide React",
      "Roteamento SPA — Integrei React Router DOM v6 para navegação client-side entre lista de tarefas e página de detalhes, criando experiência de Single Page Application fluida",
    ],
    live: "https://gerenciador-de-tarefas-com-react-e.vercel.app",
    repo: "https://github.com/GianlucaAlves/Gerenciador-de-tarefas-com-React-e-Tailwind",
  },
  {
    slug: "sistema-coleta-feedback",
    title: "Sistema de Coleta e Validação de Feedback",
    description:
      "Aplicação web moderna e responsiva para coleta de feedbacks de usuários com validação inteligente em tempo real e feedback visual dinâmico baseado nas avaliações recebidas.",
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    highlights: [
      "Validação Híbrida Robusta — Implementei sistema de validação dupla combinando HTML5 nativo com JavaScript customizado usando regex, garantindo integridade dos dados no client-side",
      "Feedback Visual Dinâmico — Desenvolvi sistema de alertas contextualizados que mudam cor e emoji automaticamente (verde/amarelo/vermelho) baseado na nota do usuário, melhorando significativamente a UX",
      "Design Responsivo Profissional — Utilizei Bootstrap 5 e Flexbox para criar interface adaptável que funciona perfeitamente em desktop, tablet e mobile com layout centralizado e moderno",
      "Manipulação de DOM Pura — Implementei toda lógica de interatividade com Vanilla JavaScript sem dependências externas, demonstrando domínio dos fundamentos da linguagem",
      "Acessibilidade e Semântica — Apliquei boas práticas de HTML5 semântico com elementos <form>, <fieldset>, <legend> e atributos ARIA para melhor acessibilidade"
    ],
    live: "https://project1.vercel.app",
    repo: "https://github.com/GianlucaAlves/Sistema-de-Coleta-e-Validacao-Node.js-HTML-CSS-Bootstrap",
  },
  {
    slug: "api-rest",
    title: "API REST de Operações Matemáticas",
    description:
      "Aplicação cliente-servidor full-stack desenvolvida com Node.js e Express que fornece API REST para cálculos matemáticos complexos (somatório, fatorial, média, números primos e MDC) com interface web para consumo.",
    stack: ["Node.js", "Express", "JavaScript", "HTML", "CSS"],
    highlights: [
      "API RESTful Completa — Desenvolvi 5 rotas HTTP GET com Express para operações matemáticas, implementando estrutura profissional de rotas separadas da lógica principal do servidor",
      "Algoritmos Matemáticos — Implementei algoritmos complexos incluindo cálculo de fatorial recursivo, verificação de números primos e algoritmo de Euclides para MDC, demonstrando lógica de programação avançada",
      "Arquitetura Organizada — Estruturei o projeto seguindo separação de responsabilidades com diretórios /public, /src/routes e /src, facilitando manutenção e escalabilidade",
      " Integração Frontend-Backend — Criei interface HTML/CSS/JavaScript que consome a API usando Fetch API, demonstrando conhecimento full-stack com comunicação assíncrona",
      "Query Parameters e Validação — Implementei processamento de parâmetros via query strings, conversão de tipos de dados e manipulação de arrays para entrada de múltiplos valores",
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
  help: "help - Listar todos os comandos disponíveis",
  clear: "clear - Limpar o terminal",
  about: "about - Mostrar informações sobre",
  projects: "projects - Mostrar projetos em destaque",
  skills: "skills - Mostrar principais habilidades",
  contact: "contact - Mostrar links de contato",
  lang: "lang en - Mudar idioma para inglês",
};
