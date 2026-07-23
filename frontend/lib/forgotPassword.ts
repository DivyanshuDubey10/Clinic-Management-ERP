import api from "./api";

export async function forgotPassword(email: string){
    return api.post('/auth/forgot-password',{email});
}

export async function verifyResetOTP(email:string, otp: string){
    return api.post('/auth/verify-reset-otp',{
        email, otp
    })
}

export async function resetPassword(
    email: string,
    otp: string,
    newPassword: string,
){
    return api.post('/auth/reset-password',{
        email,
        otp,
        newPassword
    })
}