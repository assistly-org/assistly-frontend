import { api } from "@/lib/api";

export const TenantService = {

    async GetallOrganizations(){
    const response = await api.get("/organizations/all");
    return response.data;
    },

    async CreateOrganization(data: any){
    const response = await api.post("/tenant/create", data);
    return response.data;
    }

}