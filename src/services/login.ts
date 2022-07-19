import request from "@/utils/request";

export const login = async (params = {}) => {
    return await request('POST', '/admin/auth/login', {
        body: params
    })
}

export const captcha = async () => {
    const result = await request('GET', '/admin/auth/verification_code')
    console.log('result', result)
    return result
}