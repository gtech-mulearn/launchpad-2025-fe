import { apiHandler } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

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

export {
    useGetVerifiedCompany,
    useGetAllIGs
}
