import { UpdateCustomerDTO } from "./customer.types";

export class Customer {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly cpf: string,
        public readonly active: boolean = true
    ) {}

    update(data: UpdateCustomerDTO): Customer {
        return new Customer(
            this.id,
            this.name,
            data.email ?? this.email,
            this.cpf,
            data.phone ?? this.phone
        );
    }
}