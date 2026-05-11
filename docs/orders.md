## POST /orders

Cria um novo pedido.

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

### Body Params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `customerId` | uuid | sim | UUID válido |
| `items` | array | sim | mínimo 1 item |
| `items[].productId` | uuid | sim | UUID válido |
| `items[].quantity` | number | sim | inteiro `>= 1` |

### Retorno `201 Created`

```json
{
  "id": "uuid",
  "customerId": "uuid",
  "status": "PENDING",
  "total": "number",
  "createdAt": "date",
  "items": [
    {
      "productId": "uuid",
      "quantity": "number",
      "unitPrice": "number",
      "total": "number"
    }
  ]
}
```

### Erros

| Status | Motivo |
|--------|--------|
| `400` | `customerId` ausente ou não é um UUID válido |
| `400` | `items` vazio ou ausente |
| `400` | `items[].productId` não é UUID válido |

### Exemplos

```bash
http POST localhost:3000/orders \
  customerId="uuid-do-cliente" \
  items:='[
    {"productId":"uuid-do-produto","quantity":2},
    {"productId":"uuid-do-produto-2","quantity":1}
  ]'
```

---

## GET /orders/:id

Busca um pedido pelo ID, incluindo seus itens.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do pedido |

### Retorno `200 OK`

```json
{
  "id": "uuid",
  "customerId": "uuid",
  "status": "PENDING",
  "total": "number",
  "createdAt": "date",
  "items": [
    {
      "productId": "uuid",
      "quantity": "number",
      "unitPrice": "number",
      "total": "number"
    }
  ]
}
```

### Erros

| Status | Motivo |
|--------|--------|
| `400` | `id` não é um UUID válido |
| `404` | Pedido não encontrado |

### Exemplos

```bash
http GET localhost:3000/orders/:uuid
```

---

## GET /orders/customer/:id

Lista todos os pedidos de um cliente.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do cliente |

### Retorno `200 OK`

```json
[
  {
    "id": "uuid",
    "customerId": "uuid",
    "status": "PENDING",
    "total": "number",
    "createdAt": "date"
  }
]
```

### Erros

| Status | Motivo |
|--------|--------|
| `400` | `id` não é um UUID válido |

### Exemplos

```bash
http GET localhost:3000/orders/customer/:uuid
```

---

## PATCH /orders/:id/status

Atualiza o status de um pedido.

### Path Params

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID do pedido |

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |

### Body Params

| Param | Tipo | Obrigatório | Valores aceitos |
|-------|------|-------------|-----------------|
| `status` | string | sim | `PENDING` `PAID` `DELIVERED` `CANCELLED` |

### Retorno `200 OK`

Retorna o pedido atualizado no mesmo formato do `GET /orders/:id` (com `items`).

### Erros

| Status | Motivo |
|--------|--------|
| `400` | `id` não é um UUID válido |
| `400` | `status` não é um valor válido do enum |
| `404` | Pedido não encontrado |

### Exemplos

```bash
http PATCH localhost:3000/orders/:uuid/status \
  status="PAID"
```