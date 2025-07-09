import { apiHandler } from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/react-query"

type LoginRes = {
    id: string,
    accessToken: string,
    refreshToken: string,
}

const useLoginRecruiter = () => {
    return useMutation<LoginRes, {}, { email: string, pass: string }>({
        mutationFn: async ({ email, pass }: { email: string, pass: string }) => {
            const { data } = await apiHandler.post("/launchpad/login-recruiter/",
                { email, password: pass }
            )
            return data.response
        }
    })
}

const useLoginCompany = () => {
    return useMutation<LoginRes, {}, { email: string, pass: string }>({
        mutationFn: async ({ email, pass }: { email: string, pass: string }) => {
            const { data } = await apiHandler.post("/launchpad/login-company/",
                { username: email, password: pass }
            )
            return data.response
        },
    })
}

type CompanySignUpDto = {
    name: string,
    username: string,
    password: string,
    poc_name: string,
    poc_role: string,
    poc_email: string,
    poc_phone: string,
}

const useSignupCompany = () => {
    return useMutation<{}, {}, CompanySignUpDto>({
        mutationFn: async (companySignUpDto) => {
            const { data } = await apiHandler.post("/launchpad/register-company/",
                companySignUpDto
            )
            return data
        },
    })
}

type RecruiterSignUpDto = {
    company_id: string,
    name: string,
    email: string,
    phone: string,
    role: string,
    password: string,
}

const useSignupRecruiter = (accessToken: string) => {
    return useMutation<{}, {}, RecruiterSignUpDto>({
        mutationFn: async (recruiterSignUpDto) => {
            const { data } = await apiHandler.post("/launchpad/register-recruiter/",
                recruiterSignUpDto, { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            return data
        },
    })
}

const useGetCompany = (companyId: string, accessToken: string) => {
    return useQuery({
        queryKey: ["company", companyId],
        queryFn: async () => {
            const { data } = await apiHandler.post("launchpad/company-info/", {
                company_id: companyId
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return data.response
        },
        enabled: !!companyId,
    })
}

const useGetRecruiter = (recruiterId: string, accessToken: string) => {
    return useQuery({
        queryKey: ["recruiter", recruiterId],
        queryFn: async () => {
            const { data } = await apiHandler.post("launchpad/recruiter-info/", {
                recruiter_id: recruiterId
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return data.response
        },
        enabled: !!recruiterId,
    })
}

export {
    useLoginRecruiter,
    useLoginCompany,
    useSignupCompany,
    useSignupRecruiter,
    useGetCompany,
    useGetRecruiter
}