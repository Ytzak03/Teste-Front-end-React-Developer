# Technest E-commerce Frontend

Este projeto é uma aplicação de e-commerce frontend desenvolvida em React, refatorada para consumir dados de uma API simulada utilizando JSON Server.

## Arquitetura

- **Frontend:** Desenvolvido com React e servido pelo [Vite](https://vitejs.dev/).
- **API Simulada:** Utiliza [JSON Server](https://github.com/typicode/json-server) para simular uma API RESTful, consumindo dados do arquivo `dbTeste.json`.

## Como Executar Localmente

**Pré-requisitos:**
- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)

**Passos:**

1.  **Navegue até o diretório do projeto:**
    ```bash
    cd /home/ubuntu/technest
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie a aplicação (frontend e API simulada):**
    ```bash
    npm run dev
    ```

    Este comando iniciará:
    - O frontend do React na porta `5173` (Vite).
    - A API simulada do JSON Server na porta `3001`, observando o arquivo `dbTeste.json`.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento do Vite e o JSON Server simultaneamente.
- `npm run client`: Inicia apenas o servidor de desenvolvimento do Vite.
- `npm run api`: Inicia apenas o JSON Server, observando `dbTeste.json` na porta `3001`.
- `npm run build`: Compila o projeto frontend para produção.
- `npm run preview`: Visualiza a build de produção localmente.
- `npm run lint`: Executa a verificação de tipos com TypeScript.

## Endpoints da API (JSON Server)

Todos os endpoints são servidos em `http://localhost:3001`:

- `GET /products`: Retorna todos os produtos.
- `GET /products/:id`: Retorna um produto específico pelo ID.

## Dependências

### Adicionadas
- `json-server`: Para simular a API RESTful.
- `concurrently`: Para executar o frontend e o JSON Server em paralelo.

### Removidas
- `express`: Framework de servidor Node.js.
- `dotenv`: Para carregar variáveis de ambiente.
- `@google/genai`: Possivelmente relacionado a alguma integração com Google AI Studio.
- `@types/express`: Tipagens para Express.
- `esbuild`: Bundler para JavaScript/TypeScript (usado no build do servidor anterior).
- `tsx`: Para executar arquivos TypeScript diretamente (usado no script `dev` anterior).

## Arquivos Alterados

- `package.json`: Atualizado com novos scripts e dependências.
- `src/services/api.ts`: Refatorado para usar a instância centralizada do Axios com `baseURL` apontando para o JSON Server.
- `src/App.tsx`: Atualizado para usar `apiService` em vez de `api` para chamadas de produtos.
- `README.md`: Este arquivo, atualizado para refletir a nova arquitetura e instruções.

## Arquivos Removidos

- `server.ts`: O arquivo do servidor Express customizado.

---

**Autor:** Manus AI
**Data:** 09 de Junho de 2026
