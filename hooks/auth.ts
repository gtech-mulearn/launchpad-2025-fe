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



const useForgotPassword = () => {
    return useMutation<{}, {}, { email: string, user_type: 'company' | 'recruiter' }>({
        mutationFn: async ({ email, user_type }) => {
            const { data } = await apiHandler.post("/launchpad/forgot-password/",
                { email, user_type }
            )
            return data
        },
    })
}

const useVerifyResetToken = () => {
    return useMutation<{}, {}, { token: string, user_type: 'company' | 'recruiter' }>({
        mutationFn: async ({ token, user_type }) => {
            const { data } = await apiHandler.post("/launchpad/verify-reset-token/",
                { token, user_type }
            )
            return data
        },
    })
}

const useResetPassword = () => {
    return useMutation<{}, {}, { token: string, user_type: 'company' | 'recruiter', new_password: string, confirm_password: string }>({
        mutationFn: async ({ token, user_type, new_password, confirm_password }) => {
            const { data } = await apiHandler.post("/launchpad/reset-password/",
                { token, user_type, new_password, confirm_password }
            )
            return data
        },
    })
}

export {
    useLoginRecruiter,
    useLoginCompany,
    useSignupCompany,
    useSignupRecruiter,
    useGetCompany,
    useGetRecruiter,
    useForgotPassword,
    useVerifyResetToken,
    useResetPassword,
}