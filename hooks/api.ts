import { apiHandler } from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/react-query"

const fakeCompanies = [
    "ss",
    "Rizz",
    "Tech Solutions Ohio",
    "awin",
    "Ohio Company",
]

const useGetVerifiedCompany = () => {
    return useQuery({
        queryKey: ["verifiedCompanies"],
        queryFn: async () => {
            const { data } = await apiHandler.get("/launchpad/company-list-verifed/")
            console.log("Verified Companies Data:", data)
            return (data.response as { name: string, website: string }[]).filter(company => !fakeCompanies.includes(company.name))
        }
    })
}

export {
    useGetVerifiedCompany,
}