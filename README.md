# FavelaClub — LAGO Platform

Sistema de gestão comunitária para administrar presidentes, famílias e ciclos de benefícios.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — estilização responsiva
- **Recharts** — gráficos e visualizações
- **React Router v6** — navegação SPA
- **Lucide React** — ícones

## Usuários

| Usuário      | Senha    | Acesso                                              |
|-------------|----------|-----------------------------------------------------|
| `admin`     | `852456` | Total — todas as páginas                            |
| `presidente`| `852456` | Dashboard, Formulários, Famílias, Aprovados, Histórico |
| `morador`   | `852456` | Dashboard, Aprovados                                |

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build para produção

```bash
npm run build
npm run preview
```

## Deploy no Render

1. Crie um serviço **Static Site** no [Render](https://render.com)
2. Conecte o repositório GitHub
3. Defina:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. O arquivo `render.yaml` já configura o redirect SPA automaticamente

## Páginas

- **Dashboard** — métricas do ciclo, gráficos e rankings
- **Formulários** — criação e gestão de formulários
- **Presidentes** — ranking, status e edição de cotas
- **Famílias** — listagem, pontuação e pré-aprovação
- **Aprovados** — gerenciamento das aprovações do ciclo
- **Feedbacks** — feedbacks anônimos da comunidade
- **Histórico** — linha do tempo de eventos e ciclos
