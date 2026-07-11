import { save, findByEmail } from "./userService.js";
import { generateTokens } from "./tokenService.js";
import type { UserCreateSchema } from "../types/userSchema.js";
import type { LoginSchema } from "../types/authSchema.js";
import bcrypt from "bcryptjs";
import { generateCode, sendLoginCode } from "./mailService.js";
import prisma from "../utils/prismaInstance.js";
import type { LoginChallenge } from "../types/prisma/loginChallengeSchema.js";
import { InvalidLoginCodeException } from "../exceptions/invalidLoginCodeException.js";
import { ErrorMessage } from "../constants/errorMessage.js";

export const signup = async (dto: UserCreateSchema) => {
    return await save (dto);
}

export const login = async (dto: LoginSchema) => {
    const user = await findByEmail (dto.email);

    if (!user) throw new Error ();
    
    const isPasswordValid = await bcrypt.compare (dto.password, user.passwordHash);

    if (!isPasswordValid) throw new Error ();

    const code = generateCode ()
    const codeHash = await bcrypt.hash (code, 10);

    const loginChallenge = await prisma.loginChallenge.create ({
        data: {
            userId: user.id,
            codeHash,
            expiresAt: new Date (Date.now () + 1000 * 60 * 5),
        }
    });

    await sendLoginCode (user.email, code);

    return {
        challengeId: loginChallenge.id,
    }
}

export const validateCode = async (dto: {challengeId: string, code: string}) => {
    const loginChallenge = await prisma.loginChallenge.findUnique ({ 
        where: { id: dto.challengeId },
        include: {
            user: true,
        }
     });

    await validateLoginChallenge (loginChallenge!, dto.code);

    await prisma.loginChallenge.update ({
        where: { id: loginChallenge!.id },
        data: {
            consumedAt: new Date (),
        },
    });

    return generateTokens (loginChallenge!.user.id);
}

const validateLoginChallenge = async (loginChallenge: LoginChallenge, code: string) => {
    if (!loginChallenge) {
        throw new InvalidLoginCodeException (400, ErrorMessage.INVALID_LOGIN_CODE);
    }

    if (loginChallenge.consumedAt) {
        throw new InvalidLoginCodeException (400, ErrorMessage.LOGIN_CODE_ALREADY_USED);
    }

    if (loginChallenge.expiresAt < new Date ()) {
        throw new InvalidLoginCodeException (400, ErrorMessage.EXPIRED_LOGIN_CODE);
    }

    if (loginChallenge.attempts >= 5) {
        throw new InvalidLoginCodeException (400, ErrorMessage.TO_MUCH_ATTEMPTS);
    }

    if (!await bcrypt.compare (code.toString (), loginChallenge.codeHash)) {
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