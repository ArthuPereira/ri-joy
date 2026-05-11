<p align="center">
  <h1 align="center">🧸 Ri Joy — API de E-commerce</h1>
  <p align="center">API REST para gerenciamento de produtos, clientes e pedidos de uma loja de brinquedos.</p>
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="Express" src="https://img.shields.io/badge/Express-444444?style=for-the-badge&logo=express&logoColor=white"/>
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img alt="LocalStack" src="https://img.shields.io/badge/LocalStack-000000?style=for-the-badge&logo=amazon-aws&logoColor=white"/>
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
</p>

---

## Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Arquitetura](#️-arquitetura)
- [Banco de Dados](#️-banco-de-dados)
- [Como executar](#-como-executar)
- [Endpoints](#-endpoints)
    - [Produtos](#1-produtos)
    - [Clientes](#2-clientes)
    - [Pedidos](#3-pedidos)
- [Testando a API](#-testando-a-api)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Considerações Finais](#considerações-finais)

---

## [📖 Sobre o projeto](#sumário)

A **Ri Joy API** é uma aplicação back-end desenvolvida como avaliação técnica para a empresa júnior da faculdade. O tema foi inspirado na apresentação do time de marketing da Ri Joy, uma empresa do ramo de brinquedos.

A API oferece um conjunto de endpoints para as operações essenciais de um e-commerce: cadastro e listagem de produtos com imagens, gerenciamento de clientes e criação/acompanhamento de pedidos com seus respectivos itens.

---

## [🏗️ Arquitetura](#sumário)

O projeto segue uma **arquitetura em camadas** com separação por **conceitos de domínio**. Cada domínio (`products`, `customers`, `orders`) possui suas próprias camadas:

~~~
src/
├── <domínio>/
│   ├── <domínio>.ts              # Entidade / modelo de domínio
│   ├── <domínio>.types.ts        # Tipos e interfaces TypeScript
│   ├── <domínio>.repository.ts   # Acesso ao banco de dados (queries SQL)
│   ├── <domínio>.service.ts      # Regras de negócio
│   ├── <domínio>.controller.ts   # Handlers HTTP (Request/Response)
│   └── <domínio>.mapper.ts       # Conversão entre entidade e DTO (quando necessário)
~~~

### Fluxo de uma requisição

~~~
HTTP Request
    │
    ▼
Controller  →  Service  →  Repository  →  PostgreSQL
               (regras)     (queries)
                  │
                  ▼
           Storage Service  →  S3 (LocalStack)
~~~

### Estrutura de diretórios

~~~
.
├── docker-compose.yml          # PostgreSQL + LocalStack (produção/avaliação)
├── docker-compose.dev.yml      # Ambiente de desenvolvimento
├── docs/                       # Exemplos de requisições (Httpie)
│    ├── products.md
│    ├── customers.md
│    ├── orders.md
├── src/
│   ├── app.ts                  # Configuração do Express e middlewares
│   ├── server.ts               # Entry point — inicializa o servidor
│   ├── routes.ts               # Registro central de rotas
│   │
│   ├── customers/              # Domínio: Clientes
│   ├── products/               # Domínio: Produtos
│   │   └── images/             # Sub-domínio: Imagens de produto
│   ├── orders/                 # Domínio: Pedidos
│   │   └── items/              # Sub-domínio: Itens do pedido
│   │
│   ├── errors/                 # Erros de domínio customizados
│   │   ├── domain.ts           # Classe base de erro
│   │   ├── order.errors.ts
│   │   └── product.errors.ts
│   │
│   ├── infra/
│   │   ├── database/
│   │   │   ├── postgres.ts     # Classe de conexão com PostgreSQL
│   │   │   └── migrate.ts      # Runner de migrações
│   │   ├── migrations/         # Migrações SQL versionadas
│   │   └── storage/
│   │       ├── storage.ts      # Abstração do serviço de storage
│   │       └── storage.service.ts  # Implementação com S3/LocalStack
│   │
│   ├── middlewares/
│   │   ├── error.ts            # Middleware global de tratamento de erros
│   │   └── upload.ts           # Middleware de upload de arquivos (Multer)
│   │
│   └── seeds/                  # Scripts de população do banco
│       ├── assets/             # Imagens de exemplo dos produtos
│       ├── db.ts               # Seed do banco de dados
│       ├── s3.ts               # Seed do bucket S3
│       └── seed.ts             # Entry point do seed
~~~

---

## [🗄️ Banco de Dados](#sumário)

O esquema é aplicado via migrações SQL versionadas, executadas em ordem:

| Migração | Descrição |
|---|---|
| `001_products.sql` | Tabela de produtos |
| `002_products_images.sql` | Imagens dos produtos |
| `003_customers.sql` | Tabela de clientes |
| `004_orders.sql` | Tabela de pedidos |
| `005_order_items.sql` | Itens de cada pedido |
| `006_indexes.sql` | Índices para performance |
| `007_order_status.sql` | Tipo ENUM de status do pedido |
| `008_apply_order_status.sql` | Aplica o ENUM na tabela de pedidos |
| `009_alter_products_images.sql` | Ajustes na tabela de imagens |
| `010.active_consumers.sql` | Campo de ativo na tabela de clientes |

---

## [🚀 Como executar](#sumário)

### Pré-requisitos

- [Node.js](https://nodejs.org/) v22+
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clone o repositório

~~~bash
git clone https://github.com/seu-usuario/ri-joy-api.git
cd ri-joy-api
~~~

### 2. Instale as dependências

~~~bash
npm install
~~~

### 3. Suba a infraestrutura (PostgreSQL + LocalStack)

~~~bash
# Ambiente padrão (recomendado)
docker compose up -d

# ou de desenvolvimento
docker compose -f docker-compose.dev.yml up -d
~~~

### 4. Execute as migrações

~~~bash
npm run migrate
~~~

### 5. (Opcional) Popule o banco com dados de exemplo

~~~bash
npm run seed
~~~

> O seed cria produtos com imagens reais (brinquedos e roupas infantis) armazenadas no bucket S3 local via LocalStack.

### 6. Inicie o servidor

~~~bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build && npm start
~~~

O servidor estará disponível em `http://localhost:3000`.

---

## [📡 Endpoints](#sumário)

### 1. Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/products` | Busca/lista produtos (aceita query params de filtro) |
| `POST` | `/products` | Cria um novo produto |
| `GET` | `/products/:id` | Busca um produto pelo ID |
| `PATCH` | `/products/:id` | Atualiza dados de um produto |
| `DELETE` | `/products/:id` | Remove um produto |
| `POST` | `/products/:id/images` | Faz upload de imagem para o produto (`multipart/form-data`) |
| `GET` | `/products/:id/images` | Lista as imagens de um produto |
| `DELETE` | `/products/:productId/images/:imageId` | Remove uma imagem específica de um produto |

### 2. Clientes

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/customers` | Busca/lista clientes (aceita query params de filtro) |
| `POST` | `/customers` | Cadastra um novo cliente |
| `PATCH` | `/customers/:id` | Atualiza dados de um cliente |
| `DELETE` | `/customers/:id` | Remove um cliente |

### 3. Pedidos

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/orders` | Cria um novo pedido |
| `GET` | `/orders/:id` | Busca um pedido pelo ID (com itens) |
| `GET` | `/orders/customer/:id` | Lista todos os pedidos de um cliente |
| `PATCH` | `/orders/:id/status` | Atualiza o status de um pedido |

> Consulte os arquivos em `docs/` para exemplos prontos de uso com HTTPie mas que podem ser facilmente usado para outro cliente http

---

## [🧪 Testando a API](#sumário)

Os exemplos abaixo usam [HTTPie](https://httpie.io). Para instalar:

~~~bash
pip install httpie
~~~

O diretório `docs/` contém todos os comandos organizados por domínio (`products.http`, `customers.http`, `orders.http`).

### Fluxo completo: do produto ao pedido pago

**1. Crie um produto**

~~~bash
http POST localhost:3000/products \
  name="Carrinho de Controle Remoto" \
  sku="CAR-REM-001" \
  price:=90.00 \
  description="Carrinho RC com alcance de 20 metros"
~~~

Guarde o `id` retornado — ele será o `productId` nos próximos passos.

**2. Envie uma imagem para o produto**

~~~bash
http -f POST localhost:3000/products/:productId/images \
  image@./src/seeds/assets/pista-carrinho.jpg
~~~

A resposta incluirá uma `url` apontando para o bucket local. Abra o link no navegador para ver a imagem servida pelo LocalStack.

**3. Crie um cliente**

~~~bash
http POST localhost:3000/customers \
  name="Maria Silva" \
  email="maria@email.com" \
  phone="85999990000" \
  cpf="00000000000"
~~~

Guarde o `id` retornado — ele será o `customerId` no pedido.

**4. Crie um pedido**

~~~bash
http POST localhost:3000/orders \
  customerId=":customerId" \
  items:='[{"productId":":productId","quantity":2}]'
~~~

**5. Marque o pedido como pago**

~~~bash
http PATCH localhost:3000/orders/:orderId/status \
  status="PAID"
~~~

---

## [📦 Scripts disponíveis](#sumário)

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com hot reload |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm start` | Inicia o servidor compilado |
| `npm run migrate` | Executa as migrações do banco de dados |
| `npm run seed` | Popula o banco e os buckets com dados de exemplo |

---

## [🧹 Limpeza](#sumário)

Após testar, para remover as imagens do PostgreSQL e do LocalStack baixadas pelo Docker:

~~~bash
docker compose down
docker rmi postgres localstack/localstack
~~~

---

## [Considerações finais](#sumário)

Projeto desenvolvido para avaliação técnica da CEOS jr, a empresa júnior do curso de Ciência da Computação da UFC Pici, com tema inspirado na apresentação do time de marketing da Ri Joy 🧸.

Infelizmente o nível de refino que queria para o projeto não foi alcançado nessa etapa inicial, faltando:
- frontend
- autenticação
- melhor modelamento das classes
- testes automatizados
- Ci/Cd
- deploy
- melhores prática de eficiência...

Mas no geral o projeto foi muito proveitoso, e pude me aprofundar mais no ambiente node e uso de soluções cloud. E bem, antes feito do que não feito, no mais fico ansioso para as próximas versões desse projeto!