## GET /customers

Lista clientes com filtros opcionais.

### Query Params

| Param | Tipo | Obrigatório | Default | Regras |
|-------|------|-------------|---------|--------|
| `name` | string | não | — | deve ser string |
| `email` | string | não | — | deve ser string |
| `page` | number | não | `1` | inteiro `>= 1` |
| `limit` | number | não | `20` | inteiro `>= 1` |

### Retorno `200 OK`

~~~json
[
  {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "cpf": "string",
    "active": "bool"
  }
]
~~~

### Erros

| Status | Mensagem | Motivo |
|--------|----------|--------|
| `400` | `"Página inválida"` | `page` não é inteiro ou `< 1` |
| `400` | `"Limite inválido"` | `limit` não é inteiro ou `< 1` |
| `400` | `"Nome inválido"` | `name` não é string |
| `400` | `"Email inválido"` | `email` não é string |

### Exemplos

~~~bash
# Listar todos os clientes
http GET localhost/api/customers

# Filtrar por nome
http GET localhost/api/customers name==maria

# Filtrar por email
http GET localhost/api/customers email==maria@email.com

# Paginação
http GET localhost/api/customers page==2 limit==10
~~~

---

## POST /customers

Cria um novo cliente.

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

### Body Params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `name` | string | sim | — |
| `email` | string | sim | deve conter `@` |
| `phone` | string | sim | — |
| `cpf` | string | sim | — |

### Retorno `201 Created`

~~~json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "cpf": "string",
  "active": "bool"
}
~~~

### Erros

| Status | Mensagem | Motivo |
|--------|----------|--------|
| `400` | `"campos obrigatórios faltando"` | `name`, `email`, `phone` ou `cpf` ausentes |
| `400` | `"Email deve ser válido"` | Email sem `@` |

### Exemplos

~~~bash
http POST localhost/api/customers \
  name="Maria Silva" \
  email="maria@email.com" \
  phone="85999990000" \
  cpf="00000000000"
~~~

---

## PATCH /customers/:id

Atualiza parcialmente os dados de um cliente.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do cliente |

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

### Body Params

| Param | Tipo | Obrigatório |
|-------|------|-------------|
| `name` | string | não |
| `email` | string | não |
| `phone` | string | não |
| `cpf` | string | não |

### Retorno `200 OK`

Retorna o cliente atualizado no mesmo formato do `GET /customers`.

### Exemplos

~~~bash
http PATCH localhost/api/customers/:uuid \
  phone="85988880000"
~~~

---

## DELETE /customers/:id

Remove um cliente.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do cliente |

### Retorno `204 No Content`

### Exemplos

~~~bash
http DELETE localhost/api/customers/:uuid
~~~