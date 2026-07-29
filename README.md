# Mini CRM de Leads — React/Next.js vs Angular

Um mesmo CRM de gestão de leads implementado duas vezes — uma em **React/Next.js** e outra em **Angular** — consumindo exatamente a mesma API, para comparar na prática as diferenças de arquitetura, reatividade, DX e performance entre os dois frameworks mais usados no mercado front-end.

## Por que este projeto existe

A maioria dos projetos de portfólio mostra "o que" foi construído, mas não "por que" foi construído daquele jeito. Este repositório existe para preencher essa lacuna: cada decisão técnica relevante — arquitetura, trade-off, ou escolha entre alternativas — está documentada abaixo, junto com os problemas reais enfrentados durante o desenvolvimento e como foram resolvidos.

## Stack

**Backend (compartilhado entre os dois fronts)**
- Node.js + TypeScript + Express
- Prisma ORM 7 + PostgreSQL
- Autenticação via JWT + bcrypt
- Validação com Zod

**Frontend React**
- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- SWR (cache e revalidação de dados)
- React Hook Form + Zod
- Axios

**Frontend Angular**
- Angular 17 (Standalone Components)
- TypeScript
- Tailwind CSS
- Signals (estado reativo nativo)
- Reactive Forms
- HttpClient + RxJS

## Estrutura do repositório

```
mini-crm-leads/
├── backend/              API compartilhada (Node.js + Express + Prisma)
├── frontend-react/       Implementação em Next.js
└── frontend-angular/     Implementação em Angular
```

## Funcionalidades (idênticas nas duas versões)

- Autenticação (registro e login com JWT)
- Dashboard com métricas em tempo real (total de leads, valor em negociação, taxa de conversão)
- CRUD completo de Leads (criar, listar com busca/filtro/paginação, editar, excluir)
- Timeline de interações por lead (adicionar e remover registros de contato)
- Proteção de rotas autenticadas

---

## Comparativo de arquitetura

Esta é a parte central do projeto. Abaixo, os pontos onde React e Angular resolvem o mesmo problema de formas fundamentalmente diferentes.

### 1. Modelo de reatividade

| | React (SWR) | Angular (Signals) |
|---|---|---|
| Cache de requisições | Automático, por chave | Não há cache nativo — cada fetch é manual |
| Revalidação | Automática (foco, intervalo, reconexão) | Manual, via `effect()` ou chamada explícita |
| Dependência externa | Sim (SWR é uma lib de terceiros) | Não (Signals é nativo do framework) |

**Trade-off:** SWR entrega mais "de graça" (cache, deduplicação, revalidação em background), mas adiciona uma dependência e sua própria curva de aprendizado. Signals é mais simples e sem dependências, mas exige implementar manualmente qualquer comportamento de cache que o projeto precise.

### 2. Formulários

| | React (React Hook Form + Zod) | Angular (Reactive Forms) |
|---|---|---|
| Validação | Schema Zod desacoplado do componente | `Validators` declarados no próprio `FormGroup` |
| Reuso de validação | Alto (schema pode ser usado em backend e frontend) | Médio (Validators são específicos do Angular) |
| Estado do formulário | Vem de uma lib externa (`formState.errors`) | Nativo do framework (`FormControl.errors`) |

**Trade-off:** Angular trata formulários como cidadão de primeira classe do framework — não precisa de nenhuma lib externa. React precisa de uma lib (React Hook Form) para atingir o mesmo nível de ergonomia, mas em troca ganha um schema de validação (Zod) reutilizável em qualquer camada da aplicação, incluindo o próprio backend.

### 3. Chamadas HTTP

| | React (Axios) | Angular (HttpClient) |
|---|---|---|
| Modelo de execução | Eager — a requisição dispara ao chamar a função | Lazy — nada acontece até dar `.subscribe()` |
| Tipo de retorno | `Promise` | `Observable` (RxJS) |
| Encadeamento de erros | `.then/.catch` | Operadores RxJS (`pipe`, `catchError`) |

**Trade-off:** Observables dão mais poder (cancelamento, retry, combinação de streams), mas têm uma curva de aprendizado maior que Promises. Esquecer um `.subscribe()` no Angular é uma armadilha real — a requisição simplesmente nunca sai.

### 4. Proteção de rotas

| | React (Next.js `proxy.ts`, ex-middleware) | Angular (Route Guards) |
|---|---|---|
| Nível de execução | Servidor/edge, antes de qualquer render | Client-side, no próprio router |
| Configuração | Um arquivo central com `matcher` | Declarado rota a rota (`canActivate: [...]`) |
| Rastreabilidade | Baixa (é fácil esquecer de configurar o matcher certo) | Alta (basta olhar o arquivo de rotas) |

**Trade-off:** o modelo do Next.js centraliza a proteção, mas isso a torna praticamente invisível até algo dar errado — vivemos isso na prática (ver seção de troubleshooting). O modelo do Angular é mais verboso (cada rota nova precisa lembrar de adicionar o guard), mas nunca esconde a lógica de proteção em um lugar separado do resto do roteamento.

### 5. Injeção de dependência

React não tem um sistema de Injeção de Dependência nativo — os `services/*.ts` eram apenas módulos com funções exportadas, importados diretamente onde necessário. Angular usa **DI como conceito central de arquitetura**: cada serviço é decorado com `@Injectable({ providedIn: "root" })` e injetado via `inject()`, gerenciado inteiramente pelo framework como singleton.

### 6. Organização de pastas

React/Next.js organiza por **convenção de rota** (o App Router já dita a estrutura: cada pasta em `app/` é uma rota). Angular seguiu a convenção de mercado **`core/shared/features`**, separando explicitamente infraestrutura transversal (services, guards, interceptors, models) das telas de negócio.

---

## Decisões técnicas notáveis

- **Modelo de dados idêntico nos dois fronts:** como ambos consomem a mesma API, os `types`/`models` são estruturalmente iguais — a diferença real está inteiramente na forma de consumir e reagir aos dados, não no formato dos dados em si.
- **Toggle de edição em vez de rota separada** (tela de detalhe do lead): visualização e edição compartilham o mesmo dado já carregado, evitando um novo fetch ou passagem de estado entre páginas. Trade-off: a URL não reflete o modo de edição.
- **Token JWT em cookie (não localStorage):** necessário para o Angular Router (guards) e o Next.js `proxy.ts` (que rodam no nível de rota/servidor) conseguirem ler o token antes da página renderizar.
- **Uma única API para os dois fronts:** validação de arquitetura consciente — qualquer divergência de comportamento entre as duas versões vem exclusivamente da camada de apresentação, nunca da camada de dados.

---

## Troubleshooting real enfrentado (e o que ensinou)

Nenhum destes problemas foi resolvido "adivinhando" — cada um exigiu isolar a causa raiz antes de corrigir. Vale documentar porque mostra o processo, não só o resultado.

- **Prisma 7:** a versão mudou onde a `DATABASE_URL` é configurada — saiu do `schema.prisma` e foi para um `prisma.config.ts` dedicado, com o `PrismaClient` passando a exigir um *driver adapter* explícito (`@prisma/adapter-pg`) em vez de ler a URL sozinho.
- **Next.js 16:** o arquivo `middleware.ts` foi renomeado para `proxy.ts` (com `export default`, não `export function`), e precisa estar no mesmo nível da pasta `app/` — não necessariamente dentro de `src/`. O ponto crítico: um arquivo mal posicionado ou com a export errada é **ignorado silenciosamente**, sem erro nem warning.
- **nvm-windows com espaço no nome do usuário:** o comando `nvm use` falhava porque o caminho do perfil do Windows continha um espaço (`Patrick Resplandes`), quebrando a resolução interna do link simbólico do Node. Resolvido rodando o comando como Administrador.
- **Angular Signals + `effect()`:** por padrão, um `effect()` não pode escrever em signals enquanto executa (proteção contra loops de reatividade). Resolvido com `{ allowSignalWrites: true }`, seguro neste caso porque não há sobreposição entre os signals lidos e os escritos dentro do mesmo efeito.
- **Sintaxe `@if...as` do Angular:** a variável de contexto (`as l`) só pode ser declarada no bloco `@if` principal, nunca em um `@else if` — exigiu reordenar blocos condicionais em mais de uma tela.
- **Tailwind CSS v4:** mudança completa na forma de configuração (de `@tailwind base/components/utilities` para um único `@import "tailwindcss"`), incompatível com tutoriais e configurações pensadas para a v3.

---

## Como rodar o projeto

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend React
```bash
cd frontend-react
npm install
npm run dev
```
Acesse `http://localhost:3000`

### Frontend Angular
```bash
cd frontend-angular
npm install
ng serve
```
Acesse `http://localhost:4200`

Configure o `.env` do backend com `DATABASE_URL` e `JWT_SECRET`, e os `.env.local`/`environment.ts` de cada front apontando para `http://localhost:8080`.

---

## Autor

Patrick Resplandes — Desenvolvedor Front-End Pleno | React.js, Next.js, TypeScript 

[LinkedIn](https://www.linkedin.com/in/patrickresplandes) · [Portfólio](https://portifolio-web-ecru.vercel.app)