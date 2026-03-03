export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
    role?: 'CUSTOMER' | 'SELLER';
};


export type UpdateUserDTO = {
    name?: string;
    email?: string;
    password?: string;
};
