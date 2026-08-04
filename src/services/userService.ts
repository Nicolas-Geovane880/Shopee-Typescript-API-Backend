import { ConflictException } from "../exceptions/conflictException.js";
import { userResponseSchema, type UserCreateSchema } from "../types/userSchema.js";
import { ErrorMessage } from "../constants/errorMessage.js";
import prisma from "../utils/prismaInstance.js";
import bcrypt from "bcryptjs";
import { ResourceNotFound } from "../exceptions/resourceNotFound.js";

export const save = async (dto: UserCreateSchema) => {
    const byEmail = await findByEmail (dto.email);

    if (byEmail) throw new ConflictException (409, ErrorMessage.EMAIL_ALREADY_USED);

    const passwordHash = await bcrypt.hash (dto.password, 12);

    const user = await prisma.$transaction (async (tx) => {
        const userCreated = await tx.user.create ({
            data: {
                name: dto.name,
                email: dto.email.toLowerCase (),
                password_hash: passwordHash,
            },
        });

        await tx.userShopCashInfos.create ({
            data: { user_id: userCreated.id},
        });

        return userCreated;
    })

    return userResponseSchema.parse (user);
}

export const existsByEmail = async (email: string) => {
    const byEmail = await prisma.user.findUnique ({where: { email }});

    if (byEmail) return true;

    return false;
}

export const findByEmail = (email: string) => {
    return prisma.user.findUnique ({
        where: {email: email},
    });
}

export const me = async (userId: number) => {
    const user = await prisma.user.findUnique ({
        where: {id: userId},
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    if (!user) throw new ResourceNotFound (400, ErrorMessage.USER_NOT_FOUND);

    return user;
}