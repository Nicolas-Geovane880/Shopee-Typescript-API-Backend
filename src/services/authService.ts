import { InvalidLoginCodeException } from "../exceptions/invalidLoginCodeException.js";
import { InvalidCredentialsException } from "../exceptions/invalidCredentials.js";
import type { LoginChallenge } from "../types/prisma/loginChallengeSchema.js";
import type { UserCreateSchema } from "../types/userSchema.js";
import { generateCode, sendLoginCode, sendResetPasswordLink } from "./mailService.js";
import { ErrorMessage } from "../constants/errorMessage.js";
import type { LoginSchema, ValidateCodeSchema } from "../types/authSchema.js";
import { save, findByEmail } from "./userService.js";
import { generateTokens } from "./tokenService.js";
import prisma from "../utils/prismaInstance.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export const signup = async (dto: UserCreateSchema) => {
    return save (dto);
}

export const login = async (dto: LoginSchema) => {
    const user = await findByEmail (dto.email.toLowerCase ());
    if (!user) throw new InvalidCredentialsException (400, ErrorMessage.INVALID_CREDENTIALS);
    
    const isPasswordValid = await bcrypt.compare (dto.password, user.password_hash);
    if (!isPasswordValid) throw new InvalidCredentialsException (400, ErrorMessage.INVALID_CREDENTIALS);

    const loginChallenge = await saveAndSendLoginCode (user.email, user.id);

    return {
        challengeId: loginChallenge.id,
    }
}

export const validateCode = async (dto: ValidateCodeSchema) => {
    const loginChallenge = await prisma.loginChallenge.findUnique ({ 
        where: { id: dto.challengeId },
        include: {
            user: true,
        }
     });

    await validateLoginChallenge (loginChallenge, dto.code);

    await prisma.loginChallenge.update ({
        where: { id: loginChallenge!.id },
        data: {
            consumed_at: new Date (),
        },
    });

    return generateTokens (loginChallenge!.user.id);
}

export const resendLoginCode = async (challengeId: string) => {
    const loginChallenge = await findLoginChallengeById (challengeId);

    if (!loginChallenge) throw new InvalidLoginCodeException (400, ErrorMessage.LOGIN_CHALLENGE_NOT_FOUND);

    const lastLoginChallenge = await prisma.loginChallenge.findFirst ({
        where: { user_id: loginChallenge.user_id },
        orderBy: {
            created_at: "desc",
        },
    });

    const oneMinuteBefore = new Date (Date.now () - 1000 * 60);

    if (lastLoginChallenge!.created_at > oneMinuteBefore) {
        throw new InvalidLoginCodeException (400, ErrorMessage.AWAIT_TO_ATTEMPT);
    }

    return {
        challengeId: (await saveAndSendLoginCode (loginChallenge.user.email, loginChallenge.user.id)).id,
    }
}

export const isAuthenticated = async (userId: number) => {
    const user = await prisma.user.findUnique ({where: { id: userId }});

    if (user) return true;

    return false;
}

export const sendForgotPasswordLink = async (email: string) => {
    const user = await prisma.user.findUnique ({where: {email}});

    if (!user) return;

    const token = crypto.randomBytes (32).toString ("hex");
    const tokenHash = await bcrypt.hash (token, 10);

    await prisma.resetPasswordToken.create ({
        data: {
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: new Date (Date.now () + 1000 * 60 * 10),
        }
    });

    await sendResetPasswordLink (email, token);
}

export const resetPassword = async (newPassword: string, token: string) => {
    const resetTokensAttempts = await prisma.resetPasswordToken.findMany ({
        where: {
            used_at: null,
            expires_at: {
                gt: new Date (),
            },
        },
        include: {
            user: true,
        },
    });

    const resetToken = await findValidResetToken (resetTokensAttempts, token);

    if (!resetToken) {
        throw new Error ("Expired or invalid token");
    }

    const newPasswordHash = await bcrypt.hash (newPassword, 10);

    prisma.$transaction ([
        prisma.user.update ({
            where: {id: resetToken.user_id},
            data: {
                password_hash: newPasswordHash,
            },
        }),

        prisma.resetPasswordToken.update ({
            where: {id: resetToken.id},
            data: {
                used_at: new Date (),
            },
        }),
    ]);
}

const findValidResetToken = async (resetTokensAttempts: any[], token: string) => {
    for (const resetToken of resetTokensAttempts) {
        const isValid = await bcrypt.compare (token, resetToken.token_hash);

        if (isValid) return resetToken;
    }

    return null;
}

const saveAndSendLoginCode = async (email: string, userId: number) => {
    const code = generateCode ()
    const codeHash = await bcrypt.hash (code, 10);
    
    await sendLoginCode (email, code);

    return prisma.loginChallenge.create ({
        data: {
            user_id: userId,
            code_hash: codeHash,
            expires_at: new Date (Date.now () + 1000 * 60 * 5),
        }
    });
}

const validateLoginChallenge = async (loginChallenge: LoginChallenge, code: string) => {
    if (!loginChallenge) {
        throw new InvalidLoginCodeException (400, ErrorMessage.INVALID_LOGIN_CODE);
    }

    if (loginChallenge.consumed_at) {
        throw new InvalidLoginCodeException (400, ErrorMessage.LOGIN_CODE_ALREADY_USED);
    }

    if (loginChallenge.expires_at < new Date ()) {
        throw new InvalidLoginCodeException (400, ErrorMessage.EXPIRED_LOGIN_CODE);
    }

    if (loginChallenge.attempts >= 5) {
        throw new InvalidLoginCodeException (400, ErrorMessage.TO_MUCH_ATTEMPTS);
    }

    if (!await bcrypt.compare (code.toString (), loginChallenge.code_hash)) {
        await prisma.loginChallenge.update ({
            where: { id: loginChallenge.id },
            data: {
                attempts: {
                    increment: 1,
                }
            },
        });

        throw new InvalidLoginCodeException (400, ErrorMessage.INVALID_LOGIN_CODE);
    }
}

const findLoginChallengeById = async (challengeId: string) => {
    return prisma.loginChallenge.findUnique ({ 
        where: { id: challengeId },
        include: {
            user: true,
        }
     });
}