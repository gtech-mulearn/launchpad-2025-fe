import { apiHandler } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useGetVerifiedCompany = () => {
    return useQuery({
        queryKey: ["verifiedCompanies"],
        queryFn: async () => {
            const { data } = await apiHandler.get("/launchpad/company-list-verified/")
            console.log("Verified Companies Data:", data)
            return (data.response as { name: string, website: string }[])
        }
    })
}

const useGetAllIGs = () => {
    return useQuery({
        queryKey: ["allIGs"],
        queryFn: async () => {
            const { data } = await apiHandler.get("dashboard/ig/list/")
            return (data.response as { name: string }[])
        }
    })
}

const useGetCompanyData = () => {
    return useQuery({
        queryKey: ["companyData"],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const { data } = await axios.get("/api/cdata")
            return data as { company_name: string, roles: string, ig: string, closing_date: string }[]
        }
    })
}

export {
    useGetVerifiedCompany,
    useGetAllIGs,
    useGetCompanyData,
}
