export const heroTexts = {
  name: "Gianluca Lourenço Alves",
  title: "Desenvolvedor FullStack",
  intro:
    "Desenvolvedor Full Stack especializado em TypeScript, React e Node.js. Este portfólio tem uma interface diferente: funciona como um terminal. Digite help para ver os comandos disponíveis ou vá direto em projects para conhecer o que já construí.",
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
  bio: "Apaixonado por programação e obcecado em evoluir. Gosto de desafios que me tiram da zona de conforto e acredito que crescer como desenvolvedor é resultado de atenção aos detalhes e vontade constante de melhorar.",
  location: "Jacareí-SP, Brasil",
  college: "FATEC Jacareí-SP, Desenvolvimento de Software, 2º semestre",
  goal: "Crescer como desenvolvedor Full Stack e contribuir com produtos que geram impacto real.",
  image: "../../public/profile.png",
};

export const projects = [
  {
    slug: "agrirslab",
    title: "Website institucional para o Agrirslab do INPE",
    description:
      "Website institucional completo desenvolvido em grupo para o Laboratório de Sensoriamento Remoto Agrícola do INPE, centralizar informações sobre pesquisas, projetos, equipe e publicações científicas, facilitando o acesso da comunidade acadêmica e do público interessado.",
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
      "Arquitetura Full-Stack Completa — Participei no desenvolvimento da aplicação com frontend responsivo (HTML/CSS/JS), backend em Node.js com Express, banco de dados relacional com modelagem entidade-relacionamento, atuando em todas as camadas do projeto",
      "Dashboard Administrativo com Autenticação — Implementei sistema CRUD completo com autenticação JWT, permitindo gestão de posts/notícias, membros da equipe e conteúdo institucional através de painel administrativo seguro",
      "Metodologia Ágil Scrum — Aplicamos metodologia ágil com 3 sprints documentadas, incluindo burndown charts, backlog priorizado, DoR/DoD e entregas incrementais com apresentações ao cliente",
    ],
    live: "https://website-institucional-agrirs-lab-in.vercel.app/home.html",
    repo: "https://github.com/GianlucaAlves/Website-Institucional-AgrirsLab-INPE",
    screenshots: ["../../public/agrirslab.png", "../../public/profile.png"],
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
    screenshots: [""],
  },
  {
    slug: "megasena-conferidor",
    title: "Mega-Sena Full Stack Conferidor WebApp",
    description:
      "Aplicação full-stack completa para consulta de resultados da Mega-Sena, permitindo buscar o sorteio mais recente ou qualquer concurso específico pelo número. Orquestrado com Docker Compose para portabilidade e facilidade de execução em qualquer ambiente.",
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
      "Arquitetura Full-Stack com Docker Compose — Estruturei a aplicação com 3 containers isolados (frontend, backend e PostgreSQL), orquestrados via Docker Compose, garantindo execução sem configuração manual e portabilidade total entre diferentes ambientes",
      "API REST com Node.js e TypeScript — Desenvolvi backend Express tipado com rotas dedicadas para consulta do concurso mais recente e busca por número, aplicando boas práticas de separação de responsabilidades e organização modular de rotas",
      "Frontend Tipado com React e Styled Components — Construí aplicação React 100% tipada com TypeScript e Styled Components, com Context API customizado (useMegaSena) para gerenciamento centralizado de estado de busca, resultados, carregamento e erros",
      "PostgreSQL com Volume Persistente — Configurei banco de dados relacional PostgreSQL com volume Docker persistente, garantindo integridade dos dados e preservação entre reinicializações dos containers",
      "Painel de Estatísticas — Implementei componente dedicado de estatísticas (EstatisticasPainel) para exibir dados agregados dos sorteios, proporcionando uma experiência de usuário mais rica e informativa",
    ],
    live: "",
    repo: "https://github.com/GianlucaAlves/MegaSena-Conferidor-WebApp",
    screenshots: ["../../public/megasena-conferidor1.png", "../../public/megasena-conferidor2.png", "../../public/megasena-conferidor3.png", "../../public/megasena-conferidor4.png"],
  },
  {
    slug: "mega-palpites",
    title: "Mega Palpites — Plataforma de Sugestões para a Mega-Sena",
    description:
      "Plataforma frontend para geração automática, seleção manual, histórico e simulação de sorteios da Mega-Sena. Desenvolvida em React + TypeScript como evolução de um exercício acadêmico para um projeto de portfólio completo.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    highlights: [
      "Gerador de Palpites Automáticos — Implementei algoritmo de geração de 6 dezenas aleatórias com lógica de não repetição, permitindo ao usuário gerar múltiplos palpites únicos com um clique",
      "Cartela de Seleção Manual — Desenvolvi interface interativa inspirada em cartelas físicas da Mega-Sena, permitindo ao usuário montar apostas manualmente com feedback visual em tempo real",
      "Histórico de Palpites — Criou sistema de registro persistente dos palpites gerados na sessão, permitindo consulta e comparação de apostas anteriores",
      "Simulador de Sorteio — Implementei funcionalidade de simulação de sorteio que permite ao usuário conferir seus palpites contra um resultado gerado, reproduzindo a experiência real de conferência de apostas",
      "Evolução Acadêmica para Portfólio — Projeto evoluído a partir de exercício acadêmico para aplicação de portfólio completa, demonstrando capacidade de refatoração, melhoria contínua e evolução de código existente",
    ],
    live: "",
    repo: "https://github.com/GianlucaAlves/mega-sena-suggester",
    screenshots: ["../../public/megasena-suggester1.png", "../../public/megasena-suggester2.png", "../../public/megasena-suggester3.png", "../../public/megasena-suggester4.png", "../../public/megasena-suggester5.png"],
  },
  {
    slug: "medsystem",
    title: "MedSystem — Sistema de Agendamentos Médicos Full Stack",
    description:
      "Sistema de agendamentos médicos full-stack com autenticação JWT, controle de acesso por roles, CRUD completo de pacientes e agendamentos, validação de conflito de horários e dashboard com métricas em tempo real.",
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
      "Autenticação e Autorização com JWT e Roles — Implementei sistema completo de autenticação com senhas hasheadas via bcrypt, tokens JWT com expiração de 24h e dois roles (ADMIN/USER) com proteção de rotas sensíveis como deleção",
      "Validação de Conflito de Horários — Utilizei o operador OVERLAPS do PostgreSQL para detectar sobreposição de agendamentos em nível de banco de dados, ignorando automaticamente agendamentos cancelados ou finalizados",
      "Dashboard com Métricas em Tempo Real — Desenvolvei painel administrativo com contagem de pacientes, distribuição de agendamentos por status e totais calculados dinamicamente via COUNT + GROUP BY no PostgreSQL",
      "SQL Puro com pg em vez de ORM — Optei por queries SQL diretas com o driver pg para manter visibilidade total do SQL executado e evitar abstrações desnecessárias, demonstrando domínio de SQL avançado",
      "Arquitetura Monorepo com concurrently — Configurei monorepo com script único npm run dev que inicia API e frontend em paralelo, simplificando o setup e refletindo workflow profissional real",
    ],
    live: "",
    repo: "https://github.com/GianlucaAlves/MedSystem",
    screenshots: ["../../public/medsystem1.jpg", "../../public/medsystem2.jpg", "../../public/medsystem3.jpg"],
  },
  {
    slug: "plandica",
    title: "Plandica — Sistema de Gestão de Cultivo Full Stack",
    description:
      "Sistema full-stack de gerenciamento de cultivo doméstico que permite registrar, rastrear e analisar todo o ciclo de vida de plantas de forma organizada. Inclui diário de cultivo, planner de tarefas, upload de fotos e assistente IA opcional.",
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
      "Monorepo com npm workspaces — Estruturei o projeto como monorepo com apps separados (Next.js e Express), packages compartilhados e scripts unificados para desenvolvimento, simplificando o ciclo de desenvolvimento full-stack",
      "Diário de Cultivo com Rastreabilidade Completa — Projetei sistema de eventos padronizados com registro de medições (pH, EC, temperatura), fotos anexadas e timeline completa por planta, cobrindo do plantio à colheita",
      "Upload de Fotos Otimizado — Implementei pipeline de upload com conversão HEIC→JPEG no navegador, geração de thumbnail automática (full + thumb) e armazenamento em object storage, garantindo UX fluida sem dependência de configuração do dispositivo",
      "Requisitos Funcionais e Não Funcionais Formalizados — Documentei user stories, critérios de aceitação e requisitos de segurança (HttpOnly cookies, CSRF, autorização por usuário), demonstrando processo de engenharia profissional",
      "Planner com Tarefas Recorrentes — Desenvolvi módulo de agendamento de tarefas com suporte a recorrência, lembretes e marcação de conclusão com observação, garantindo consistência operacional no cultivo",
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
  help: "help - Listar todos os comandos disponíveis",
  clear: "clear - Limpar o terminal",
  about: "about - Mostrar informações sobre",
  projects: "projects - Mostrar projetos em destaque",
  skills: "skills - Mostrar principais habilidades",
  contact: "contact - Mostrar links de contato",
  lang: "lang en - Mudar idioma para inglês",
};
