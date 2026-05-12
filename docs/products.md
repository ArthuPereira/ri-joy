## GET /products

Lista produtos com filtros opcionais. Retorna uma lista paginada.

### Query Params

| Param | Tipo | Obrigatório | Default |
|-------|------|-------------|---------|
| `name` | string | não | — |
| `minPrice` | number | não | — |
| `maxPrice` | number | não | — |
| `page` | number | não | `1` |
| `limit` | number | não | `20` |

### Retorno `200 OK`

~~~json
[
  {
    "id": "uuid",
    "name": "string",
    "sku": "string",
    "price": "number",
    "description": "string",
    "thumbnailUrl": "http://localhost/s3/products-images/products/...",
    "images": [
      {
        "id": "uuid",
        "url": "http://localhost/s3/products-images/products/...",
        "createdAt": "date"
      }
    ]
  }
]
~~~

### Exemplos

~~~bash
# Listar todos os produtos
http GET localhost/api/products

# Filtrar por nome
http GET localhost/api/products name==vestido

# Filtrar por faixa de preço
http GET localhost/api/products minPrice==40.0 maxPrice==50.0

# Paginação
http GET localhost/api/products page==2 limit==10
~~~

---

## GET /products/:id

Busca um produto pelo ID.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do produto |

### Retorno `200 OK`

~~~json
{
  "id": "uuid",
  "name": "string",
  "sku": "string",
  "price": "number",
  "description": "string",
  "active": "bool",
  "thumbnailUrl": "http://localhost/s3/products-images/products/...",
  "images": [
    {
      "id": "uuid",
      "url": "http://localhost/s3/products-images/products/...",
      "createdAt": "date"
    }
  ]
}
~~~

### Exemplos

~~~bash
http GET localhost/api/products/:uuid
~~~

---

## POST /products

Cria um novo produto sem imagem atribuída.

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

### Body Params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `name` | string | sim | — |
| `sku` | string | sim | — |
| `price` | number | sim | `> 0` |
| `description` | string | não | — |

### Retorno `201 Created`

~~~json
{
  "id": "uuid",
  "name": "string",
  "sku": "string",
  "price": "number",
  "description": "string",
  "active": "bool",
  "images": []
}
~~~

### Exemplos

~~~bash
http POST localhost/api/products \
  name="Carrinho de Controle Remoto" \
  sku="CAR-REM-001" \
  price:=90.00 \
  description="Carrinho RC com alcance de 20 metros"
~~~

---

## PATCH /products/:id

Atualiza parcialmente os dados de um produto.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do produto |

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

### Body Params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `name` | string | não | — |
| `sku` | string | não | — |
| `price` | number | não | `> 0` |
| `description` | string | não | — |

### Retorno `200 OK`

Retorna o produto atualizado no mesmo formato do `GET /products/:id`.

### Exemplos

~~~bash
http PATCH localhost/api/products/:uuid \
  price:=85.00 \
  description="Carrinho RC com alcance de 30 metros e luzes LED"
~~~

---

## DELETE /products/:id

Remove um produto.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do produto |

### Retorno `204 No Content`

### Exemplos

~~~bash
http DELETE localhost/api/products/:uuid
~~~

---

## POST /products/:id/images

Faz upload de uma imagem e a associa ao produto. A primeira imagem enviada se torna a `thumbnailUrl`.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do produto |

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `multipart/form-data` |

### Body Params

| Param | Tipo | Obrigatório |
|-------|------|-------------|
| `image` | file | sim |

### Retorno `201 Created`

~~~json
{
  "id": "uuid",
  "url": "http://localhost/s3/products-images/products/...",
  "createdAt": "date"
}
~~~

### Exemplos

~~~bash
http -f POST localhost/api/products/:uuid/images \
  image@./src/seeds/assets/pista-carrinho.jpg
~~~

---

## GET /products/:id/images

Lista todas as imagens de um produto.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do produto |

### Retorno `200 OK`

~~~json
[
  {
    "id": "uuid",
    "url": "http://localhost/s3/products-images/products/...",
    "createdAt": "date"
  }
]
~~~

### Exemplos

~~~bash
http GET localhost/api/products/:uuid/images
~~~

---

## DELETE /products/:productId/images/:imageId

Remove uma imagem específica de um produto.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `productId` | uuid | ID do produto |
| `imageId` | uuid | ID da imagem |

### Retorno `204 No Content`

### Exemplos

~~~bash
http DELETE localhost/api/products/:productId/images/:imageId
~~~