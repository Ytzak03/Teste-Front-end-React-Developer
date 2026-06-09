# TechNest - Teste Técnico Front-end React Developer

Projeto desenvolvido como solução para um teste técnico de Front-end React Developer. A aplicação simula uma loja virtual de produtos de tecnologia, oferecendo catálogo de produtos, página de detalhes, carrinho de compras, checkout e integração com uma API REST simulada através do JSON Server.

## Sobre o Projeto

O objetivo do projeto é demonstrar boas práticas de desenvolvimento front-end utilizando React, TypeScript e consumo de APIs REST, com foco em organização de código, componentização, experiência do usuário e manutenção.

A aplicação permite:

* Visualizar produtos em destaque na página inicial.
* Navegar pelo catálogo completo de produtos.
* Buscar produtos por nome.
* Filtrar produtos por categoria e faixa de preço.
* Ordenar produtos por preço, avaliação, popularidade e lançamentos.
* Visualizar detalhes individuais de cada produto.
* Adicionar e remover produtos do carrinho.
* Alterar a quantidade de itens adicionados.
* Visualizar subtotal e total da compra.
* Finalizar uma compra simulada.
* Persistir carrinho e histórico de pedidos utilizando Local Storage.
* Consumir dados através de requisições HTTP utilizando Axios.
* Utilizar uma API REST simulada com JSON Server a partir do arquivo `dbTeste.json`.

## Tecnologias Utilizadas

* React
* TypeScript
* Vite
* React Router DOM
* Axios
* JSON Server
* Tailwind CSS
* Lucide React
* Local Storage

Os dados são fornecidos através do JSON Server utilizando o arquivo `dbTeste.json`.

Endpoints disponíveis:

```http
GET http://localhost:3001/products
GET http://localhost:3001/products/:id
```

## 💻 Como Executar o Projeto Localmente

### 1. Clonar ou Extrair o Repositório

Extraia o arquivo ZIP do projeto ou clone o repositório em sua máquina local.

### 2. Instalar as Dependências

Navegue até a pasta do projeto no terminal e execute:

```bash
npm install
```

### 3. Executar o Projeto em Desenvolvimento

Para iniciar o frontend e a API local simultaneamente, execute:

```bash
npm run dev
```

Este comando executa concorrentemente:

1. O **JSON Server** na porta `3001`, utilizando os dados do arquivo `dbTeste.json`.
2. O **Vite**, responsável pelo servidor de desenvolvimento React.

Após a inicialização, acesse a aplicação pelo navegador:

```text
Frontend: http://localhost:5173
```

A API estará disponível em:

```text
API: http://localhost:3001/products
```

## Scripts Disponíveis

### npm run dev

Inicia simultaneamente o frontend React e a API local utilizando JSON Server.

### npm run client

Inicia apenas o frontend React.

### npm run api

Inicia apenas a API local utilizando JSON Server.

## Funcionalidades Implementadas

* Home com produtos em destaque.
* Catálogo responsivo com busca, filtros e ordenação.
* Página de detalhes do produto.
* Carrinho de compras com atualização dinâmica de quantidades.
* Checkout com resumo do pedido e finalização simulada.
* Indicadores de carregamento durante requisições.
* Tratamento de erros de API.
* Página 404 para rotas inexistentes.
* Notificações de feedback ao usuário.
* Persistência de carrinho utilizando Local Storage.
* Histórico de pedidos persistente.

## Observações

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica.

O processo de checkout é apenas uma simulação e não realiza transações financeiras reais.

Para o funcionamento correto da aplicação, o JSON Server deve estar em execução. O comando `npm run dev` já realiza essa configuração automaticamente.
