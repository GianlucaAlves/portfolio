
# Portfolio 

Portfólio interativo em formato de terminal, com visual inspirado em Matrix, desenvolvido em React, TypeScript e Vite. Navegue digitando comandos, explore projetos, habilidades, contatos e alterne entre português e inglês.

---


---

## 📋 Sumário

- [Funcionalidades](#funcionalidades)
- [Comandos disponíveis](#comandos-disponiveis)
- [Exemplo de uso](#exemplo-de-uso)
- [Diferenciais](#diferenciais)
- [Arquitetura e Estrutura](#arquitetura-e-estrutura)
- [Instalação e uso local](#instalacao-e-uso-local)
- [Testes](#testes)
- [Deploy](#deploy)
- [Personalização](#personalizacao)
- [Autor](#autor)
- [Agradecimentos](#agradecimentos)
- [Licença](#licenca)

---

## 🚀 Funcionalidades

- Interface de terminal customizada e responsiva
- Comandos interativos: `help`, `about`, `projects`, `skills`, `contact`, `lang`, `clear`
- Suporte a dois idiomas: português e inglês
- Listagem de projetos com links para repositório e deploy
- Visual moderno com animações, efeito Matrix e dark mode
- Navegação por teclado
- Componentização e tipagem forte com TypeScript

---

## 💻 Comandos disponíveis

| Comando         | Descrição                                 |
|-----------------|-------------------------------------------|
| help            | Lista todos os comandos disponíveis        |
| about           | Exibe informações sobre mim                |
| projects        | Mostra projetos em destaque                |
| skills          | Lista principais habilidades               |
| contact         | Exibe links de contato                     |
| lang [en\|pt]   | Altera o idioma                            |
| clear           | Limpa o terminal                           |

---

## 🕹️ Exemplo de uso

Digite `help` para ver todos os comandos. Use `projects` para listar projetos, `about` para saber mais sobre o autor, e `lang pt` ou `lang en` para trocar o idioma.

---


## 🏗️ Arquitetura e Estrutura

```
src/
	components/   # Componentes React (Hero, Terminal, ProjectCard)
	commands/     # Implementação dos comandos do terminal
	content/      # Textos e dados em português e inglês
	types/        # Tipos TypeScript
```

Principais arquivos:

- `App.tsx`: Componente principal, controla idioma e layout
- `components/Terminal.tsx`: Terminal interativo e parser de comandos
- `commands/index.tsx`: Lógica dos comandos disponíveis
- `content/pt.ts` e `content/en.ts`: Textos e dados multilíngue

---

## 🛠️ Instalação e uso local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/portfolio-terminal-matrix.git
cd portfolio-terminal-matrix

# Instale as dependências
npm install

# Rode o projeto em modo desenvolvimento
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

---

## 🧪 Testes

Este projeto pode ser facilmente integrado a ferramentas como Jest ou React Testing Library para testes de componentes e comandos. (Adicione testes em `/__tests__` se desejar evoluir o projeto.)

---

## 🚀 Deploy

O deploy pode ser feito facilmente no [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/):

1. Faça push do projeto para o GitHub
2. Conecte o repositório na plataforma de deploy
3. Siga as instruções para build automático

---

## 🎨 Personalização

- Edite os arquivos em `src/content/pt.ts` e `src/content/en.ts` para alterar textos, projetos e contatos
- Adicione novos comandos em `src/commands/index.tsx`
- Modifique estilos via Tailwind em `index.css` ou nos componentes

---

## 👤 Autor

**Gianluca Lourenço Alves**

- [LinkedIn](https://linkedin.com/in/gianluca-alves)
- [GitHub](https://github.com/GianlucaAlves)
- Email: alves.gian@ymail.com

---

## 🙏 Agradecimentos

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 📄 Licença

MIT
