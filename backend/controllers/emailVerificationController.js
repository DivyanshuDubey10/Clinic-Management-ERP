exports.verifyEmail = async (req, res) => {

    try{

        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            emailVerificationOTP: otp,
            emailVerificationOTPExpire: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired OTP."
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationOTP = undefined;
        user.emailVerificationOTPExpire = undefined;

        await user.save();

        res.status(200).json({
            success:true,
            message:"Email verified successfully."
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}


//resend otp
exports.resendVerificationOTP = async (req,res)=>{

    try{

        const { email } = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            });
        }

        const otp = Math.floor(
            100000 + Math.random()*900000
        ).toString();

        user.emailVerificationOTP = otp;
        user.emailVerificationOTPExpire =
            Date.now()+10*60*1000;

        await user.save({validateBeforeSave:false});

        await sendEmail({
            email:user.email,
            subject:"Email Verification OTP",
            message:`Your OTP is ${otp}`
        });

        res.status(200).json({
            success:true,
            message:"OTP resent successfully."
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}