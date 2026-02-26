import api from "./api";
import type { CreateSellerProfileDTO, SellerProfileResponse, UpdateSellerProfileDTO } from "../types/seller/seller";


export const sellerService = {
    async create(data: CreateSellerProfileDTO): Promise<SellerProfileResponse> {
        const response = await api.post('/sellers', data)
        return response.data
    },


    async update(id: string, data: UpdateSellerProfileDTO): Promise<SellerProfileResponse> {
        const response = await api.put(`/sellers/${id}`, data)
        return response.data
    },


    async updateMyStore(
        data: UpdateSellerProfileDTO
    ): Promise<SellerProfileResponse> {
        const { data: response } = await api.put<SellerProfileResponse>(
            "/sellers/me",
            data
        );

        return response;
    },

    async getMyStore(): Promise<SellerProfileResponse> {
        const response = await api.get("/sellers/me")
        return response.data
    }

}