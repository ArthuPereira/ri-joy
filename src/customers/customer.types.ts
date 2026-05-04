export interface CreateCustomerDTO {
    name: string;
    email: string;
    cpf: string;
    phone: string;
}

export interface UpdateCustomerDTO {
    email?: string;
    phone?: string;
}

export interface ICustomeRow {
    id: string
    name: string
    email: string
    phone: string
    cpf: string
    active: boolean
}

export interface CustomerQuery {
    name?: string;
    email?: string;
    page?: string;
    limit?: string;
}

export interface SearchCustomersInput {
    name?: string;
    email?: string;
    page: number;
    limit: number;
}