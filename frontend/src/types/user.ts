export type User = {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER'| 'ADMIN';
  sellerId?:string;
  createdAt: string;
  updatedAt?: string;
}




export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
    role?: 'CUSTOMER' | 'SELLER'|'ADMIN';
};


export type UpdateUserDTO = {
    name?: string;
    email?: string;
    password?: string;
};
