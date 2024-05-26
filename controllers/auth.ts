
import { TOKEN_SECRET, createRandomRef, errorResponse, handleResponse, randomId, saltRounds, successResponse, validateEmail } from "../helpers/utility";
import { Request, Response } from 'express';
import { Op, where } from "sequelize";
import { UserState, UserStatus, Users } from "../models/Users";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { compareTwoStrings } from 'string-similarity';
const cloudinary = require("cloudinary").v2;
import { Sequelize } from "sequelize-typescript";
import { Verify } from "../models/Verify";
import { templateEmail } from "../config/template";
import { sendFcmNotification, sendEmail } from "../services/notification";
import axios from "axios";
import { AvatarGenerator } from 'random-avatar-generator';

const generator = new AvatarGenerator();




export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    const emailServiceId = randomId(12);
    const codeEmail = String(Math.floor(1000 + Math.random() * 9000));

    await Verify.create({
        serviceId: emailServiceId,
        code: codeEmail,
        client: email,
        secret_key: createRandomRef(12, "eizyapp",),
    })
    console.log(codeEmail)
    await sendEmail(email, "Eizy App otp code",
        templateEmail("Eizy Payment otp code", `<div> Your Verification code is: ${codeEmail} <div/>`));
    return successResponse(res, "Successful", {
        status: true,
        emailServiceId
    })
};





export const verifyOtp = async (req: Request, res: Response) => {
    const { emailServiceId, emailCode, type } = req.body;


    console.log(emailServiceId)
    const verifyEmail = await Verify.findOne({
        where: {
            serviceId: emailServiceId
        }
    })

    if (verifyEmail) {
        if (verifyEmail.code === emailCode) {


            const verifyEmailResult = await Verify.findOne({ where: { id: verifyEmail.id } })
            const user = await Users.findOne({ where: { email: verifyEmailResult?.client } })
            console.log(user?.dataValues)
            await user?.update({ state: UserState.VERIFIED })
            await verifyEmailResult?.destroy()
            return successResponse(res, "Successful", {
                message: "successful",
                status: true
            })

        } else {
            errorResponse(res, "Failed", {
                message: `Invalid ${"Email"} Code`,
                status: false
            })
        }
    } else {
        errorResponse(res, "Failed", {
            message: `Invalid ${"Email"} Code`,
            status: false
        })
    }

}






export const register = async (req: Request, res: Response) => {
    const { email, fullname, password, fcmToken } = req.body;
    hash(password, saltRounds, async function (err, hashedPassword) {
        const userEmail = await Users.findOne({ where: { email } })
        if (!validateEmail(email)) return errorResponse(res, "Enter a valid email")
        if (userEmail) {
            if (userEmail?.state === UserState.VERIFIED) {
                if (userEmail) return errorResponse(res, "Email already exist", { state: userEmail.state })
            } else {
                await userEmail?.destroy();

                const user = await Users.create({
                    email, fullname, password: hashedPassword, customerId: "",
                    fcmToken,
                    avater: generator.generateRandomAvatar("https://avataaars.io/?avatarStyle=Circle&topType=WinterHat4&accessoriesType=Blank&hatColor=Heather&facialHairType=BeardMajestic&facialHairColor=Red&clotheType=ShirtScoopNeck&clotheColor=Blue01&eyeType=Surprised&eyebrowType=DefaultNatural&mouthType=Smile&skinColor=Brown")
                })
                const emailServiceId = randomId(12);
                const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
                await Verify.create({
                    serviceId: emailServiceId,
                    code: codeEmail,
                    client: email,
                    secret_key: createRandomRef(12, "eizyapp",),
                })
                await sendEmail(email, "Eizy Payment otp code", templateEmail("Eizy Payment otp code", `<div> Your Verification code is: ${codeEmail} <div/>`));

                let token = sign({ id: user.id, email: user.email }, TOKEN_SECRET);
                return successResponse(res, "Successful", {

                    email, fullname, token, emailServiceId

                })

            }
        } else {

            const user = await Users.create({
                email, fullname, password: hashedPassword, customerId: "", avater: generator.generateRandomAvatar("https://avataaars.io/?avatarStyle=Circle&topType=WinterHat4&accessoriesType=Blank&hatColor=Heather&facialHairType=BeardMajestic&facialHairColor=Red&clotheType=ShirtScoopNeck&clotheColor=Blue01&eyeType=Surprised&eyebrowType=DefaultNatural&mouthType=Smile&skinColor=Brown")
            })
            const emailServiceId = randomId(12);
            const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
            await Verify.create({
                serviceId: emailServiceId,
                code: codeEmail,
                client: email,
                secret_key: createRandomRef(12, "eizyapp",),
            })
            await sendEmail(email, "Eizy Payment otp code", templateEmail("Eizy Payment otp code", `<div> Your Verification code is: ${codeEmail} <div/>`));
            //  sendEmailResend(email, codeEmail.toString());
            let token = sign({ id: user.id, email: user.email }, TOKEN_SECRET);

            return successResponse(res, "Successful", {

                email, fullname, token, emailServiceId

            })

        }
    });
}






export const login = async (req: Request, res: Response) => {
    let { email, password, fcmToken } = req.body;
    const user = await Users.findOne({ where: { email } })
    if (!user) return errorResponse(res, "User does not exist")
    const match = await compare(password, user.password)
    if (!match) return errorResponse(res, "Invalid Credentials",)
    let token = sign({ id: user.id, email: user.email }, TOKEN_SECRET);
    await user.update({ fcmToken })
    if (user.status == UserStatus.INACTIVE) return errorResponse(res, "Account not verified")
    return successResponse(res, "Successful", { ...user.dataValues, token })
}




export const updateUser = async (req: Request, res: Response) => {
    let { fullname, fcmToken } = req.body;
    let { id } = req.user;
    const user = await Users.findOne({ where: { id } })
    if (!user) return errorResponse(res, "Failed", { status: false, message: "User does not exist" })

    if (req.files) {
        let uploadedImageurl = []
        for (var file of req.files as any) {
            const result = await cloudinary.uploader.upload(file.path.replace(/ /g, "_"))
            uploadedImageurl.push(result.secure_url)
        }
        await user.update({ avater: uploadedImageurl[0] })
        const updatedUser = await Users.findOne({ where: { id } })
        return successResponse(res, "Successful", updatedUser)
    } else {
        await user.update({ fullname: fullname == null || fullname == "" ? user.fullname : fullname, fcmToken })
        const updatedUser = await Users.findOne({ where: { id } })
        return successResponse(res, "Successful", updatedUser)
    }
}



export const getUser = async (req: Request, res: Response) => {
    let { id } = req.user;
    const user = await Users.findOne({ where: { id } })
    return successResponse(res, "Successful", user)
}



export const changePassword = async (req: Request, res: Response) => {
    const { password, email } = req.body;

    hash(password, saltRounds, async function (err, hashedPassword) {
        const user = await Users.findOne({ where: { email } });
        user?.update({ password: hashedPassword })
        let token = sign({ id: user!.id, email: user!.email, admin: true }, TOKEN_SECRET);
        return successResponse(res, "Successful", { ...user?.dataValues, token })
    });
};






